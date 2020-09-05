const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../models');

const User = db.User;

module.exports = (app) => {
  //初始化
  app.use(passport.initialize());
  app.use(passport.session());

  // 設定本地登入策略
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      (req, email, password, done) => {
        // 查找資料庫有無傳入的email
        User.findOne({ where: { email } })
          .then((user) => {
            // 1. email不存在
            if (!user) {
              console.log(user);
              return done(
                null,
                false,
                req.flash('login_error_msg', 'That email is not registered!'),
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              //console.log(isMatch);
              // 2. 密碼輸入錯誤
              if (!isMatch) {
                return done(
                  null,
                  false,
                  req.flash('login_error_msg', 'Email or Password Incorrect!'),
                );
              }
              // 3. 資料正確，回傳user資訊
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      },
    ),
  );
  // 設定Facebook登入策略
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName'],
        auth_type: 'reauthenticate',
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json;
        User.findOne({ where: { email } }).then((user) => {
          if (user) return done(null, user);
          const randomPassword = Math.random().toString(36).slice(-8);

          return bcrypt
            .genSalt(10)
            .then((salt) => {
              return bcrypt.hash(randomPassword, salt);
            })
            .then((hash) => {
              return User.create({ name, email, password: hash });
            })
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      },
    ),
  );

  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    //console.log(user);
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then((user) => {
        user = user.toJSON();
        done(null, user);
      })
      .catch((err) => done(err, null));
  });
};

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const routes = require('./routes');
const session = require('express-session');
const flash = require('connect-flash');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 載入passport設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport');

const app = express();
const PORT = 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
usePassport(app);

app.use(flash());
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.login_error_msg = req.flash('login_error_msg');
  res.locals.warning_msg = req.flash('warning_msg');
  return next();
});

app.use(routes);
// app.get('/', (req, res) => {
//   res.send('hi');
// });

app.listen(PORT, () => {
  console.log(`Running on localhost:${PORT}`);
});

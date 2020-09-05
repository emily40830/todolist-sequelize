const express = require('express');
const router = express.Router();
const db = require('../../models');
const Todo = db.Todo;

router.get('/', (req, res) => {
  const id = req.user.id;
  console.log(id);
  return Todo.findAll({
    raw: true,
    nest: true,
    where: { UserId: id },
  })
    .then((todos) => {
      return res.render('index', { todos });
    })
    .catch((err) => console.log(err));
});

module.exports = router;

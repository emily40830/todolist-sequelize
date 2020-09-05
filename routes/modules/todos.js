const express = require('express');
const router = express.Router();
const Todo = require('../../models').Todo;
// const bodyParser = require('body-parser')

// Create
router.get('/new', (req, res) => {
  res.render('new');
});

router.post('/', (req, res) => {
  const userId = req.user.id;
  //console.log(userId);
  const name = req.body.name; // 從req.body 拿出表單裡的name的資料
  //console.log(name);

  return Todo.create({
    UserId: userId,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }) // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch((error) => console.log(error));
});

//Read
router.get('/:id', (req, res) => {
  //const userId = req.user._id;
  const id = req.params.id;

  return Todo.findByPk(id)
    .then((todo) => res.render('detail', { todo: todo.toJSON() }))
    .catch((err) => console.log(err));
});

//Update
router.get('/:id/edit', (req, res) => {
  //const userId = req.user.id;
  const id = req.params.id;

  return Todo.findByPk(id) //查詢資料
    .then((todo) => res.render('edit', { todo: todo.toJSON() }))
    .catch((error) => console.log(error));
});

router.put('/:id', (req, res) => {
  //const userId = req.user._id;
  const id = req.params.id;
  const { name, isDone } = req.body;

  return Todo.update({ name, isDone: isDone === 'on' }, { where: { id } })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});

//Delete
router.delete('/:id', (req, res) => {
  //const userId = req.user._id;
  const id = req.params.id;

  return Todo.destroy({ where: { id } })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));
});

module.exports = router;

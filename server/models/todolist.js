const db = require('../config/db.js'),
      todoModel = '../schema/list.js'; // 引入todolist的表结构
const TodolistDb = db.Todolist; // 映入数据库

const Todolist = TodolistDb.import(todoModel);

const getTodolistById = async function(id) {
  const todolist = await Todolist.findAll({
    where: {
      user_id: id
    },
    attributes: ['id', 'content', 'status'] //只需要返回三个字段的结果
  })
  return todolist;
}

const createTodolist = async function(data) {
  await Todolist.create({
    user_id: data.id, // 用户的id，用来确定给哪个用户创建
    content: data.content,
    status: data.status
  })
  return true
}

module.exports = {
  getTodolistById,
  createTodolist
}

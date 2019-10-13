const todolist = require('../models/todolist.js');

const getTodolist = async function(ctx) {
  const id = ctx.params.id;
  const result = await todolist.getTodolistById(id);
  ctx.body = result;
}

const createTodolist = async function(ctx) {
  const data  = ctx.request.body;
  const result = await todolist.createTodolist(data);

  ctx.body = {
    success: true
  }
}

module.exports = {
  getTodolist,
  createTodolist
}

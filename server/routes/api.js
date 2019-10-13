const api = require('../controllers/todolist.js')
const router = require('koa-router')()

router.get('/todolist/:id', api.getTodolist)
router.post('/todolist', api.createTodolist)

module.exports = router; //导出路由规则

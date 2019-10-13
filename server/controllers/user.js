// controllers/user.js

const user = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const getUserInfo = async function (ctx){
  const id = ctx.params.id; // 获取url里传过来的参数里的id
  const result = await user.getUserById(id);  // 通过yield “同步”地返回查询结果
  ctx.body = result // 将请求的结果放到response的body里返回
}

const postUserAuth = async function(ctx) {
  const data = ctx.request.body;
  const userInfo = await user.getUserByName(data.name);

  if(userInfo != null) {
    if(!bcrypt.compareSync(data.password, userInfo.password)){
      ctx.body = {
        success: false,
        info: '密码错误！'
      }
    }else {
      const userToken = {
        name: userInfo.user_name,
        id: userInfo.id
      }
      const secret = 'vue-koa-demo'; //指定密钥，这是之后用来判断token合法性的标志
      const token = jwt.sign(userToken, secret); //签发token
      ctx.body = {
        success: true,
        token: token
      }
    }
  }else {
    ctx.body = {
      success: false,
      info: '用户不存在！'
    }
  }
}

module.exports = {
  getUserInfo, // 把获取用户信息的方法暴露出去
  postUserAuth
}

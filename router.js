/**
 * 路由表
 */



var route = require('./routes/index');
var express = require('express');
var router = express.Router();
var contorl = require('./dbhelper/db');


// 显示主界面
router.get('/', route.index);
// 显示登陆界面
router.get('/login', route.login);
// 显示注册界面
router.get('/register', route.register);

// 执行登陆
router.post('/doLogin', contorl.doLogin);
// 执行注册时获取验证码
router.post('/getMsg', contorl.getMsg);
// 执行注册
router.post('/doRegister', contorl.doRegister);
// 执行注销
router.post('/doCancle', contorl.doCancle);


module.exports = router;
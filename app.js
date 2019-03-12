/**
 * 以下所讲内容呢，只是一个示例
 */

var express = require('express');
var app = express();
var db = require('./models/init')
var path = require('path')
var session = require('./config/session');




// 跨域问题
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // 第二个参数表示允许跨域的域名，* 代表所有域名
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS') // 允许的 http 请求的方法
  // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  if (req.method == 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json());


// 定义跳过token检验的请求接口
var excludeUris = [
  '/doLogin',
  '/getMsg',
  '/user',
  '/user/re'
]

// 检验请求路径接口是否在excludeUris这个数组中的方法
function inArray(stringToSearch, arrayToSearch) {
  for (s = 0; s < arrayToSearch.length; s++) {
    thisEntry = arrayToSearch[s].toString();
    if (thisEntry == stringToSearch) {
      return true;
    }
  }
  return false;
}

// 写一个中间件判断前端请求接口是否存在token
app.use(function (req, res, next) {

  // 获取请求路径
  var uri = req.path;

  // 将请求路径放入inArray中判断
  if (inArray(uri, excludeUris)) {
    next();
    return;
  }

  var access_token

  if (req.method == "POST") {
    // 这里我不知道前端POST请求的时候把token放在json里还是请求头里，具体情况具体分析，下面是放在json里请求数据的
    access_token = req.body.access_token
  }
  if (req.method == "GET") {
    access_token = req.query.access_token;
  }

  if (!access_token) {
    res.json({
      code: 0,
      message: '未认证'
    })
    return;
  }

  var user_info = session[access_token];

  if (!user_info || user_info.expire_in - new Date().getTime() < 0) {
    res.json({
      code: -1,
      message: '非法token'
    })
    return;
  }

  session[access_token].expire_in = new Date().getTime() + 1000 * 60 * 60;

  req.user_info = user_info;
  next();
})

// 启动路由表
var route = require('./router');
app.use(route);

// 测试接口
var s = require('./routes/users')
app.use(s)


// 连接服务器
app.listen(3000, function () {
  console.log("连接服务器成功");
})

// 连接数据库
db.connect();

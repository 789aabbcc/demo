/**
 * 以下所讲内容呢，只是一个示例
 */

var express = require('express');
var app = express();
var db = require('./models/init')
var path = require('path')
var session = require('express-session');
// 引入connect-mongo用于express连接数据库存储session
var mongoStore = require('connect-mongo')(session);

app.use(session({
  //参数配置
  secret: 'luckystar',//加密字符串 
  name: 'userid',//返回客户端key的名称，默认为connect_sid 
  resave: false,//强制保存session，即使它没有变化 
  saveUninitialized: true,//强制将未初始化的session存储。当新建一个session且未设定属性或值时，它就处于未初始化状态。在设定cookie前，这对于登录验证，减轻服务器存储压力，权限控制是有帮助的，默认为true 
  cookie: { maxAge: 50000 },
  rolling: true, //在每次请求时进行设置cookie，将重置cookie过期时间 
  store: new mongoStore({  //将session数据存储到mongo数据库中 

    url: 'mongodb://127.0.0.1/session', //数据库地址 
    touchAfter: 24 * 3600 //多长时间往数据库中更新存储一次，除了在会话数据上更改了某些数据除外

  })
}));

app.use(express.json());

// 启动路由表
let route = require('./router');
app.use(route);

// 界面渲染
// 设置模板路径，默认为./views
// express中支持的模版有.ejs和.jade，.ejs的和.html是一样的，只是.ejs是一个可以动态传值的模版，而html是一个静态页面。
app.set('views', path.join('views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 连接服务器
app.listen(3000, function () {
  console.log("连接服务器成功");
})

// 连接数据库
db.connect();
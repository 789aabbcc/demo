//执行连接数据库操作和表单读取

var mongoose = require('mongoose');
var db = require('../config/settings');//数据库名称

exports.connect = function () {
    //连接数据库
    mongoose.connect(db, { useNewUrlParser: true })
    var maxConnectTimes = 0;  //最多重连次数

    //增加监听事件
    mongoose.connection.on('disconnected', function () {
        console.log('数据库已断开');
        if (maxConnectTimes <= 3) {
            mongoose.connect(db);
            maxConnectTimes++
        } else {
            console.log('数据库问题，请手动处理....')
        }
    })

    mongoose.connection.on('error', function () {
        console.log('数据库出错');
        if (maxConnectTimes <= 3) {
            mongoose.connect(db);
            maxConnectTimes++
        } else {
            console.log('数据库问题，请手动处理....')
        }
    })

    mongoose.connection.on('open', function () {
        console.log('数据库连接成功')
    })


}
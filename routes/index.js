// var express = require('express');
// var router = express.Router();
var UserSchema = require('../models/Schema/user')

//   //  res.sendFile() 

/**
 * 主界面
 */
exports.index = function (req, res, next) {

  var user_id = req.user_info.user_id;
  UserSchema.find({ "user_id": user_id }, function () {

    var Nickname = result[0].Nickname;
    var Avatar = result[0].Avatar;

    // 没有设置头像时使用默认头像
    if (result[0].Avatar == null) {
      Avatar = "https://timgsa.baidu.com/timg?image&amp;quality=80&amp;size=b9999_10000&amp;sec=1551940631962&amp;di=bb6f53aa284acaca729ae77916b55ec8&amp;imgtype=0&amp;src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F11385343fbf2b2114a65cd70c48065380cd78e41.jpg";
    } else {
      Avatar = result[0].Avatar;
    }

    res.json('index', {
      "Nickname": Nickname,
      "Avatar": Avatar,
    });

  });

}


/**
 * 登陆界面
 */
exports.login = function (req, res, next) {

  var user_id = req.user_info.user_id;
  UserSchema.find({ "user_id": user_id }, function (err, result) {

    var Nickname = result[0].Nickname;
    var Avatar = result[0].Avatar;

    // 没有设置头像时使用默认头像
    if (result[0].Avatar == null) {
      Avatar = "default.jpg";
    } else {
      Avatar = result[0].Avatar;
    }

    res.json({
      "Nickname": Nickname,
      "Avatar": Avatar,
    })

  });

}

/**
 * 注册界面
 */
exports.register = function (req, res, next) {

  // 如果已经登陆的话，将登陆者信息重新传回主界面

  var user_id = req.user_info.user_id;
  UserSchema.find({ "user_id": user_id }, function (err, result) {

    var Nickname = result[0].Nickname;
    var Avatar = result[0].Avatar;

    // 没有设置头像时使用默认头像
    if (result[0].Avatar == null) {
      Avatar = "default.jpg";
    } else {
      Avatar = result[0].Avatar;
    }

    res.json({
      "Nickname": Nickname,
      "Avatar": Avatar,
    })

  });


}


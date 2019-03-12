var express = require('express');
var router = express.Router();
var session = require('../config/session')
var UserSchema = require('../models/Schema/user')
var uuid = require('uuidv4')
var md5 = require('../config/md5')
/* GET users listing. */
/**
 * 测试接口
 */

// 把现在已经登陆的token展现出来
router.get('/user', function (req, res, next) {
  console.log(session)
  res.json({ session });
});

router.get('/user/re', function (req, res, next) {
  var user_id = uuid().replace(/-/g, '');
  var user = new UserSchema({
    user_id,
    PhoneNumber: 15035611109,
    Password: md5("123123"),
    State: 1
  });
  user.save();
});


module.exports = router;

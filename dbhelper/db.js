/**
 * 业务逻辑的操作
 */

// !!!一定要看清楚数据类型，有时候报错是因为前端和后台数据类型不一样而导致的报错

var UserSchema = require('../models/Schema/user');
var md5 = require('../config/md5');
var session = require('../config/session');
var uuid = require('uuidv4')
/**
 * 执行登陆
 */

exports.doLogin = function (req, res, next) {

    var PhoneNumber = req.body.PhoneNumber;
    var Password = md5(req.body.Password);

    UserSchema.find({ "PhoneNumber": PhoneNumber }, function (err, result) {
        console.log(result)
        // 先看有没有这个人
        if (result == '') {
            res.json({
                "state_code": 200,
                "code": 0,
                "depict": "登陆失败，用户不存在"
            })
        } else {
            // 判断是否被拉黑
            if (result[0].State == 1) {
                // 判断用户名密码是否匹配
                if (Password == result[0].Password) {

                    var access_token = uuid();

                    // 将过期时间和 user_id 存入session
                    session[access_token] = {
                        user_id: result[0].user_id,
                        expire_in: new Date().getTime() + 1000 * 60 * 60
                    }
                    res.json({
                        access_token,
                        "state_code": 200,
                        "code": 1,
                        "depict": "登陆成功"
                    })
                } else {
                    res.json({
                        "state_code": 200,
                        "code": -1,
                        "depict": "登陆失败，密码错误"
                    })
                }
            } else {
                res.json({
                    "state_code": 200,
                    "code": -2,
                    "depict": "登陆失败，用户已被拉黑"
                })
            }
        }
    })

}



/**
 * 注册时获取验证码
 */
exports.getMsg = function (req, res, next) {

    var PhoneNumber = req.body.PhoneNumber;
    // 六位随机数验证码
    var testNumber = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);
    UserSchema.find({ "PhoneNumber": PhoneNumber }, function (err, result) {
        if (result == '') {

            // 将验证码和手机存入session
            var access_token = uuid();
            session[access_token] = {
                PhoneNumber: PhoneNumber,
                testNumber: testNumber.toString(),
                expire_in: new Date().getTime() + 1000 * 60 * 60
            }

            res.json({
                access_token,
                "testNumber": testNumber,
                "state_code": 200,
                "code": 1,
                "depict": "获取验证码成功"
            })

        } else {
            res.json({
                "state_code": 200,
                "code": -1,
                "depict": "该用户已注册，获取验证码失败"
            })
        }
    })

}

/**
 * 执行注册
 */
exports.doRegister = function (req, res, next) {

    var PhoneNumber = req.body.PhoneNumber;
    var Password = md5(req.body.Password);
    var testNumber = req.body.testNumber;

    var SPhoneNumber = req.user_info.PhoneNumber;
    var StestNumber = req.user_info.testNumber;

    if (PhoneNumber === SPhoneNumber && testNumber === StestNumber) {

        var user_id = uuid().replace(/-/g, '');
        var user = new UserSchema({
            user_id,
            PhoneNumber: PhoneNumber,
            Password: Password,
            State: 1
        });
        user.save();

        // 将手机号和验证码的session删除
        req.user_info = {}

        var access_token = uuid();
        session[access_token] = {
            user_id,
            expire_in: new Date().getTime() + 1000 * 60 * 60
        }

        res.json({
            access_token,
            "state_code": 200,
            "code": 1,
            "depict": "注册成功"
        })



    } else {
        res.json({
            "state_code": 200,
            "code": -1,
            "depict": "验证码输入错误"
        })
    }
}



/**
 * 执行注销
 */
exports.doCancle = function (req, res, next) {

    req.user_info.expire_in = 0;
    res.json({
        "state_code": 200,
        "code": 1,
        "depict": "注销成功"
    })

}

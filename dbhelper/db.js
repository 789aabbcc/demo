/**
 * 业务逻辑的操作
 */


var UserSchema = require('../models/Schema/user');
var md5 = require('../config/md5');
var LoginSession = {}
var RegisterSession = {}
/**
 * 执行登陆
 */

exports.doLogin = function (req, res, next) {


    var PhoneNumber = req.body.PhoneNumber;
    var Password = md5(req.body.Password);

    UserSchema.find({ "PhoneNumber": PhoneNumber }, function (err, result) {
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

                    LoginSession.user_id = result[0].user_id;
                    LoginSession.login = 1;

                    res.json({
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
            RegisterSession.PhoneNumber = PhoneNumber;
            RegisterSession.testNumber = testNumber;

            console.log(RegisterSession)

            res.json({
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
    var SPhoneNumber = RegisterSession.PhoneNumber;
    var StestNumber = RegisterSession.testNumber;

    if (PhoneNumber === SPhoneNumber && testNumber === StestNumber) {

        var user = new UserSchema({
            PhoneNumber: PhoneNumber,
            Password: Password,
            State: 1
        });
        user.save();
        res.json({
            "state_code": 200,
            "code": 1,
            "depict": "注册成功"
        })

        RegisterSession = {}

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

    LoginSession.login = null;
    res.json({
        "state_code": 200,
        "code": 1,
        "depict": "注销成功"
    })

}
var mongoose = require('mongoose');
var Schema = mongoose.Schema; //和数据库一一映射的桥梁


var userSchema = Schema
    ({
        //定义用户数据字段
        Nickname: {
            type: String,
            default: null
        },
        Password: {
            type: String,
            default: null
        },
        Avatar: {
            type: String,
            default: null
        },
        PhoneNumber: {
            type: Number,
            default: null
        },
        Created_At: {
            type: Date,
            default: Date.now()
        },
        Updated_At: {
            type: Date,
            default: Date.now()
        },
        State: {
            type: Number,
            default: 1
        }


    });

var UserSchema = mongoose.model('users', userSchema);

module.exports = UserSchema;
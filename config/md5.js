var crypto = require('crypto');

module.exports = function (Password) {
    var md5 = crypto.createHash('md5');
    var Password = md5.update(Password).digest('base64');
    return Password;
};
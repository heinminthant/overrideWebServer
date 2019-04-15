// Nodejs encryption with CTR
const crypto = require('crypto');
var key = "&8g010Nhx;;Y|6m";


module.exports = {

    encrypt: function(text){
        var cipher = crypto.createCipher('aes-256-cbc', key);
        var crypted = cipher.update(text, 'utf-8', 'hex');
        crypted += cipher.final('hex');

        return crypted;
    },
    decrypt: function(data){
        var decipher = crypto.createDecipher('aes-256-cbc', key);
        var decrypted = decipher.update(data, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    }
}


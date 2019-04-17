const db = require('./dbNew')
const dialogflow = require('dialogflow')
const crypto = require('./crypto')

var num = crypto.encrypt('494e54a9fba7d529-551714450ad7d709-2cc4587f1ed2d72e')
console.log(num)
crypto.decrypt('68a5b7db992c1807218b485b58ac3c1f')
console.log(num)
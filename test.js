const db = require('./dbNew')
const dialogflow = require('dialogflow')
const crypto = require('./crypto')

var num = crypto.decrypt('68a5b7db992c1807218b485b58ac3c1f')
console.log(num)
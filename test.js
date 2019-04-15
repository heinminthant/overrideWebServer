const db = require('./dbNew')
db.getDocument(810191770).then(function(result){
    console.log(result)
})
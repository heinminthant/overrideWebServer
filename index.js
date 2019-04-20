const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const formidable = require('formidable')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin123@override-nekvr.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });








const PORT = process.env.PORT || 5000;
const db = require('./dbNew');
const dflow = require('./dialogflow')
const crypto = require('./crypto')
const viber = require('./viber')

//Web Server Init   

client.connect(err => {

const collection = client.db("over_ride").collection("users");
const responseCollection = client.db("over_ride").collection("responses")

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({
    secret: 'krunal',
    resave: false,
    saveUninitialized: true,
}));    



app.set('view engine', 'ejs');


// exec()

// Home Page

app.get('/', (req, res) => {
    res.send('<h1>Testing</h1>');
});



app.post('/sendRoute', (req, res) => {
    app.post('/' + req.body.route, (req, res) => {
       
        if (req.body.message === undefined) {
            res.send("OK")
        } else if (req.body.message.text != undefined) {
            var token = req.originalUrl.substr(1)
            token = token.split('?')[0]
            collection.findOne({token:token}).then(function(document){
                var privateKey = document.chat_service.dialogflow.private_key;
                var projectID = document.chat_service.dialogflow.project_id
                var privateKey = crypto.decrypt(privateKey);
                var user_id = document.user_id
                
                let config = {
                    credentials: {
                        private_key: privateKey,
                        client_email: document.chat_service.dialogflow.client_email
                    }
                }

                var vtoken = crypto.decrypt(document.social_media.viber.access_token)

                dflow.detectIntent(projectID, config, req.body.message.text).then(function (result) {
                    var intentID = result.intent.name.split('/')[4]
                    responseCollection.findOne({user_id,intentID}).then(function(results){
                        results.forEach(function (result) {
                        
                            if (result.type === 'text') {
                                viber.sendMessage(req.body.sender.id, result.data, vtoken)
                            }
                            else if(result.type === 'image'){
                               
                                viber.sendImage(req.body.sender.id,result.data,result.desc,vtoken)
                            }
                            else if(result.type === 'carousel'){
                                viber.sendCarousel(req.body.sender.id,vtoken,result.data)
                            }
                        })
                    })
                
                })
                res.send("OK")
                
            })
            
        }




        
    })
    res.send("OK")
})



app.get('/stuff', (req, res) => {
    res.send(req.body)
})



// Request sent from viber
// app.post('/viber', (req, res) => {
//     console.log(req.body)
//     res.send("Hello")

    // if(req.body.message != undefined){
    //    //  console.log("It is undefined ");
    //     var messageObject = req.body.message;
    //     var text = messageObject.text;
    //     db.getDocument()
    // }

// });

// async function exec(){

//     db.getTokens().then(function(result){
//        result.forEach(function(token){
//            token = token.social_media.viber.access_token


//            var route = '/'+token

//            app.post(route,(req,res)=>{
//                if(req.body.message === undefined){
//                    res.send("OK")
//                }

//                else if(req.body.message.text != undefined){
//                 var token = req.originalUrl.substr(1)
//                 token = token.split('?')[0]
//                      db.getUserIDToken(token).then(function(document){
//                     var privateKey = document.chat_service.dialogflow.private_key;
//                     var projectID = document.chat_service.dialogflow.project_id
//                     var privateKey = crypto.decrypt(privateKey);

//                       let config = {
//                         credentials: {
//                           private_key: privateKey,
//                           client_email: document.chat_service.dialogflow.client_email
//                         }
//                       }
//                     //   console.log(token)

//                       var vtoken = crypto.decrypt(document.social_media.viber.access_token)
//                       console.log(vtoken)

//                        dflow.detectIntent(projectID,config,req.body.message.text).then(function(result){
//                            var intentID = result.intent.name.split('/')[4]
//                            db.getResponses(intentID,document.user_id).then(function(results){


//                                results.forEach(function(result){
//                                   if(result.type === 'text'){
//                                     viber.sendMessage(req.body.sender.id,result.data,vtoken)
//                                   }
//                                })

//                            })
//                        })





//                 })
//                }




//                 res.send("OK")
//            })
//        })
//     })

// }
// app.get('/viberRoutes', (req, res) => {





//     res.send("Hello")
// })



app.post('/ggmanlay', (req, res) => {
    res.send("OK")

})

app.get('/dflowGuide', (req, res) => {
    res.sendFile(__dirname + '/public/dflowGuide.html');

})
app.get('/viberGuide', (req, res) => {
    res.sendFile(__dirname + '/public/viberGuide.html');

})

app.get('/trainingPhrases', (req, res) => {



    // console.log(req.query.token)
    if (req.session.token === undefined) {
        req.session.token = req.query.token

    }

    if (req.query.userID === undefined || req.query.intentID === undefined) {
        res.send('Invalid URL Parameters. Use Telegram bot to open this page.')
    } else {
        var user_id = parseInt(req.query.userID)
        var data = {
            userID: user_id,
            intentID: req.query.intentID
        }

        collection.findOne({user_id:user_id}).then(function(result){
            if (req.session.token === undefined || req.session.token !== result.utoken) {
                res.render('pages/login', {
                    data: data
                })
            } else {
                collection.findOne({user_id:user_id}).then(function(document){
                    var privateKey = document.chat_service.dialogflow.private_key;
                    var projectID = document.chat_service.dialogflow.project_id
                    var privateKey = crypto.decrypt(privateKey);

                    let config = {
                        credentials: {
                            private_key: privateKey,
                            client_email: document.chat_service.dialogflow.client_email
                        }
                    }
                    var phrases = []
                    dflow.getIntent(projectID, data.intentID, config).then(function (result) {
                        var trainingPhrases = result.trainingPhrases
                        trainingPhrases.forEach(function (phrase) {

                            phrases.push(phrase.parts[0].text)

                        })
                        var data = {
                            'phrases': phrases,
                            'userID': user_id,
                            'intentID': req.query.intentID
                        }
                        res.render('pages/trainingPhrases', {
                            data: data
                        })


                    })

                })

                // res.render('pages/trainingPhrases',{data:data})
            }

        })
    }

})

app.get('/responses', (req, res) => {

    if (req.session.token === undefined) {
        req.session.token = req.query.token

    }




    if (req.query.userID === undefined || req.query.intentID === undefined) {
        res.send('Invalid URL Parameters. Use Telegram bot to open this page.')
    } else {
        var user_id = parseInt(req.query.userID)
        var data = {
            userID: user_id,
            intentID: req.query.intentID,
            site: "responses"
        }

        collection.findOne({user_id:user_id}).then(function(result){
            if (req.session.token === undefined || req.session.token !== result.utoken) {
                res.render('pages/login', {
                    data: data
                })
            } else {
                res.render('pages/responses', {
                    data: data
                })

            }

        })
    }

})

app.post('/storePhrases', (req, res) => {
 
    var phrases = req.body.phrases
    var user_id = req.body.userID
    var intentID = req.body.intentID
    collection.findOne({user_id:user_id}).then(function(document){

        var privateKey = document.chat_service.dialogflow.private_key;
        var projectID = document.chat_service.dialogflow.project_id
        var privateKey = crypto.decrypt(privateKey);

        let config = {
            credentials: {
                private_key: privateKey,
                client_email: document.chat_service.dialogflow.client_email
            }
        }
        var trainingPhrases = []
        phrases.forEach(function (phrase) {
            trainingPhrases.push({
                parts: [{
                    text: phrase
                }],
                type: 'EXAMPLE'
            })
        })
        dflow.getIntent(projectID, intentID, config).then(function (result) {
            dflow.updateIntent(projectID, config, result, trainingPhrases)
            res.send("Success")
        })
    })
})

app.post('/viberTest',(req,res)=>{
    res.send("OK")
})

app.post('/storeResponses', (req, res) => {
   
    var userID = req.body.userID
    var intentID = req.body.intentID
    var responses = req.body.responses
    console.log(responses)
    console.log(req.body)
  
    collection.findOne({user_id:userID,intentID}).then(function(result){
        if(result === null){
            doc = {
                "user_id" : user_id,
                "intentID" : intentID,
                "responses" : responses
            }

            collection.insertOne(doc).then(function(result){
                console.log(result)
            })
        }
        else{
            collection.updateOne({user_id,intentID},{$set : {responses:responses}})

            
        }
    })
    res.send('Ok')
})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
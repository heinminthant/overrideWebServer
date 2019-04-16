const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');





const PORT = process.env.PORT || 5000;
const db = require('./dbNew');
const dflow = require('./dialogflow')
const crypto = require('./crypto')

//Web Server Init

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({ secret: 'krunal', resave: false, saveUninitialized: true, }));



app.set('view engine', 'ejs');



// Home Page

app.get('/',(req,res)=>{
    res.send('<h1>Testing</h1>');
});





app.get('/stuff',(req,res)=>{
    res.send(req.body)
})



// Request sent from viber
app.post('/viber',(req,res)=>{
    res.send(req.body);
   
    if(req.body.message != undefined){
       //  console.log("It is undefined ");
        var messageObject = req.body.message;
        var text = messageObject.text;
        console.log(text);
    }
  
});

app.post('/ggmanlay',(req,res)=>{
    res.send("OK")

})

app.get('/dflowGuide',(req,res)=>{
    res.sendFile(__dirname + '/public/dflowGuide.html');

})
app.get('/viberGuide',(req,res)=>{
    res.sendFile(__dirname + '/public/viberGuide.html');

})

app.get('/trainingPhrases',(req,res)=>{

    

    // console.log(req.query.token)
    if(req.session.token === undefined){
        req.session.token = req.query.token
 
    }

    if(req.query.userID === undefined || req.query.intentID === undefined){
        res.send('Invalid URL Parameters. Use Telegram bot to open this page.')
    }
    else{
        var user_id = parseInt(req.query.userID)
        var data ={
            userID : user_id,
            intentID : req.query.intentID
        }
   
        db.getDocument(user_id).then(function(result){
            if(req.session.token === undefined || req.session.token !== result.utoken){
                res.render('pages/login',{data:data})
            }
            else{
                db.getDocument(user_id).then(function(document){
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
                  dflow.getIntent(projectID,data.intentID,config).then(function(result){
                      var trainingPhrases = result.trainingPhrases
                      trainingPhrases.forEach(function(phrase){
                        
                       phrases.push(phrase.parts[0].text)
                        
                      })
                    var data = {'phrases' : phrases,
                    'userID' : user_id, 'intentID' : req.query.intentID}
                    res.render('pages/trainingPhrases',{data:data})

                      
                  })
                    
                })
                
                // res.render('pages/trainingPhrases',{data:data})
            }
           
        }) 
    }
    
    })
    app.get('/responses',(req,res)=>{
        
        if(req.session.token === undefined){
            req.session.token = req.query.token
     
    }
        
        
        
    
        if(req.query.userID === undefined || req.query.intentID === undefined){
            res.send('Invalid URL Parameters. Use Telegram bot to open this page.')
        }
        else{
            var user_id = parseInt(req.query.userID)
            var data ={
                userID : user_id,
                intentID : req.query.intentID,
                site : "responses"
            }
       
            db.getDocument(user_id).then(function(result){
                if(req.session.token === undefined || req.session.token !== result.utoken){
                    res.render('pages/login',{data:data})
                }
                else{
                    res.render('pages/responses',{data:data})
                   
                }
               
            }) 
        }

    })

    app.post('/storePhrases',(req,res)=>{
        var phrases = req.body.phrases
        var user_id = req.body.userID
        var intentID = req.body.intentID
        db.getDocument(user_id).then(function(document){
       
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
        phrases.forEach(function(phrase){
            trainingPhrases.push({
                parts: [{
                    text:phrase
                }],
                type: 'EXAMPLE'
            })
        })
        dflow.getIntent(projectID,intentID,config).then(function(result){
            dflow.updateIntent(projectID,config,result,trainingPhrases)
            res.send("Success")
        })
        })
})

app.post('/storeResponses',(req,res)=>{
    
    var userID = req.body.userID
    var intentID = req.body.intentID
    var responses = req.body.responses
    db.updateResponse(userID,intentID,responses)
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

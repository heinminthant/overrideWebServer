const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');





const PORT = process.env.PORT || 5000;
const db = require('./dbNew');

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

app.get('/gg',(req,res) => {
    if(req.session.page_views){
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
     } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
     }
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

app.get('/dflowGuide',(req,res)=>{
    res.sendFile(__dirname + '/public/dflowGuide.html');

})
app.get('/viberGuide',(req,res)=>{
    res.sendFile(__dirname + '/public/viberGuide.html');

})

app.get('/trainingPhrases',(req,res)=>{
    if(req.query.userID === undefined || req.query.intentID === undefined){
        res.render('/pages/wrongURL')
    }
    else{
        var user_id = parseInt(req.query.userID)


        db.getDocument(user_id).then(function(result){
            console.log(result.utoken)
        })
    }
    
})

app.post('/storePhrases',(req,res)=>{
    console.log(req.body.phrases)
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require ('express');
const app = express();
const bodyParser = require('body-parser');


const PORT = process.env.PORT || 5000;

//Web Server Init

app.use(express.json());
app.use(bodyParser.json());
app.set('views', './views');
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

app.get('/dflowGuide',(req,res)=>{
    res.sendFile(__dirname + '/public/dflowGuide.html');

})
app.get('/viberGuide',(req,res)=>{
    res.sendFile(__dirname + '/public/viberGuide.html');

})

app.get('/trainingPhrases',(req,res)=>{
    res.render('pages/trainingPhrases')
})

app.post('/storePhrases',(req,res)=>{
    console.log(req.body.phrases)
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

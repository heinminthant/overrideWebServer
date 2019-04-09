const express = require ('express');
const app = express();
const bodyParser = require('body-parser');


const PORT = process.env.PORT || 5000;

//Web Server Init

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('public/start.html'))


// Home Page

app.get('/',(req,res)=>{
    res.send('<h1>Testing</h1>');
});

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

app.get('/viber',(req,res)=>{
   
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

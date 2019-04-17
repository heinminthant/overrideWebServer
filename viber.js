var request = require('request');


module.exports = {
    sendMessage: function(receiver,text,token){
        // console.log(receiver)
        // console.log(text)
        // console.log(token)
        var req = {
            "receiver":receiver,
            "min_api_version":1,
            "sender":{
               "name":"John McClane",
               "avatar":"http://avatar.example.com"
            },
            "tracking_data":"tracking data",
            "type":"text",
            "text":text
         }

       
            request.post({
                url: 'https://chatapi.viber.com/pa/send_message',
                body: req,
                headers:{
                    'X-Viber-Auth-Token' : token
                },
                json: true  
                }, function (error, response, body) {
                   console.log(body)
                });
        
    }
}
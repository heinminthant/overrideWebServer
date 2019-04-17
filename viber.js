var request = require('request');


module.exports = {
    sendMessage: function(receiver,text,token){
      
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
                   
                });
        
    },
    sendImage: function(receiver,imgURL,desc,token){
        console.log("Receiver : " +receiver)
        console.log("Img : " + imgURL)
        console.log("Desc : " + desc)
        console.log("Token : " + token)
        
        var req = {  
            "receiver":receiver,
            "min_api_version":1,
            "sender":{  
               "name":"John McClane",
               "avatar":"http://avatar.example.com"
            },
            "tracking_data":"tracking data",
            "type":"picture",
            "text":desc,
            "media":imgURL,
            "thumbnail":imgURL
         }

       
            request.post({
                url: 'https://chatapi.viber.com/pa/send_message',
                body: req,
                headers:{
                    'X-Viber-Auth-Token' : token
                },
                json: true  
                }, function (error, response, body) {
                   
                });

    },
    sendCarousel: function(receiver,token,content){
        var buttons = []

        content.forEach(function(con){
            buttons.push( {	
                "Columns":6,
                "Rows":4,
                "ActionType":"none",
                "Image":con.imgURL,
                "BgColor":"#A12412"
                
             })
             buttons.push({
                "Columns":6,
                "Rows":2,
                "ActionType":"none",
                "Text":"<font color=#323232><b>" + con.title + "</b></font><br><font color=#777777>"+ con.subtitle +"</font>",
                "TextSize":"large",
                "TextVAlign":"center",
                "TextHAlign":"middle",
               
                "BgColor":"#A12412"
                
             })
             buttons.push({
                "Columns":6,
                "Rows":1,
                "ActionType":"reply",
                "ActionBody": "Yo Yo",
                "Text":"<font color=#323232><b>"+con.button+"</b></font>",
                "TextSize":"large",
                "TextVAlign":"center",
                "TextHAlign":"middle",
                "BgColor":"#E2211D"
                
             })

        })
        console.log(buttons)


        var req = {  
            "receiver":receiver,
            "type":"rich_media",
            "min_api_version":2,
            "rich_media":{
               "Type":"rich_media",
               "ButtonsGroupColumns":6,
               "ButtonsGroupRows":7,
               "BgColor":"#FFFFFF",
               
         }
    }

    }
}
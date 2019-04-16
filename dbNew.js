const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin123@override-nekvr.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });



module.exports = {
    //Function for inserting a document
    //Takes an object in a json like structure
    insertDocument: function(doc){
        client.connect(err => {
            const collection = client.db("over_ride").collection("users");

            collection.insertOne(doc)
           
           
            
        });
    },

    //Update Document
    updateDocument: function(userID,key,value){
        
        client.connect(err => {
            const collection = client.db("over_ride").collection("users");
            collection.updateOne({user_id:userID},{$set : {[key]:value}});
            
        })
    },

    //Function for checking if the the user already initialized.
    checkUserID: async function(userID){
        var isExist;
        return new Promise(function(resolve,reject){
            client.connect(err => {
                const collection = client.db("over_ride").collection("users");
                
                collection.find({user_id:userID}).count().then(function(checkCount){
                    if(checkCount>0){
                        isExist = true;
                    }
                    else{
                        isExist = false;
                    }
                    
                    resolve(isExist);
                  }).catch(function(err){
                    // console.log(err)
                  });
                  
                
             });
        });
        },
        //Get Viber Connection Status
        getViberStatus: function(userID){
            
            return new Promise(function(resolve,reject){
                client.connect(err => {
                    const collection = client.db("over_ride").collection("users");
    
                    collection.findOne({user_id:userID},function(err,result){
                        
                        resolve(result.social_media.viber.connected);
                        
                    })
                     
                })
            })
            
       
           
        },
        getAccessToken: function(userID){
            
            return new Promise(function(resolve,reject){
                client.connect(err => {
                    const collection = client.db("over_ride").collection("users");
    
                    collection.findOne({user_id:userID},function(err,result){
                        
                    resolve(result.social_media.viber.access_token);
                        
                    })
                     
                })
            })
                 
        },
        getConfig: function(userID){
            return new Promise(function(resolve,reject){
                client.connect(err => {
                    const collection = client.db("over_ride").collection("users");
    
                    collection.findOne({user_id:userID},function(err,result){
                       
                    resolve(result.chat_service.dialogflow);
                        
                    })
                })
            })
        },
        getDocument: function(userID){
        
            return new Promise(function(resolve,reject){
                client.connect(err => {
                    const collection = client.db("over_ride").collection("users");
    
                    collection.findOne({user_id:userID},function(err,result){
                 
                    resolve(result);
                        
                    })
                })
            })
        },
        getMsgID: function(userID){
            return new Promise(function(resolve,reject){
    

            client.connect(err => {
                const collection = client.db("over_ride").collection("tokenCheck");
               
                    collection.findOne({user_id:userID},function(err,result){
                        // console.log("Result " + result.msg_ID)
                        // console.log(result)
                        resolve(result)
                    })
                
         
            })
        })
        },
        updateMsgID: function(userID,messageID,type){
            client.connect(err => {
                const collection = client.db("over_ride").collection("tokenCheck");
                return new Promise(async function(resolve,reject){
                    collection.updateOne({user_id:userID},{$set : {msg_ID:messageID,type:type}},function(err,result){
                        resolve(result)
                    })
                })
                
            })
        },
        updateResponse: function(user_id,intentID,responses){
          
            client.connect(err => {
                const collection = client.db("over_ride").collection("responses");
                collection.findOne({user_id,intentID},function(err,result){
                    
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
                })
            })
        },
       getTokens: async function(){
        return new Promise(function(resolve,reject){
           client.connect(err => {
               const collection = client.db("over_ride").collection("users");
              
                collection.find({}).toArray(function(err,result){
                 
                  resolve(result)
                })
               })
               
           })
       },
       getUserIDToken: async function(token){
           console.log(token)
           return new Promise(function(resolve,reject){
               client.connect(err => {
                   const collection = client.db("over_ride").collection("users")

                   collection.findOne({token:token},function(err,result){
                       resolve(result)
                   })
               })
           })
       }

       

  
} 


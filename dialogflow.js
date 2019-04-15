const dialogflow = require('dialogflow');

module.exports = {
    listIntents: async function (projectId,config){
        
        const intentClient = new dialogflow.IntentsClient(config);
    
        const projectAgentPath = intentClient.projectAgentPath(projectId);
        
        const request = {
            parent: projectAgentPath
        }
       
        
        
        const [response] = await intentClient.listIntents(request)

        return new Promise(function(resolve,reject){ 
        var intents = []    
        
        response.forEach(intent => {
            intents.push(intent)
        
        })

       

        resolve(intents)
        
    })
    },
    deleteIntent : async function(projectID,intentID,config){
        const intentsClient = new dialogflow.IntentsClient(config);
        
        const intentPath = intentsClient.intentPath(projectID, intentID);

        
        const request = {name: intentPath};
        
        var result
       

        // Send the request for deleting the intent.
        return new Promise(async function(resolve,rejecct){
            await intentsClient.deleteIntent(request).then((value) => {
                // fulfillment
                result = value
              }, (reason) => {
                result = reason
              });
              resolve(result)
        })

       

    },
    getIntent : async function(projectID,intentID,config){
        const intentsClient = new dialogflow.IntentsClient(config,projectID)
        const intentPath = intentsClient.intentPath(projectID,intentID)
        
        const request = {name: intentPath,
          intentView: 'INTENT_VIEW_FULL'};
        
        var intent
    
        return new Promise(async function(resolve,reject){
          await intentsClient.getIntent(request).then(function(result){
            intent = result[0]
            console.log(intent.trainingPhrases)
            resolve(intent)
          })
        })

    },
    addIntent: async function(projectID,displayName,config){
        const intentsClient = new dialogflow.IntentsClient(config,projectID)
        const agentPath = intentsClient.projectAgentPath(projectID);
        const trainingPhrases = [];
   
        var result;
        const messageText = [
           
        ];
        const intent = {
            displayName: displayName,
            trainingPhrases: trainingPhrases,
            messages: messageText,
          };
       

          const createIntentRequest = {
            parent: agentPath,
            intent: intent,
          };
          return new Promise(async function(resolve,reject){
            await intentsClient.createIntent(createIntentRequest).then((value) => {
                // fulfillment
                result = value
              }, (reason) => {
                result = reason
              });
                
                resolve(result)       
            
                   
            
        })
               
 
          
          
        //   console.log(responses)
        


    },
    updateIntent: async function(projectID,config,phrase,intent){
      const intentsClient = new dialogflow.IntentsClient(config,projectID)
      

      let trainingPhrase = {
        parts: [{
            text: phrase
        }],
        type: 'EXAMPLE'
      }
     
      intent.trainingPhrases.push(trainingPhrase)
  
      const updateRequest = {
        intent: intent,
        intentView: 'INTENT_VIEW_FULL'

      }
      await intentsClient.updateIntent(updateRequest).then(function(result){
        
      })
    }


}
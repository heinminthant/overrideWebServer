const db = require('./dbNew')
const dialogflow = require('dialogflow')
const crypto = require('./crypto')

db.getDocument(810191770).then(function(result){
    var privateKey = result.chat_service.dialogflow.private_key;
    var projectID = result.chat_service.dialogflow.project_id
    var privateKey = crypto.decrypt(privateKey);
      
      let config = {
        credentials: {
          private_key: privateKey,
          client_email: result.chat_service.dialogflow.client_email
        }
      }

      const agentClient = new dialogflow.AgentsClient(config)

      
      agentClient.
    //   agentClient.getAgent()
    //   agentClient.trainAgent()
})
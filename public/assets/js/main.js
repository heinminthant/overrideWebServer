$(document).ready(function () {
    
   
    $("#add").click(function (e) { 
        counter++
        e.preventDefault()
        $("#phrases").append('<div class="row" id="phrase' + counter + '"><input class="input-field col s12" type="text" id = "field' + counter + '"placeholder="Add Training Phrase" class="validate"> <a class="waves-effect waves-light btn" id="delete"><i class="material-icons">delete</i></a></div>');
      
    });
    

    $('body').on('click','#delete',function(e){
        $(this).parent('div').remove()
    })

    $("#save").click(function (e) {
       var i, phrases = []
       for (i = 1; i <= counter; i++) {
     
        phrases.push($("#field"+i).val())
      }
      data = {}
      data.phrases = phrases
      $.ajax({
          type: "POST",
          url: "https://override-webserver.herokuapp.com/storePhrases",
          data: JSON.stringify(data),
          contentType: 'application/json',
          success: function (response) {
              
          }
      });
   
    })
    
});


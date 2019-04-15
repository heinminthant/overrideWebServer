$(document).ready(function () {
    var counter = 1
   
    $("#add").click(function (e) { 
        counter++
        e.preventDefault()
        $("#phrases").append('<div class="row" id="phrase' + counter + '"><input class="input-field col s9" type="text" placeholder="Add Training Phrase" class="validate"> <a class="waves-effect waves-light btn" id="delete"><i class="material-icons">delete</i></a></div>');
      
    });
    $('#delete').click(function (e) { 
        e.preventDefault();
        
    });

    $('body').on('click','#delete',function(e){
        $(this).parent('div').remove()
    })
    
});


$(document).ready(function(){
    $('#frog').hide();
    $('#hide').hide();

    $('#show').click(function(){
        $('#frog').show();
        $('#hide').show(200);
    });
        
    $('#hide').click(function(){
            $('#frog').hide();
            $('#hide').hide(200);
    });
});



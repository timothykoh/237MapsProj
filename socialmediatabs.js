$(document).ready(function(){

    $("#tabs li").click(function() {

        $("#tabs li").removeClass('active');


        $(this).addClass("active");
 

        $(".tab_content").hide();
 

        var selected_tab = $(this).find("a").attr("href");
 

        $(selected_tab).fadeIn();
        
        return false;
    });
});
$(document).ready(function () {

    currentWindowLocation = window.location.href.replace('#','').split('/').pop(); //get the last value in the location path
    $(`.${currentWindowLocation}-link`).css({background:'#00897b'}) // highlights the current link in the navbar
    
    $('.footer-list .footer-link').on('mouseover',function(){
        $(this).css({border: '4px solid #00897b'}).animate({boderWidth:4}, 500);
    }).mouseout(function(){
        $(this).css({border: '1px solid #00897b'}).animate({boderWidth:4}, 500);
    })

    
})
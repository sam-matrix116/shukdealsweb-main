const $ = window.jQuery();
$('.offer-slider').owlCarousel({
    loop:true,
    margin:18,
    responsiveClass:true,
    nav:true,
    navText:['<img src="assets/img/icon/left-arrow.svg">','<img src="assets/img/icon/right-arrow.svg">'],
    dots:false,
    loop:false,
    responsive:{
        0:{
            items:2,
            margin:5,
            nav:false,
            stagePadding:25
        },
        575:{
            items:2,
            margin:5,
            nav:false,
            stagePadding:0
        },
        767:{
            items:3,
            nav:true
        },
        850:{
            items:4
        },
        1150:{
            items:5            
        }
    }
});


$('.ngo-slider').owlCarousel({
    loop:true,
    margin:18,
    responsiveClass:true,
    nav:true,
    navText:['<img src="assets/img/icon/left-arrow.svg">','<img src="assets/img/icon/right-arrow.svg">'],
    dots:false,
    loop:false,
    responsive:{
        0:{
            items:2,
            margin:5,
            nav:false,
            stagePadding:15
        },
        575:{
            items:2,
            margin:5,
            nav:false,
            stagePadding:0
        },
        767:{
            items:3,
            nav:true
        },
        850:{
            items:4
        }
    }
});




/// DEAL DETAILS USER VIEW

$(document).ready(function () {

    $(".deal-slider").owlCarousel({
      loop: true,
      items: 1,
      margin: 0,
      stagePadding: 0,
      autoplay: false });
  
  
    dotcount = 1;
  
    jQuery('.deal-slider .owl-dot').each(function () {
      jQuery(this).addClass('dotnumber' + dotcount);
      jQuery(this).attr('data-info', dotcount);
      dotcount = dotcount + 1;
    });
  
    slidecount = 1;
  
    jQuery('.deal-slider .owl-item').not('.cloned').each(function () {
      jQuery(this).addClass('slidenumber' + slidecount);
      slidecount = slidecount + 1;
    });
  
    jQuery('.deal-slider .owl-dot').each(function () {
      grab = jQuery(this).data('info');
      slidegrab = jQuery('.slidenumber' + grab + ' img').attr('src');
      jQuery(this).css("background-image", "url(" + slidegrab + ")");
    });
  
    amount = $('.deal-slider .owl-dot').length;
    gotowidth = 100 / amount;
    jQuery('.deal-slider .owl-dot').css("height", gotowidth + "%");
  
  });


  $('textarea').keyup(function() {
    
    var characterCount = $(this).val().length,
        current = $('#current'),
        maximum = $('#maximum'),
        theCount = $('#the-count');
      
    current.text(characterCount);
        
  });

  $("#multiple").select2({
    placeholder: "Select",
    allowClear: true
});


$(function() {
    $('.pwd-group').find('.pwd-field').each(function(index, input) {
        var $input = $(input);
        $input.parent().find('.pwd-visibility').click(function() {
            var change = "";
            if ($(this).find('i').hasClass('fa-eye')) {
                $(this).find('i').removeClass('fa-eye')
                $(this).find('i').addClass('fa-eye-slash')
                change = "text";
            } else {
                $(this).find('i').removeClass('fa-eye-slash')
                $(this).find('i').addClass('fa-eye')
                change = "password";
            }
            var rep = $("<input type='" + change + "' />")
                .attr('id', $input.attr('id'))
                .attr('name', $input.attr('name'))
                .attr('class', $input.attr('class'))
                .val($input.val())
                .insertBefore($input);
            $input.remove();
            $input = rep;
        }).insertAfter($input);
    });





var langArray = [];
$('.languages option').each(function () {
  var img = $(this).attr("data-thumbnail");
  var text = this.innerText;
  var value = $(this).val();
  var item = '<li><img src="' + img + '" alt="" value="' + value + '"/><span>' + text + '</span></li>';
  langArray.push(item);
});

$('#lang_list').html(langArray);

//Set the button value to the first el of the array
$('.selected-lang').html(langArray[0]);
$('.selected-lang').attr('value', 'en');

//change button stuff on click
$('#lang_list li').click(function () {
  var img = $(this).find('img').attr("src");
  var value = $(this).find('img').attr('value');
  var text = this.innerText;
  var item = '<li><img src="' + img + '" alt="" /><span>' + text + '</span></li>';
  $('.selected-lang').html(item);
  $('.selected-lang').attr('value', value);
  $(".lang-dropdown").toggle();
  //console.log(value);
});

$(".selected-lang").click(function () {
  $(".lang-dropdown").toggle();
});

//check local storage for the lang
var sessionLang = localStorage.getItem('lang');
if (sessionLang) {
  //find an item with value of sessionLang
  var langIndex = langArray.indexOf(sessionLang);
  $('.selected-lang').html(langArray[langIndex]);
  $('.selected-lang').attr('value', sessionLang);
} else {
  var langIndex = langArray.indexOf('ch');
  // console.log(langIndex);
  $('.selected-lang').html(langArray[langIndex]);
  //$('.btn-select').attr('value', 'en');
}

});



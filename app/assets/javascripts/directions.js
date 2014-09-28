$(document).ready(function() {
  $('.directions-panel-container').hide();
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    $('.directions-panel-container').css('width', '100%');
    $('.directions-panel-container').show().scroll();
    // $('.directions-panel-container').scroll();

    // $('#directions-panel-0, #directions-panel-1, #directions-panel-2').css('width', '90%');
  });
});

$(document).ready(function() {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    $('.search-form-container').hide();
    $('#map-canvas').css('width', '65%');
    $('.directions-panel-container').css('width', '35%');
    $('.direcitons-panel-container').scroll();
    $('#directions-panel-0, #directions-panel-1, #directions-panel-2').css('width', '90%');
  });
});

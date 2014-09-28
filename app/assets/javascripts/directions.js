$(document).ready(function() {
  $('.directions-panel-container').hide();
  $('#directions').hide();
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    $('#directions').show();


  });
  $('#directions').on('click', function(event) {
    event.preventDefault();
    if ($('#directions').text() === 'List Directions') {
      $('.directions-panel-container').css('width', '100%');
      $('.directions-panel-container').show().scroll();
      $('#directions').html('Hide Directions');
    } else {
      $('.directions-panel-container').hide();
      $('#directions').html('List Directions');
    }
  });
});


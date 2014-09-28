$(document).ready(function() {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    // var controlsContainer = $("<div class='controls-container'></div>");
    // var newSearchButton = $("<button class='search-button pure-button button-success'>New Search</button>");
    // var bikesButton = $("<button class='bikes-button pure-button'>Bikes</button>");
    // var docksButton = $("<button class='docks-button pure-button'>Docks</button>");

    // $('.search-form-container').hide();
    // $('#map-canvas').css('width', '65%');
    // $('.directions-panel-container').css('width', '35%');
    // $('.direcitons-panel-container').scroll();
    // $('#directions-panel-0, #directions-panel-1, #directions-panel-2').css('width', '90%');
    // $('#directions-panel-container').prepend(controlsContainer);
    $('#directions-panel-container').show();
    // $('.controls-container').append(newSearchButton, bikesButton, docksButton);

    // $('body').on('click', '.search-button', function(event) {
    //   event.preventDefault();
    //   $('.directions-panel-container').hide();
    //   $('.search-form-container').show();
    //   $('#map-canvas').css('width', '100%');
    //   $('.directions-panel-container').css('width', '0%');
      // $('.directions-panel-container').show();
      // console.log("here");
    // });
  });
});

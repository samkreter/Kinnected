// Turn off some jquery mobile stuff
$.mobile.linkBindingEnabled = false;
$.mobile.hashListeningEnabled = false;

positionFooter = function() {
  headerHeight = $('#header').outerHeight();
  contentHeight = $('#content').outerHeight();
  footerHeight = $('#footer').outerHeight();
  windowHeight = $(window).height();
  if ( (headerHeight+contentHeight+footerHeight) < windowHeight ) {
    $(footer).addClass('fixed-bottom');
    $(footer).removeClass('relative-bottom');
    $(body).addClass('fixed-bottom');
    $(body).removeClass('relative-bottom');
  } else {
    $(footer).removeClass('fixed-bottom');
    $(footer).addClass('relative-bottom');
    $(body).removeClass('fixed-bottom');
    $(body).addClass('relative-bottom');
  }
};
  
slidebar = function() {
    $('#sidebar').toggleClass('wide');
  }

slidebarOut = function() {
    $('#sidebar').addClass('wide');
  }

slidebarIn = function() {
    $('#sidebar').removeClass('wide');
  }


runPositionFooter = function() {
  setTimeout(positionFooter,50);
}

$(function(){

  positionFooter();

  $(window)
  .scroll(positionFooter)
  .resize(positionFooter)

  if( ! $.mobile.support.touch ) {
    var sidebar = $("#sidebar");
    $(sidebar)
    .hover(slidebarOut,slidebarIn);
  } else {
    var sidebar = $("#sidebar");
    $(sidebar)
    .tap(slidebar)
    .swipeleft(slidebarIn)
    .swiperight(slidebarOut);

    $('#body')
    .tap(slidebarIn);
  }
});
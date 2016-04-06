$(function() {
  // Slick Carousel
  $('.carousel').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    infinite: true,
    speed: 1000,
    adaptiveHeight: true,
    fade: true,
    cssEase: 'linear'
  });
  $('.carousel').on('afterChange',positionFooter);
})
$(document).ready(function () {

  module = new NHSUK.Modules.HighlightActiveSectionHeading();
  module.start($('.js-page-nav'));

  NHSUK.stickAtTopWhenScrolling.init();
  NHSUK.stopScrollingAtFooter.addEl($('.js-stick-at-top-when-scrolling'), $('.js-stick-at-top-when-scrolling').height());

  // scroll to internal content
  var scrollToContent = (function () {

    $('.js-page-nav-list a[href^="#"]').on('click', function (e) {
      e.preventDefault();
      var target = $(this.hash),
          $target = $(target),
          extraOffset = 15;

      // scroll to
      $('html, body').animate({
        scrollTop: target.offset().top - extraOffset
      }, 1000);
    });
  }());

  

  // webtrends for common questions
  var webtrendsSummary = (function () {
  
    var submitTracking = function (el) {

      var isOpen = $(el).attr('aria-expanded'),
          $status = isOpen === 'true' ? 'open' : 'close',
          $qheader = $(el).find('.c-common-questions__header').text();

      Webtrends.multiTrack({ element: this, argsa: ["DCSext.Details", $qheader, "DCSext.DetailsType", $status, "WT.dl", "121"] });
    }
    
    $('summary').on('click', function () {
      submitTracking(this);
    });

    $('summary').on('keydown', function (e) {
      if (e.which === 13) { // enter
        $(this).click();
        return false;
      }
    });

  }());

 

  // disable links
  // except hydrocortisone internal links, temporarily
  var disableLinks = (function () {
    $('.local-header__intro a[href^="http"], .column--two-thirds a[href^="http"]').not('.inline-list a[href^="http"], .local-header__intro a[href*="/hydrocortisone"], .column--two-thirds a[href*="/hydrocortisone"]').click(function (e) {
      e.preventDefault();
    });
  }());


  // back-to-top
  var backToTop = (function () {

    var $btt = $('.c-back-to-top'),
    bttShow = 'js-c-back-to-top-show',
    offset = 250,
    duration = 300,
    breakpoint = 640,
//    $stickyBanner = $('.notification-banner--sticky'),
    bottomPosition = 15;

    $(window).scroll(function () {
      if ($(this).scrollTop() > offset) {
//        if (($(window).width() <= breakpoint) && ($stickyBanner.css('display') == 'block')) {
//        if (($(window).width() <= breakpoint) ) {
          $btt.addClass(bttShow).fadeIn(duration).css('bottom', bottomPosition);
//        }
      } else {
        $btt.removeClass(bttShow).fadeOut(duration);
      }
    });

    $btt.click(function (event) {
      event.preventDefault();
      $('html, body').animate({ scrollTop: 0 }, 500);
      return false;
    })

  }());


  // dirty indent of 'child' links
  var indentLinks = (function () {
    $('.inline-list a:contains("Hydrocortisone "), .inline-list a:contains("Isotretinoin ")').parent().addClass('list-child');

  }());


  // audio player
  var audioPlayer = (function () {

    var player = document.getElementById('c-audio'),
      $audioplayer = $('.c-audioplayer');

    if (player) {

      player.removeAttribute("controls");
      $audioplayer.removeClass('c-audio-hidden');

      $('.c-audioplayer__playbutton').on('click', function () {
        player.play();
      });

    }

  }());

});


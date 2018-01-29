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


  // Open all and close all links for common questions
  var openCloseAll = (function () {

    $('.c-common-questions').before('<div class="js-opencloseall"><a href="#" aria-hidden="true" class="js-open-all" onclick="Webtrends.multiTrack({ element: this, argsa: [\'DCSext.Anchor\', \'CQ-OpenAll\', \'WT.dl\', \'121\'] });" onkeypress="this.onclick()">Open all</a> <a href="#" aria-hidden="true" class="js-close-all js-openclose-disable" onclick="Webtrends.multiTrack({ element: this, argsa: [\'DCSext.Anchor\', \'CQ-CloseAll\', \'WT.dl\', \'121\'] });" onkeypress="this.onclick()">Close all</a></div>');

    var $openAllLink = $('.js-open-all'),
        $closeAllLink = $('.js-close-all'),
        disableLink = 'js-openclose-disable',
        $elementDetails = $('.c-common-questions__details'),
        $elementSummary = $('.c-common-questions__summary'),
        elementDetailsTotal = $elementDetails.length;

    $openAllLink.click(function (e) {
      e.preventDefault();
      $closeAllLink.removeClass(disableLink);
      $(this).addClass(disableLink);
      $elementDetails.attr('open', '');
      $elementSummary.attr('aria-expanded', 'true')
    });

    $closeAllLink.click(function (e) {
      e.preventDefault();
      $openAllLink.removeClass(disableLink);
      $(this).addClass(disableLink);
      $elementDetails.removeAttr('open');
      $elementSummary.attr('aria-expanded', 'false')
    });

    $elementDetails.on('click', function () {

      var delay = setTimeout(function () { // added delay due to bug in firefox which required a delay in details.polyfill.js line 154
        var detailsOpen = $('.c-common-questions__summary[aria-expanded="true"]').length;

        switch (true) {

          case detailsOpen >= 1 && detailsOpen < elementDetailsTotal:
            $closeAllLink.removeClass(disableLink);
            $openAllLink.removeClass(disableLink);
            break;

          case detailsOpen === 0:
            $openAllLink.removeClass(disableLink);
            $closeAllLink.addClass(disableLink);
            break;

          case detailsOpen === elementDetailsTotal:
            $openAllLink.addClass(disableLink);
            $closeAllLink.removeClass(disableLink);
            break;
        }

      }, 100);

    });

  }());


  // sticky footer banner
  var stickyBanner = (function () {

    var $stickyBanner = $('.notification-banner--sticky'),
        $stickyBannerList = $('.notification-banner--sticky__list'),
        $backtotop = $('.c-back-to-top'),
        closeButtonHTML = '<li class="o-list-inline__item notification-banner--sticky__list-item"><a href="#" class="button button--banner js-close-stickybanner-link" role="button">No thanks</a></li>',
        offset = 50,
        duration = 200,
        bottomPosition = 15;

    $stickyBannerList.append(closeButtonHTML);

    $('.js-close-stickybanner-link').on('click', function (e) {
      e.preventDefault();
      $stickyBanner.addClass('js-hide').hide();
      $backtotop.css('bottom', bottomPosition);
    });

    $stickyBanner.hide();

    $(window).scroll(function () {
      if ($(this).scrollTop() > offset) {
        if (!($stickyBanner.hasClass('js-hide'))) {
          $stickyBanner.fadeIn(duration);
        }
      } else {
        $stickyBanner.fadeOut(duration);
      }
    });

  }());


  // back-to-top
  var backToTop = (function () {

    var $btt = $('.c-back-to-top'),
    bttShow = 'js-c-back-to-top-show',
    offset = 250,
    duration = 300,
    breakpoint = 640,
    $stickyBanner = $('.notification-banner--sticky'),
    bottomPosition = 15;

    $(window).scroll(function () {
      if ($(this).scrollTop() > offset) {
        if ( ($(window).width() <= breakpoint) && ($stickyBanner.css('display') == 'block') ) {
          bannerHeight = $stickyBanner.height() + 30;
          $btt.addClass(bttShow).fadeIn(duration).css('bottom', bannerHeight);
        } else {
          $btt.addClass(bttShow).fadeIn(duration).css('bottom', bottomPosition);
        }
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
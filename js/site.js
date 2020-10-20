let totalItems = $('.section').length;
let currentItem = 0;
let loadingLine = $('.loading-line-inner-wrapper');
let links = [];
let isMobile = window.innerWidth < 640;

$('.section').each(function() {
    var link = $(this).attr('data-href');
    links.push(link);
});

let adjustLoadingLine = (item) => {
    let currentPercentage = (item / totalItems) * 100;
    loadingLine.css('width', currentPercentage + '%');
}

let adjustPagination = (item) => {
    let currentPercentage = (item / totalItems) * 100;
    $('.line-wrapper .numbers-wrapper .inner-wrapper').css('transform', 'translateY(-' + currentPercentage + '%)');
}

let openFooter = () => {
    $('body').addClass('footer-open');
}

let closeFooter = () => {
    $('body').removeClass('footer-open');
    setTimeout(function() {
        $.fn.fullpage.setAllowScrolling(true);
    }, 1000);
}

let footerScroll = (item) => {


    $('.container').on('mousewheel', function(e) {
        if (currentItem == totalItems) {
            if (e.originalEvent.deltaY < 0) {
                closeFooter();
            }

            if (e.originalEvent.deltaY > 0) {
                $.fn.fullpage.setAllowScrolling(false);
                openFooter();
            }
        }

    });

}

let slidesAfterLoad = () => {
    //console.log('slide after load etc');

    if (currentItem == totalItems) {
        footerScroll();
        $('.container').addClass('last-item');
    } else {
        $('.container').removeClass('last-item');
    }

    //preload background images for current, prev and next slides

    $('.section:nth-of-type(' + currentItem + '), .section:nth-of-type(' + (currentItem - 1) + '), .section:nth-of-type(' + (currentItem + 1) + ')').find('[data-src]').each(function() {
        var imageUrl = $(this).attr('data-src');

        if (this.nodeName.toUpperCase() == 'IMG') {
            $(this).attr('src', imageUrl);
        } else {
            $(this).removeAttr('data-src')
            $(this).css('background-image', 'url(' + imageUrl + ')');
        }
    });

}



var bg = document.querySelector('.animation-bg');
let bgEasing = 'cubicBezier(1, 0.2, 0.2, 1)';
let bgDuration = 1500;

let animateBackground = (nextSlide, direction) => {

    if (nextSlide == 1) {

        anime({
            targets: bg,
            opacity: 1,
            duration: 0
        });

        anime({
            targets: bg,
            rotate: 0,
            top: '100%',
            duration: bgDuration,
            easing: bgEasing
        });

    }

    if (nextSlide == 2) {

        if (direction == 'down') {

            anime({
                targets: bg,
                duration: 0,
                rotate: 0,
                top: '100%',
                opacity: 1,
            })

            anime({
                targets: bg,
                rotate: 90,
                top: '80%',
                duration: bgDuration,
                easing: bgEasing,
                complete: function() {}
            });
        } else if (direction == 'up') {

            anime({
                targets: bg,
                rotate: -90,
                duration: bgDuration,
                easing: bgEasing,
                complete: function() {
                    $('html, body').css('background-color', '#2041f8');
                    anime({
                        targets: bg,
                        background: '#fff',
                        rotate: 90,
                        duration: 0
                    })
                }
            });

        }

    }

    if (nextSlide == 3) {
        if (direction == 'down') {
            $('html, body').css('background-color', '#fff');
            anime({
                targets: bg,
                rotate: -90,
                duration: 0,
                opacity: 1,
                background: '#2041F8'
            });
            anime({
                targets: bg,
                rotate: 90,
                width: '300%',
                duration: bgDuration,
                easing: bgEasing
            });
        } else if (direction == 'up') {
            anime({
                targets: bg,
                width: '300%',
                duration: bgDuration,
                easing: bgEasing
            });
        }
    }

    if (nextSlide == 4) {

        if (direction == 'up') {
            anime({
                targets: bg,
                opacity: 1,
                duration: 1,
                delay: 1000,
                width: '400%',
                background: '#2041F8',
                top: '80%',
                rotate: 90,
                complete: function() {
                    $('html, body').css('background-color', '#fff');
                }
            });
        } else if (direction == 'down') {
            anime({
                targets: bg,
                rotate: 90,
                duration: 0,
                opacity: 1,
                background: '#2041F8'
            });

            anime({
                targets: bg,
                width: '400%',
                top: '80%',
                duration: bgDuration,
                easing: bgEasing
            });
        }

    }

    if (nextSlide == 5) {

        $('html, body').css('background-color', '#2041f8');

        anime({
            targets: bg,
            opacity: 0,
            duration: 0
        });
    }

}

let fullpageInitialized = false,
    animatedHeader = false;

let fullpageInit = () => {

    fullpageInitialized = true;

    $('#fullpage').fullpage({
        onLeave: function(index, nextIndex, direction) {
            $('.section').removeClass('animated');
            $($('.section').get(nextIndex - 1)).addClass('animated');

            if ($('body').hasClass('homepage')) {
                adjustLoadingLine(nextIndex);
                adjustPagination(nextIndex - 1);
                animateBackground(nextIndex, direction);
            }

            if ($('body').hasClass('homepage') || $('body').hasClass('page-colleges')) {
                if (nextIndex > 2) {
                    $('.mobile-phone-wrapper').addClass('animate-out');
                } else {
                    $('.mobile-phone-wrapper').removeClass('animate-out');
                }
            } else {
                if (nextIndex > 1) {
                    $('.mobile-phone-wrapper').addClass('animate-out');
                } else {
                    $('.mobile-phone-wrapper').removeClass('animate-out');
                }
            }
            setTimeout(function() {
                console.log("nextIndex", nextIndex);
                nextIndex === 1 ? Equicom.animateHeader() : Equicom.stopAnimateHeader();
            })
        },
        afterLoad: function(anchorLink, index, slideAnchor, slideIndex) {
            currentItem = index;



            setTimeout(function() {
                if (!animatedHeader && currentItem === 1) {

                    Equicom.animateHeader();
                    animatedHeader = true;
                }

            });

            slidesAfterLoad();
        },
        scrollingSpeed: 1000,
        easingcss3: 'cubic-bezier(0.86, 0, 0.07, 1)',
        anchors: links
    });
}

if (!isMobile) {
    fullpageInit();
} else {
    $('.section').addClass('animated');
    setTimeout(function() {

        Equicom.animateHeader();


    });
}

$(window).on('resize', function() {
    if ($(window).width() < 640) {
        if (fullpageInitialized === true) {
            //console.log('destroying fullpage');
            $.fn.fullpage.destroy('all');
            fullpageInitialized = false;
            $('.section').addClass('animated');
        }
    } else {
        if (fullpageInitialized === false) {
            //console.log('initializing fullpage');
            $('.section').removeClass('animated');
            fullpageInit();
        }
    }
});


//toggle menu

$('.menu-trigger').on('click', function() {
    $(this).toggleClass('active');
    $('.menu').toggleClass('open');
    if ($('.menu').hasClass('open')) {
        disableScroll();
    } else {
        enableScroll();
    }
});

$('.menu-overlay').on('click', function() {
    $('.menu-trigger').removeClass('active');
    $('.menu').removeClass('open');
    enableScroll();
});


//append numbers to nav

for (var i = 1; i <= totalItems; i++) {
    $('.line-wrapper .numbers-wrapper .inner-wrapper').append('<div>' + i + '</div>');
};



//var buttonBackground = $('.button-background');
if (propsBackground) {
    $('.prop-wrapper').first().append(propsBackground);
}

function onMouseHover(index) {

    console.log("index", index);

    var $this = $(this);

    $('.prop-wrapper, .content-servicios .inner-wrapper').removeClass('active');

    if (propsBackground) {
        propsBackground.css('opacity', '0');
        $this.append(propsBackground);
    }

    //setTimeout(function(){
    //$this.addClass('active');
    //}, 1)


    $(this).addClass('active');
    $('.content-servicios .inner-wrapper').eq(index).addClass('active');

    setTimeout(function() {
        propsBackground.removeAttr('style');
    }, 1);

    if ($(this).attr('data-propimg')) {
        var imgUrl = $(this).attr('data-propimg');
        $('<img/>').attr('src', imgUrl).on('load', function() {
            $(this).remove();
            $('.props-screen').css('background-image', 'url(' + imgUrl + ')');
        });
    }

}

$('.prop-wrapper').each(function(index) {
    $(this).on('mouseover', onMouseHover.bind(this, index));
});


$('.explore-button').on('click', function() {
    if (!isMobile) {
        $.fn.fullpage.moveSectionDown();
    } else {
        $('body, html').animate({
            'scrollTop': $('.section.slide-1').outerHeight() + 80
        }, 700);
    }
});

$("a[data-goto]").on('click', function(e) {
    if (!isMobile) {
        // $.fn.fullpage.moveSectionDown();
    } else {
        $('body, html').animate({
            'scrollTop': $('[data-href="' + $(this).data("goto") + '"]').offset().top
        }, 700);
        $('.menu-overlay').trigger("click");
        e.preventDefault();
    }

})



//business owl carousel

$(document).ready(function() {


    $(".business-carousel").owlCarousel({
        navContainer: $('.controls-wrapper .controls'),
        dots: false,
        nav: true,
        loop: true,
        navText: ['<span class="arrow-wrapper"><div></div></span>', '<span class="arrow-wrapper"><div></div></span>'],
        responsive: {
            0: {
                items: 1
            },
            640: {
                items: 3
            }
        }
    });

    $(".partners-carousel").each(function() {

        $(this).owlCarousel({
            //navContainer: $('.controls-wrapper .controls'),
            dots: false,
            nav: true,
            loop: true,
            items: 1,
            navText: ['<span class="arrow-wrapper"><div></div></span>', '<span class="arrow-wrapper"><div></div></span>']
        });

    });

});



//operating system check

function getOs() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    return "unknown";
}

/*let downnloadButtons = document.querySelectorAll('.download-button');

if (getOs() == 'iOS') {
    $('.download-button').attr('href', '#');
} else if (getOs() == 'Android') {
    $('.download-button').attr('href', '#');
} else {
    $('.download-button').on('click', function(e) {
        e.preventDefault();
        $.fn.fullpage.moveTo($('.section').length);
        $.fn.fullpage.setAllowScrolling(false);
        openFooter();
    });

}*/



var keys = { 37: 1, 38: 1, 39: 1, 40: 1, 32: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

var disableFSlider = function() {
    if (typeof $.fn.fullpage.setAllowScrolling !== 'undefined') {
        $.fn.fullpage.setAllowScrolling(false);
    }
}


var enableFSlider = function() {
    if (typeof $.fn.fullpage.setAllowScrolling !== 'undefined') {
        $.fn.fullpage.setAllowScrolling(true);
    }
}


//disable scroll
var disableScroll = function() {
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
    disableFSlider();
}

//enable scroll
var enableScroll = function() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
    enableFSlider();
}



$(window).on('load', function() {
    $('html, body').addClass('loaded');
    $('.container').css('opacity', '1');
    adjustLoadingLine(1);
});


$(function() {
    $('.lazy').Lazy();
});
if( window.innerWidth > 640 ){

var params = {
  container: $('.button-animation-container').get(0),
  renderer: 'svg',
  loop: true,
  animationData: animationData
};

var buttonAnimation;
var buttonBackground = $('.button-background');

buttonAnimation = lottie.loadAnimation(params);

$('.button').on('mouseover', function(){
  buttonAnimation.stop();
  buttonAnimation.removeEventListener('loopComplete', buttonStopAnimation);
  $(this).append(buttonBackground);
  buttonAnimation.play();
});

var buttonStopAnimation = function(){
  buttonAnimation.stop();
};

$('.button').on('mouseout', function(){
  buttonAnimation.addEventListener('loopComplete', buttonStopAnimation);
});


//props animation

if( $('.prop-list') && window.innerWidth > 640  ){
  $('body').append('<div class="prop-background"><div class="prop-animation-container"></div></div>')
}

var propParams = {
  container: $('.prop-animation-container').get(0),
  renderer: 'svg',
  loop: true,
  animationData: animationData
};

var propsAnimation = lottie.loadAnimation(propParams);
var propsBackground = $('.prop-background');

}
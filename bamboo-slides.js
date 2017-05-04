
/**************************************************************************************************/

	var bambooButtonFadeSpeed	= 500;
	var bambooSlideSpeed      	= 700;
	var bambooSlideEasing     	= 'easeOutQuart';
	var bambooSlideOffset     	= 50;
	var bambooSlideTextSpeed	= 1500;

	var bambooSlideDelay      	= []; 	// 0
	var bambooSlideCount      	= [];	// 0
	var bambooSlideMode       	= [];	// 0
	var bambooCurrentSlide    	= [];	// 0
	var bambooSliding         	= [];	// false
	var bambooTimer			  	= [];	// null
	var bambooInitial	      	= [];	// true

	var bambooWindowWidth		= 0;

/**************************************************************************************************/

	jQuery(document).ready(function(){

		jQuery('.bamboo-slides').each(function(index, el){

			bambooCurrentSlide[index] = 0;
			bambooSliding[index] = false;
			bambooInitial[index] = true;
			bambooSlideCount[index] = jQuery(el).children('.bamboo-slide').length;

			bambooSlideMode[index] = 'switch';
			if(jQuery(el).hasClass('mode-fade')) {
				bambooSlideMode[index] = 'fade';
			}
			if(jQuery(el).hasClass('mode-slide_left')) {
				bambooSlideMode[index] = 'slide_left';
			}
			if(jQuery(el).hasClass('mode-slide_right')) {
				bambooSlideMode[index] = 'slide_right';
			}

			bambooSlideDelay[index] = 0;
			for(var i=0; i<=60; i+=0.5)
			{
				if(jQuery(el).hasClass('timer-' + i)) {
					bambooSlideDelay[index] = i;
				}
			}

			for(var i=0; i<=60; i+=1)
			{
				if(jQuery(el).hasClass('start-' + i)) {
					bambooCurrentSlide[index] = i-1;
				}
			}

			if(bambooSlideCount[index]>1) {
				jQuery(el).mouseenter(function(){bambooSlidesShowButtons(index)});
				jQuery(el).mouseleave(function(){bambooSlidesHideButtons(index)});
			}

			jQuery(el).children('.bamboo-slides-prev-button').click(function(){bambooSlidesPrevSlide(index)});
			jQuery(el).children('.bamboo-slides-next-button').click(function(){bambooSlidesNextSlide(index)});

			jQuery(el).children('.bamboo-slides-prev-button').css({'opacity':0});
			jQuery(el).children('.bamboo-slides-next-button').css({'opacity':0});

			jQuery(el).css({'visibility': 'visible', 'height': jQuery(el).children('.bamboo-slide:eq(0)').outerHeight()});

			jQuery(window).resize(function(){bambooSlidesResize(index)});

			jQuery(window).load(function(){
				jQuery('.bamboo-slides').each(function(index, el){
					bambooSlidesResize(index);
				});
				//bambooSlidesNextSlide(index);
				if(bambooSlideDelay[index]>0) {
					bambooTimer[index] = window.setInterval(function(){
						bambooSlidesNextSlide(index);
					}, bambooSlideDelay[index]*1000);
				}
			});

		});

	});

/**************************************************************************************************/

	function bambooSlidesResize(index) {

		if( jQuery(window).width() != bambooWindowWidth ) {

			bambooWindowWidth = jQuery(window).width();

			jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').each( function(){
				var slide = jQuery(this);
				slide.children('.bamboo-slide-content').css('padding-top', 0);
				slide.css( 'height', 'auto' );
				slide.siblings().each(function(){
					var height = jQuery( this ).height();
					if( height > slide.height() ) {
						slide.height( height );
					} else {
						slide.height( slide.height() );
					}
				});
			});

			jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').each( function(){
				var slide = jQuery(this);
				var content = jQuery(slide.children('.bamboo-slide-content'));
				var padding = slide.height() - content.height();
				if(slide.hasClass('vertical-aligned-middle')) {
					content.css('padding-top', padding/2);
				}
				if(slide.hasClass('vertical-aligned-bottom')) {
					content.css('padding-top', padding);
				}
			});


			jQuery('.bamboo-slides').eq(index).css({'visibility': 'visible', 'height': jQuery(jQuery('.bamboo-slide')[bambooCurrentSlide[index]-1]).outerHeight()});
			bambooCurrentSlide[index] = 0;
			bambooSliding[index] = false;
			bambooInitial[index] = true;
			jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').css({'left':'101%', 'width':'100%'});
			bambooSlidesNextSlide(index);

		}

	}

/**************************************************************************************************/

	function bambooSlidesNextSlide(index) {

		if(!bambooSliding[index]) {

			bambooSliding[index] = true;
			if(bambooInitial[index]) {
				bambooCurrentSlide[index]++;
				if(bambooCurrentSlide[index]>bambooSlideCount[index]) {
					bambooCurrentSlide[index] = 1;
				}
				bambooSlidesNextAnimationIn(index);
				bambooInitial[index] = false;
			} else {
				bambooSlidesNextAnimationOut(index);
				bambooCurrentSlide[index]++;
				if(bambooCurrentSlide[index]>bambooSlideCount[index]) {
					bambooCurrentSlide[index] = 1;
				}
				bambooSlidesNextAnimationIn(index);
			}
			bambooSlidesUpdateIndicators(index);
			bambooSliding[index] = false;

		}

	}

/**************************************************************************************************/

	function bambooSlidesPrevSlide(index) {

		if(!bambooSliding[index]) {

			bambooSliding[index] = true;
			bambooSlidesPrevAnimationOut(index);
			bambooCurrentSlide[index]--;
			if(bambooCurrentSlide[index]===0) {
					bambooCurrentSlide[index] = bambooSlideCount[index];
			}
			bambooSlidesPrevAnimationIn(index);
			bambooSlidesUpdateIndicators(index);
			bambooSliding[index] = false;
		}

	}

/**************************************************************************************************/

	function bambooSlidesUpdateIndicators(index) {

		var indicators = jQuery('.bamboo-slides-indicators');
		if(indicators.length>0) {
			indicators = jQuery(indicators[0]);
			var output = '';
			for (var i = 1; i <= bambooSlideCount[index]; i++) {
				if(i==bambooCurrentSlide[index]) {
					output+='q';
				} else {
					output+='w';
				}
			};
			indicators.html(output);

		}

	}

/**************************************************************************************************/

	function bambooSlidesNextAnimationOut(index) {

		var slideWidth = jQuery('.bamboo-slides').eq(index).width();
		var slide = jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').eq(bambooCurrentSlide[index]-1);

		switch(bambooSlideMode[index])
		{
			case 'switch':
				slide.stop(true, false).velocity({'left': slideWidth*-1}, 0);
				break;

			case 'fade':
				slide.stop(true, false).fadeOut(bambooSlideSpeed);
				break;

			case 'slide_left':
				slide.stop(true, false).velocity({'left': slideWidth*-1}, bambooSlideSpeed, bambooSlideEasing);
				break;

			case 'slide_right':
				slide.stop(true, false).velocity({'left': slideWidth}, bambooSlideSpeed, bambooSlideEasing);
				break;
		}

	}

/**************************************************************************************************/

	function bambooSlidesNextAnimationIn(index) {

		var slide = jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').eq(bambooCurrentSlide[index]-1);
		var slideWidth = jQuery('.bamboo-slides').eq(index).width();
		var slideHeight = slide.outerHeight();

		slide.parent().stop(true, false).velocity({'height': slideHeight}, 0);

		var mode = bambooSlideMode[index];
		if(bambooInitial[index]) mode = 'switch';

		switch(mode) {
			case 'switch':
				slide.stop(true, false);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, 0, bambooSlideEasing, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;

			case 'fade':
				slide.stop(true, false).fadeOut(0);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, 0).fadeIn(bambooSlideSpeed,function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;

			case 'slide_left':
				slide.stop(true, false).velocity({'left': slideWidth}, 0);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, bambooSlideSpeed, bambooSlideEasing, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;

			case 'slide_right':
				slide.stop(true, false).velocity({'left': slideWidth*-1}, 0);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, bambooSlideSpeed, bambooSlideEasing, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;
		}

	}

/**************************************************************************************************/

	function bambooSlidesPrevAnimationOut(index) {

		var slideWidth = jQuery('.bamboo-slides').eq(index).width()+1;
		var slide = jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').eq(bambooCurrentSlide[index]-1);

		switch(bambooSlideMode[index])
		{
			case 'switch':
				slide.stop(true, false).velocity({'left': slideWidth*-1}, 0);
				break;

			case 'fade':
				slide.stop(true, false).fadeOut(bambooSlideSpeed);
				break;

			case 'slide_left':
				slide.stop(true, false).velocity({'left': slideWidth}, bambooSlideSpeed, bambooSlideEasing);
				break;

			case 'slide_right':
				slide.stop(true, false).velocity({'left': slideWidth*-1}, bambooSlideSpeed, bambooSlideEasing);
				break;
		}

	}

/**************************************************************************************************/

	function bambooSlidesPrevAnimationIn(index) {

		var slideWidth = jQuery('.bamboo-slides').eq(index).width()+1;
		var slide = jQuery('.bamboo-slides').eq(index).children('.bamboo-slide').eq(bambooCurrentSlide[index]-1);
		var slideHeight = slide.outerHeight();

		slide.parent().stop(true, false).velocity({'height': slideHeight}, 0);

		switch(bambooSlideMode[index])
		{
			case 'switch':
				slide.stop(true, false);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, 0, bambooSlideEasing, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;

			case 'fade':
				slide.stop(true, false).fadeOut(0);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, 0).fadeIn(bambooSlideSpeed, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;

			case 'slide_left':
				slide.stop(true, false).velocity({'left': slideWidth*-1}, 0);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, bambooSlideSpeed, bambooSlideEasing, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;

			case 'slide_right':
				slide.stop(true, false).velocity({'left': slideWidth}, 0);
				if(slide.hasClass('aligned-left')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':bambooSlideOffset});
				}
				if(slide.hasClass('aligned-right')) {
					slide.children().css({'opacity':0, 'position': 'relative', 'left':-1*bambooSlideOffset});
				}
				slide.velocity({'left': 0}, bambooSlideSpeed, bambooSlideEasing, function(){
					if(slide.hasClass('aligned-left')||slide.hasClass('aligned-right')) {
						slide.children().animate({'opacity':1, 'left':0}, bambooSlideTextSpeed, bambooSlideEasing);
					}
				});
				break;
		}

	}

/**************************************************************************************************/

	function bambooSlidesShowButtons(index) {

		jQuery('.bamboo-slides').eq(index).children('.bamboo-slides-prev-button').stop(true, false).velocity({'left':0, 'opacity':1}, bambooButtonFadeSpeed, bambooSlideEasing);
		jQuery('.bamboo-slides').eq(index).children('.bamboo-slides-next-button').stop(true, false).velocity({'right':0, 'opacity':1}, bambooButtonFadeSpeed, bambooSlideEasing);

	}

/**************************************************************************************************/

	function bambooSlidesHideButtons(index) {

		jQuery('.bamboo-slides').eq(index).children('.bamboo-slides-prev-button').stop(true, false).velocity({'left':-50, 'opacity':0}, bambooButtonFadeSpeed, bambooSlideEasing);
		jQuery('.bamboo-slides').eq(index).children('.bamboo-slides-next-button').stop(true, false).velocity({'right':-50, 'opacity':0}, bambooButtonFadeSpeed, bambooSlideEasing);

	}

/**************************************************************************************************/
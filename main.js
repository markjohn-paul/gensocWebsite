/*
	Name: BookCard
	Description: Responsive HTML5 vCard Template
	Version: 1.2
	Author: pixelwars
*/


(function ($) {

	var safeMod = false;
	var portfolioKeyword;
	var $container;
	var animEngine;
	
	/* DOCUMENT LOAD */
	$(function() {
		
		
		
		// ------------------------------
		// FLUID MEDIA
		if($('iframe,video').length) {
			$("html").fitVids();
		}
		// ------------------------------
		
		
		
		// ------------------------------
		// PORTFOLIO DETAILS
		// if url contains a portfolio detail url
		portfolioKeyword = $('.portfolio').attr('id');
		initialize();
		var detailUrl = giveDetailUrl();
		// ------------------------------
						
				
		// ------------------------------
		// SET COVER IMAGE AS BG IMAGE
		$('.cover').each(function(index, element) {
			$(this).css('background-image', 'url(' + $(this).find('.cover-image-holder img').attr('src') + ')');
		});
		// ------------------------------
		
			
		// ------------------------------
		// LAYOUT FALLBACK : SAFE MOD
		safeMod = $('html').attr('data-safeMod') === 'true';
		var isIE11 = !!navigator.userAgent.match(/Trident\/7\./); 
		var ua = navigator.userAgent.toLowerCase();
		var isAndroid = ua.indexOf("android") > -1;
		var isOperaMobile = isAndroid && navigator.userAgent.indexOf("Opera")> -1;
		safeMod = safeMod || !Modernizr.csstransforms || !Modernizr.csstransforms3d || $(window).width() < 960 || $.browser.msie || isIE11 || isAndroid || isOperaMobile;
		if(safeMod) {
			
			$('html').addClass('safe-mod');	
			
			setActivePage();
			$.address.change(function() {
				setActivePage();
				});
		}
		// ------------------------------
		
		
		// ------------------------------
		// open the book if url contains #/portfolio
		if (($.address.path().indexOf("/"+ portfolioKeyword)!=-1) && !safeMod) {
			setTimeout(function() { openMenu() },500);
		}
		// ------------------------------
		
		
		// ------------------------------
		// ADAPT LAYOUT
		adaptLayout();
		$(window).resize(function() {
			adaptLayout();
		});
		// ------------------------------
		
		
		// ------------------------------
		// FULL BROWSER BACK BUTTON SUPPORT 
		$.address.change(function() {
				console.log('Address changed to:', $.address.path()); // Debug log
				var detailUrl = giveDetailUrl();
				console.log('Detail URL:', detailUrl); // Debug log
				if(detailUrl != -1 ) {
					console.log('Calling showProjectDetails with:', detailUrl); // Debug log
					showProjectDetails(detailUrl);
				} else {
					console.log('No detail URL found'); // Debug log
					if ($.address.path().indexOf("/"+ portfolioKeyword)!=-1) {
						console.log('Hiding project details'); // Debug log
						hideProjectDetails(true,false);
					}
				}
			}); 
		// ------------------------------
		
		
		
		
		// ------------------------------
		// PORTFOLIO FILTERING - ISOTOPE
		
		// cache container
		$container = $('.portfolio-items');
		
		// detect chrome for css3 flashing fix
		$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase()); 
		if(!$.browser.chrome || safeMod) {
			$('html').addClass('no-chrome');
		}
		$.browser.safari = ($.browser.webkit && !(/chrome/.test(navigator.userAgent.toLowerCase())));

		animEngine = ($.browser.chrome || $.browser.safari) && !safeMod ? 'jquery' : 'best-available';
		
		if($container.length) {
			$container.imagesLoaded(function() {
				
				// initialize isotope
				$container.isotope({
				  itemSelector : '.hentry',
				  layoutMode : 'fitRows'
				  //animationEngine : animEngine
				});
				
				
				// filters
				if ($container.data('isotope')) {
					var filters = $('#filters');
					if(filters.length) {
						filters.find('a').on("click", function() {
							//alert('hoyt');
							var selector = $(this).attr('data-filter');
							  $container.isotope({ filter: selector });
							  $(this).parent().addClass('current').siblings().removeClass('current');
							  return false;
						});
					}
				}
				
				setMasonry();
				setTimeout(function() { $container.isotope(); }, 20);	
				$(window).resize(function() {
					setTimeout(function() { setMasonry(); }, 600);				
				});
				
				
				
				
			});
		}
		// ------------------------------
		
		
		
		
		// ------------------------------
		// SCROLLBARS
		if(!safeMod) {
			
			setupScrollBars();
	
			// REFRESH SCROLLBARS ON RESIZE
			$(window).resize(function() {
				refreshScrollBars();
				if($(window).width() < 960) {
					location.reload(true);	
				}
			});
		
		}
		// ------------------------------
	
		
		// ------------------------------
		// FIT TEXT
		fitText();
		// ------------------------------
		
		
		// ------------------------------
		// LIGHTBOX
		setupLigtbox();
		// ------------------------------
		
		// ------------------------------
		// SKILL BARS
		animateBars();
		// ------------------------------
		
		
		// ------------------------------
		// PORTFOLIO DETAILS
		
		// Show details
		$(document).on('click', 'a.ajax', function() {
			
			console.log('AJAX link clicked!'); // Debug log
			
			var url = $(this).attr('href');
			var baseUrl = $.address.baseURL();
			
			console.log('URL:', url, 'Base URL:', baseUrl); // Debug log
			
			// First ensure we're on the portfolio page
			if ($.address.path().indexOf("/"+ portfolioKeyword) === -1) {
				console.log('Not on portfolio page, navigating first'); // Debug log
				$.address.path(portfolioKeyword);
				// Wait for the page to load, then navigate to the item
				setTimeout(function() {
					$.address.path(portfolioKeyword + '/' + url);
				}, 500);
			} else {
				// Already on portfolio page, just navigate to the item
				if(url.indexOf(baseUrl) !== -1) { // full url
					var total = url.length;
					detailUrl = url.slice(baseUrl.length+1, total);	
					$.address.path('/' + detailUrl );
				} else { // relative url
					detailUrl = url;
					$.address.path(portfolioKeyword + '/' + detailUrl );
				}
			}
			
			console.log('Final path will be:', portfolioKeyword + '/' + url); // Debug log
		  
			return false;
			
		});
		// ------------------------------
		
		
		// ------------------------------
		// 3D LAYOUT
		Menu.init();
		// ------------------------------
		
		
	});
	// DOCUMENT READY
	
	
	
	
	// WINDOW ONLOAD
	window.onload = function() {
		
		// ie8 cover text invisible fix
		if(jQuery.browser.version.substring(0, 2) == "8." || jQuery.browser.version.substring(0, 2) == "7.")
		{
			setTimeout(function() { setActivePage(); },2000);	
		}
		
		setTimeout(function() { fitText(); },1000);	
	
	};
	// WINDOW ONLOAD	
	
	
	// ------------------------------
	// ------------------------------
		// FUNCTIONS
	// ------------------------------
	// ------------------------------
	
	
	// ------------------------------
	// INITIALIZE
	var inAnimation, outAnimation, safeModPageInAnimation, cover_h1_tune, cover_h2_tune, cover_h3_tune, cover_h3_span_tune;
	function initialize() {
		inAnimation = $('html').attr('data-inAnimation');
		outAnimation = $('html').attr('data-outAnimation');
		safeModPageInAnimation = $('html').attr('data-safeModPageInAnimation');
		cover_h1_tune = $('html').attr('data-cover-h1-tune');
		cover_h2_tune = $('html').attr('data-cover-h2-tune');
		cover_h3_tune = $('html').attr('data-cover-h3-tune');
		cover_h3_span_tune = $('html').attr('data-cover-h3-span-tune');
	}
	// ------------------------------
	
	
	
	// ------------------------------
	// ADAPT LAYOUT
	function adaptLayout() {
		var width = safeMod ? $('body').width() : $('.content').width();
		if(width < 420) {
			$('html').addClass('w420');	
		} else {
			$('html').removeClass('w420');		
		}
	}	
	// ------------------------------
	
	
	// ------------------------------
	// CHANGE PAGE
	function setActivePage() {
		
			$('.page').removeClass('active').hide();
			var path = $.address.path();
			path = path.slice(1, path.length);
			path = giveDetailUrl() != -1 ? portfolioKeyword : path;
			if(path == "") {  // if hash tag doesnt exists - go to first page
				var firstPage = $('#header ul li').first().find('a').attr('href');
				path = firstPage.slice(2,firstPage.length);
				$.address.path(path);
				}
			
			if(Modernizr.csstransforms && Modernizr.csstransforms3d) { // modern browser
				$('#'+ path).show().removeClass('animated ').addClass('animated ' + safeModPageInAnimation);
			} else { //old browser
				$('#'+ path).fadeIn();
				$('.page.active').hide();
			}	
			
			$('#'+ path).addClass('active');
			
			// detect if user is on cover page
			if($('.page.active').find('.cover').length) {
				$('html').removeClass('not-on-cover-page').addClass('on-cover-page');	
			} else {
				$('html').removeClass('on-cover-page').addClass('not-on-cover-page');	
			}
			
			setCurrentMenuItem();
			
			if(path.indexOf(portfolioKeyword) != -1) {
				setTimeout(function() { setMasonry(); }, 100);
			} 
			$("body").scrollTop(0);
			
			fitText();
		
	}	
	// ------------------------------
	
	
	// ------------------------------
	// change the number of masonry columns based on the current container's width
	function setMasonry() {
		
		if ($container.data('isotope')) {
		
			var containerW = $container.width();
			var items = $container.children('.hentry');
			var columns, columnWidth;
			var viewports = [ {
					width : 1200,
					columns : 5
				}, {
					width : 900,
					columns : 4
				}, {
					width : 600,
					columns : 3
				}, { 
					width : 320,
					columns : 2
				}, { 
					width : 0,
					columns : 1
				} ];
		
			for( var i = 0, len = viewports.length; i < len; ++i ) {
		
				var viewport = viewports[i];
		
				if( containerW > viewport.width ) {
		
					columns = viewport.columns;
					break;
		
				}
			}
		
			// set the widths (%) for each of item
			items.each(function(index, element) {
				var multiplier = $(this).hasClass('x2') && columns > 1 ? 2 : 1;
				var itemWidth = (Math.floor( containerW / columns ) * 100 / containerW) * multiplier ;
				$(this).css( 'width', itemWidth + '%' );
			});
		
			columnWidth = Math.floor( containerW / columns );
			$container.isotope().isotope( 'option', { masonry: { columnWidth: columnWidth } } );
		
		}
	
	}
	// ------------------------------
	
	
	// ------------------------------
	// PROGRESS BARS
	function animateBars() {
		$('.bar').each(function() {
			 var bar = $(this);
			 bar.find('.progress').css('width', bar.attr('data-percent') + '%' );
			});
	}	
	// ------------------------------	
	
	
	
	// ------------------------------
	// FIT TEXT
	function fitText() {
		$(".cover h1").fitText(cover_h1_tune);
		$(".cover h2").fitText(cover_h2_tune);
		$(".cover h3").fitText(cover_h3_tune);
		$(".cover h3 span").fitText(cover_h3_span_tune);	
	}
	// ------------------------------
	
	
	// ------------------------------
	// LIGHTBOX
	function setupLigtbox() {
		
		//html5 validate fix
		$('.lightbox').each(function(index, element) {
			$(this).attr('rel', $(this).attr('data-lightbox-gallery'));
		});
		
		if($("a[rel^='fancybox']").length) {
			$("a[rel^='fancybox']").fancybox({
				centerOnScroll : true,
				padding : 0,
				margin : $(window).width() < 640 ? 44 : 44,
				width : $(window).width() < 640 ? 320 : 640,
				height : $(window).width() < 640 ? 180 : 360,
				transitionOut : 'none',
				overlayColor : '#000',
				overlayOpacity : '.5',
				onStart : function() {
					$( '#rm-container' ).addClass( 'rm-in rm-nodelay' );
				},
				onClosed : function() {
					$( '#rm-container' ).removeClass( 'rm-in' );
				},
				onComplete : function() {
					if ($(this).attr('href').indexOf("soundcloud.com") >= 0) {
						$('#fancybox-content').height(166);
					}
				}
			});
		}	
	}
	// ------------------------------	
	
	
	
	
	// ------------------------------
	// SCROLLBARS
	var scroller = [];
	
	// SETUP SCROLLBARS
	function setupScrollBars() {
		if(!safeMod) { // don't run antiscroll if safe mode is on 
			
			$('.antiscroll-wrap').each(function(index, element) {
				scroller[index] = $(this).antiscroll( { x : false, autoHide: $('html').attr('data-autoHideScrollbar') != 'false' }).data('antiscroll');
			});
			
		}
	}
	
	// REFRESH SCROLLBARS
	function refreshScrollBars() {
		 setTimeout(function() { rebuildScrollBars(); setupScrollBars(); }, 500);
	}
	
	// REBULD SCROLLBARS
	function rebuildScrollBars() {
		 $.each( scroller, function(i, l){
			scroller[i].rebuild(); 
		 });
	}
	// ------------------------------
	
	
	// ------------------------------
	// SET CURRENT MENU ITEM
	function setCurrentMenuItem() {
		var activePageId = $('.page.active').attr('id');
		// set default nav menu
		$('#header nav ul a[href$=' + activePageId +']').parent().addClass('current_page_item').siblings().removeClass('current_page_item');
	}	
	// ------------------------------
	
	
	// ------------------------------
	// AJAX PORTFOLIO DETAILS
	var pActive;
	
	function showProjectDetails(url) {
		
		console.log('showProjectDetails called with URL:', url); // Debug log
		
		showLoader();
		
		var p = $('.p-overlay:not(.active)').first();
		pActive = $('.p-overlay.active');
		
		console.log('Found p-overlay elements:', $('.p-overlay').length); // Debug log
		console.log('Available overlay:', p.length); // Debug log
		console.log('Active overlay:', pActive.length); // Debug log
		
		$( '#rm-container' ).addClass( 'rm-in rm-nodelay' );
		
		if(pActive.length) {
			hideProjectDetails();	  
		}
		
		// Simplified approach - just use the filename directly
		console.log('Loading directly from filename:', url); // Debug log
		
		$.get(url, function(data) {
			console.log('Direct load successful, data length:', data.length); // Debug log
			
			// Extract the portfolio-single content
			var $data = $(data);
			var portfolioContent = $data.find('.portfolio-single');
			
			console.log('Found .portfolio-single elements:', portfolioContent.length); // Debug log
			
			if (portfolioContent.length > 0) {
				console.log('Inserting portfolio content'); // Debug log
				p.html(portfolioContent.html());
				
				// Add the portfolio-single class and container for proper styling
				p.addClass('portfolio-single container');
				
				// Continue with image loading and display
				p.imagesLoaded(function() {
					hideLoader();
					console.log('Images loaded, showing overlay'); // Debug log
					
					$('html').addClass('p-overlay-on');
					$(".portfolio-single").fitVids();
					
					if(Modernizr.csstransforms && Modernizr.csstransforms3d) {
						p.removeClass('animated '+ outAnimation + " " + inAnimation ).addClass('animated '+ inAnimation).show();
					} else {
						p.fadeIn();	
					}
					p.addClass('active');
					
					console.log('Overlay should now be visible with content'); // Debug log
				});
			} else {
				console.log('ERROR: No .portfolio-single found!'); // Debug log
				hideLoader();
				// Show error message in overlay
				p.html('<div style="padding: 2em; text-align: center;"><h2>Error loading content</h2><p>Could not find portfolio content in: ' + url + '</p></div>');
				p.show().addClass('active');
				$('html').addClass('p-overlay-on');
			}
			
		}).fail(function(xhr, status, error) {
			console.log('Direct load failed:', status, error); // Debug log
			console.log('XHR status:', xhr.status); // Debug log
			console.log('XHR statusText:', xhr.statusText); // Debug log
			hideLoader();
			
			// Show error message
			p.html('<div style="padding: 2em; text-align: center;"><h2>Error</h2><p>Failed to load: ' + url + '</p><p>Status: ' + status + ' (' + xhr.status + ')</p></div>');
			p.show().addClass('active');
			$('html').addClass('p-overlay-on');
		});
	}
	
	function hideProjectDetails(forever, safeClose) {
		
		$("body").scrollTop(0);
		
		// close completely by back link.
		if(forever) {
			pActive = $('.p-overlay.active');
			
			$('html').removeClass('p-overlay-on');
			$( '#rm-container' ).removeClass( 'rm-in' );
			
			if(!safeClose) {
				// remove detail url
				$.address.path(portfolioKeyword);
			}
		}
		
		pActive.removeClass('active');
		
		if(Modernizr.csstransforms && Modernizr.csstransforms3d) { // modern browser
			pActive.removeClass('animated '+ inAnimation).addClass('animated '+ outAnimation);
			setTimeout(function() { pActive.hide().removeClass(outAnimation).empty(); } ,1010)
		} else { //old browser
			pActive.fadeOut().empty();	
		}
	}
	
	function giveDetailUrl() {
	
		var address = $.address.value();
		console.log('Current address value:', address); // Debug log
		console.log('Portfolio keyword:', portfolioKeyword); // Debug log
		
		var detailUrl;
		
		if (address.indexOf("/"+ portfolioKeyword + "/")!=-1 && address.length > portfolioKeyword.length + 2 ) {
			var total = address.length;
			detailUrl = address.slice(portfolioKeyword.length+2,total);
			console.log('Extracted detail URL:', detailUrl); // Debug log
		} else {
			detailUrl = -1;
			console.log('No detail URL found in address'); // Debug log	
		}
		return detailUrl;
	}
	
	// ------------------------------
	
	
	
	// ------------------------------
	// AJAX LOADER
	function showLoader() {
		$(".loader").show();
	}
	function hideLoader() {
		$(".loader").hide();
	}
	// ------------------------------
	
	
	
	// ------------------------------
	// BOOK LAYOUT
	var Menu = (function() {
		
		var $container = $( '#rm-container' ),						
			$cover = $container.find( 'div.rm-cover' ),
			$middle = $container.find( 'div.rm-middle' ),
			$right = $container.find( 'div.rm-right' ),
			$open = $cover.find('a.rm-button-open'),
			$close = $right.find('.rm-close');
	
			init = function() {
	
				initEvents();
	
			},
			initEvents = function() {
	
				$open.on( 'click', function( event ) {
					if(!safeMod) {
		
						openMenu();
						return false;
					}
	
				} );
	
				$close.on( 'click', function( event ) {
					
					closeMenu();
					return false;
	
				} );
				
			},
			openMenu = function() {
	
				$container.removeClass('rm-closed');
				setTimeout(function() { $container.addClass( 'rm-open' ); },10);
	
			},
			closeMenu = function() {
	
				$container.removeClass( 'rm-open rm-nodelay rm-in' );
				setTimeout(function() { $container.addClass( 'rm-closed' ) },850);
	
			};
			
		return { init : init };
	
	})();
	// ------------------------------


})(jQuery);
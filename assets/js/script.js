/* ========================================================================= */
/*	Page Preloader
/* ========================================================================= */

$(window).on('load', function () {
	$('.preloader').fadeOut(100);
});

jQuery(function ($) {
	"use strict";

	/* ========================================================================= */
	/*	lazy load initialize
	/* ========================================================================= */

	const observer = lozad(); // lazy loads elements with default selector as ".lozad"
	observer.observe();

	/* ========================================================================= */
	/*	Magnific popup
	/* =========================================================================  */
	$('.image-popup').magnificPopup({
		type: 'image',
		removalDelay: 160, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function () {
				// just a hack that adds mfp-anim class to markup
				this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
				this.st.mainClass = this.st.el.attr('data-effect');
			}
		},
		closeOnContentClick: true,
		midClick: true,
		fixedContentPos: false,
		fixedBgPos: true
	});

	/* ========================================================================= */
	/*	Portfolio Filtering Hook
	/* =========================================================================  */

	var containerEl = document.querySelector('.shuffle-wrapper');
	if (containerEl) {
		var Shuffle = window.Shuffle;
		var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
			itemSelector: '.shuffle-item',
			buffer: 1
		});

		jQuery('input[name="shuffle-filter"]').on('change', function (evt) {
			var input = evt.currentTarget;
			if (input.checked) {
				myShuffle.filter(input.value);
			}
		});
	}

	/* ========================================================================= */
	/*	Testimonial Carousel
	/* =========================================================================  */

	$("#testimonials").slick({
		infinite: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 4000
	});

	/* ========================================================================= */
	/*	animation scroll js
	/* ========================================================================= */



	function myFunction(x) {
		if (x.matches) {
			var topOf = 50
		} else {
			var topOf = 350
		}
	}

	var html_body = $('html, body');
	$('nav a, .page-scroll').on('click', function () { //use page-scroll class in any HTML tag for scrolling
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				html_body.animate({
					scrollTop: target.offset().top - 50
				}, 1500, 'easeInOutExpo');
				return false;
			}
		}
	});

	// easeInOutExpo Declaration
	jQuery.extend(jQuery.easing, {
		easeInOutExpo: function (x, t, b, c, d) {
			if (t === 0) {
				return b;
			}
			if (t === d) {
				return b + c;
			}
			if ((t /= d / 2) < 1) {
				return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			}
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	});

	/* ========================================================================= */
	/*	counter up
	/* ========================================================================= */
	function counter() {
		var oTop;
		if ($('.count').length !== 0) {
			oTop = $('.count').offset().top - window.innerHeight;
		}
		if ($(window).scrollTop() > oTop) {
			$('.count').each(function () {
				var $this = $(this),
					countTo = $this.attr('data-count');
				$({
					countNum: $this.text()
				}).animate({
					countNum: countTo
				}, {
					duration: 1000,
					easing: 'swing',
					step: function () {
						$this.text(Math.floor(this.countNum));
					},
					complete: function () {
						$this.text(this.countNum);
					}
				});
			});
		}
	}
	$(window).on('scroll', function () {
		counter();
	});

	/* ========================================================================= */
	/*	EPIC BATTLE MODE TOGGLE - Pokemon Animation Control (WCAG 3.0)
	/* ========================================================================= */

	(function initBattleToggle() {
		// Check for stored preference
		const storedPreference = localStorage.getItem('battle-mode');

		// DEFAULT TO OFF - User must opt-in to see animations (WCAG 2.2.2 compliant)
		// This provides the safest, most accessible experience by default
		let battleModeEnabled = storedPreference === 'enabled' ? true : false;

		// Create the EPIC battle toggle button
		const battleToggle = $('<button>', {
			class: 'battle-toggle',
			'aria-label': battleModeEnabled ? 'Battle ON' : 'Battle OFF',
			'aria-pressed': battleModeEnabled,
			tabindex: 0,
			html: '<span class="status"></span>'
		});

		// Apply initial state
		if (!battleModeEnabled) {
			$('body').addClass('battle-mode-disabled');
		}
		updateButtonState();

		// Add button to page
		$('body').append(battleToggle);

		// Toggle function
		function toggleBattleMode() {
			battleModeEnabled = !battleModeEnabled;

			if (battleModeEnabled) {
				$('body').removeClass('battle-mode-disabled');
				localStorage.setItem('battle-mode', 'enabled');
			} else {
				$('body').addClass('battle-mode-disabled');
				localStorage.setItem('battle-mode', 'disabled');
			}

			battleToggle.attr('aria-pressed', battleModeEnabled);
			battleToggle.attr('aria-label', battleModeEnabled ? 'Battle ON' : 'Battle OFF');
			updateButtonState();

			// Add feedback animation
			battleToggle.css('transform', 'scale(1.2)');
			setTimeout(() => {
				battleToggle.css('transform', '');
			}, 200);
		}

		// Update button text and state
		function updateButtonState() {
			const statusText = battleModeEnabled ? 'Battle ON' : 'Battle OFF';
			battleToggle.find('.status').text(statusText);
		}

		// Event listeners
		battleToggle.on('click', toggleBattleMode);

		// Keyboard support (Space and Enter)
		battleToggle.on('keydown', function(e) {
			if (e.key === ' ' || e.key === 'Enter') {
				e.preventDefault();
				toggleBattleMode();
			}
		});

		// Listen for system preference changes
		window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
			// Only auto-disable if user hasn't explicitly set a preference
			if (localStorage.getItem('battle-mode') === null && e.matches) {
				if (battleModeEnabled) {
					toggleBattleMode();
				}
			}
		});

		// Console message for developers
		console.log('⚔️ EPIC BATTLE MODE: ' + (battleModeEnabled ? 'ENABLED' : 'DISABLED'));
		console.log('Click the button at bottom left to toggle Pokemon animations!');
	})();

});

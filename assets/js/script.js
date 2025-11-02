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

	// Removed Magnific Popup - plugin deleted
	// Removed Shuffle Portfolio Filtering - plugin deleted
	// Removed Slick Testimonial Carousel - plugin deleted

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
	/*	Battle toggle removed - simplified to decorative Pokemon only
	/* ========================================================================= */

	/* ========================================================================= */
	/*	Pricing CTA Handler - Smooth service tier pre-fill
	/* ========================================================================= */

	(function initPricingCTAs() {
		// Handle pricing CTA button clicks with visual feedback
		$(document).on('click', '.pricing-cta-btn', function(e) {
			e.preventDefault();
			var $btn = $(this);
			var serviceTier = $btn.attr('data-service');
			var targetHref = $btn.attr('href');

			if (serviceTier) {
				// Visual feedback - button pulse
				$btn.addClass('cta-clicked');
				setTimeout(function() {
					$btn.removeClass('cta-clicked');
				}, 600);

				// Store service tier in sessionStorage
				sessionStorage.setItem('selectedService', serviceTier);
				console.log('💼 Service tier selected: ' + serviceTier);
			}

			// Navigate to contact section (handles both same-page and cross-page)
			if (targetHref) {
				if (targetHref.includes('#contact')) {
					var $contactSection = $('#contact');
					if ($contactSection.length) {
						// Same page - smooth scroll
						$('html, body').animate({
							scrollTop: $contactSection.offset().top - 50
						}, 800, 'easeInOutExpo');
					} else {
						// Different page - navigate to homepage contact section
						window.location.href = targetHref;
					}
				} else {
					// No hash - just navigate
					window.location.href = targetHref;
				}
			}
		});

		// Pre-fill contact form subject on page load with animation
		$(window).on('load', function() {
			// Check URL parameter first (new architecture) - takes precedence
			var urlParams = new URLSearchParams(window.location.search);
			var urlService = urlParams.get('service');

			// If URL has service parameter, clear sessionStorage and let footer.html handle it
			if (urlService) {
				sessionStorage.removeItem('selectedService');
				console.log('🔗 URL service parameter detected, deferring to footer.html handler');
				return; // Exit early, footer.html will handle the pre-fill
			}

			// Otherwise, fall back to sessionStorage (legacy support)
			var selectedService = sessionStorage.getItem('selectedService');
			if (selectedService) {
				var $subjectField = $('#subject');
				var $serviceField = $('#service-tier');

				if ($subjectField.length) {
					// Small delay for smooth appearance
					setTimeout(function() {
						// Pre-fill subject with [Service Tier] prefix (editable)
						var prefixedValue = '[' + selectedService + '] ';
						$subjectField.val(prefixedValue);

						// Pre-fill hidden service field (locked, not editable)
						if ($serviceField.length) {
							$serviceField.val(selectedService);
							console.log('🔒 Hidden service field locked: ' + selectedService);
						}

						// Add animation class for cyan glow effect
						$subjectField.addClass('field-prefilled');

						// Focus field and position cursor at end
						$subjectField.focus();
						var fieldLength = prefixedValue.length;
						$subjectField[0].setSelectionRange(fieldLength, fieldLength);

						console.log('📋 Contact form pre-filled with: ' + prefixedValue);

						// Remove animation class after animation completes
						setTimeout(function() {
							$subjectField.removeClass('field-prefilled');
						}, 1500);

						// Clear sessionStorage after use
						sessionStorage.removeItem('selectedService');
					}, 300);
				}
			}
		});

		console.log('💼 Pricing CTA handler initialized');
	})();

});

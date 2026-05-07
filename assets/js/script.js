/* ========================================================================= */
/*	Page Preloader (Vanilla JS)
/* ========================================================================= */

window.addEventListener('load', function () {
	const preloader = document.querySelector('.preloader');
	if (preloader) {
		preloader.style.transition = 'opacity 0.1s';
		preloader.style.opacity = '0';
		setTimeout(() => preloader.remove(), 100);
	}
});

document.addEventListener('DOMContentLoaded', function () {
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
	/*	animation scroll js (Vanilla JS with CSS easing)
	/* ========================================================================= */

	function smoothScroll(target, duration = 1500) {
		const start = window.pageYOffset;
		const end = target.getBoundingClientRect().top + start - 50;
		const distance = end - start;
		const startTime = performance.now();

		function easeInOutExpo(t) {
			if (t === 0) return 0;
			if (t === 1) return 1;
			if ((t *= 2) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
			return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
		}

		function scroll() {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easeProgress = easeInOutExpo(progress);
			window.scrollTo(0, start + distance * easeProgress);

			if (progress < 1) {
				requestAnimationFrame(scroll);
			}
		}

		requestAnimationFrame(scroll);
	}

	document.querySelectorAll('nav a, .page-scroll').forEach(link => {
		link.addEventListener('click', function (e) {
			if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
				const targetId = this.hash.slice(1);
				const target = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
				if (target) {
					e.preventDefault();
					smoothScroll(target);
					return false;
				}
			}
		});
	});

	/* ========================================================================= */
	/*	counter up (Vanilla JS with Intersection Observer)
	/* ========================================================================= */
	function animateCounter(element) {
		const countTo = parseInt(element.getAttribute('data-count'));
		const duration = 1000;
		const startTime = performance.now();
		const startValue = 0;

		function update() {
			const elapsed = performance.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const currentValue = Math.floor(startValue + (countTo - startValue) * progress);
			element.textContent = currentValue;

			if (progress < 1) {
				requestAnimationFrame(update);
			} else {
				element.textContent = countTo;
			}
		}

		requestAnimationFrame(update);
	}

	const counterElements = document.querySelectorAll('.count');
	if (counterElements.length > 0) {
		const counterObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !entry.target.dataset.counted) {
					entry.target.dataset.counted = 'true';
					animateCounter(entry.target);
				}
			});
		}, { threshold: 0.5 });

		counterElements.forEach(el => counterObserver.observe(el));
	}

	/* ========================================================================= */
	/*	Pricing CTA Handler - Vanilla JS version
	/* ========================================================================= */

	(function initPricingCTAs() {
		// Handle pricing CTA button clicks with visual feedback
		document.addEventListener('click', function(e) {
			const btn = e.target.closest('.pricing-cta-btn');
			if (!btn) return;

			e.preventDefault();
			const serviceTier = btn.getAttribute('data-service');
			const targetHref = btn.getAttribute('href');

			if (serviceTier) {
				// Visual feedback - button pulse
				btn.classList.add('cta-clicked');
				setTimeout(() => btn.classList.remove('cta-clicked'), 600);

				// Store service tier in sessionStorage
				sessionStorage.setItem('selectedService', serviceTier);
				console.log('💼 Service tier selected: ' + serviceTier);
			}

			// Navigate to contact section (handles both same-page and cross-page)
			if (targetHref) {
				if (targetHref.includes('#contact')) {
					const contactSection = document.getElementById('contact');
					if (contactSection) {
						// Same page - smooth scroll
						smoothScroll(contactSection, 800);
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

		// Service-tier pre-fill on page load. The legacy sessionStorage path
		// hydrated a #subject input that no longer exists after the H6 brief-
		// intake redesign (contact.html only has the hidden #service-tier
		// input now). URL ?service=… is handled by the footer inline script;
		// this block is a thin sessionStorage→hidden-input bridge for any in-
		// page CTA that still routes through sessionStorage.
		window.addEventListener('load', function() {
			const urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('service')) {
				sessionStorage.removeItem('selectedService');
				return;
			}

			const selectedService = sessionStorage.getItem('selectedService');
			const serviceField = document.getElementById('service-tier');
			if (selectedService && serviceField) {
				serviceField.value = selectedService;
				sessionStorage.removeItem('selectedService');
			}
		});

		console.log('💼 Pricing CTA handler initialized');
	})();

});

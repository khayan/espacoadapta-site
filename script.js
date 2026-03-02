/**
 * Espaço Adapta — Interactive Features
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        mobileMenu();
        smoothScroll();
        headerBehavior();
        scrollReveal();
        a11y();
    }

    /* ========================
       Mobile Menu
       ======================== */
    function mobileMenu() {
        var btn = document.getElementById('menu-btn');
        var closeBtn = document.getElementById('mobile-menu-close');
        var menu = document.getElementById('mobile-menu');
        if (!btn || !menu || !closeBtn) return;

        var focusableEls;
        var firstFocusable;
        var lastFocusable;

        function open() {
            menu.classList.add('is-open');
            menu.setAttribute('aria-hidden', 'false');
            btn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';

            // Focus trap setup
            focusableEls = menu.querySelectorAll('a, button');
            firstFocusable = focusableEls[0];
            lastFocusable = focusableEls[focusableEls.length - 1];
            closeBtn.focus();
        }

        function close() {
            menu.classList.remove('is-open');
            menu.setAttribute('aria-hidden', 'true');
            btn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            btn.focus();
        }

        btn.addEventListener('click', open);
        closeBtn.addEventListener('click', close);

        // Close on nav link click
        menu.querySelectorAll('nav a').forEach(function (link) {
            link.addEventListener('click', close);
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                close();
            }
            // Focus trap
            if (e.key === 'Tab' && menu.classList.contains('is-open')) {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            }
        });

        // Close on resize to desktop
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 768 && menu.classList.contains('is-open')) {
                close();
            }
        });
    }

    /* ========================
       Smooth Scrolling
       ======================== */
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                var header = document.getElementById('site-header');
                var offset = header ? header.offsetHeight + 16 : 80;

                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* ========================
       Header — shadow & hide
       ======================== */
    function headerBehavior() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var lastY = 0;
        var ticking = false;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    var y = window.pageYOffset;

                    // Shadow when scrolled
                    header.classList.toggle('is-scrolled', y > 10);

                    // Hide on scroll down, show on scroll up
                    if (y > lastY && y > 120) {
                        header.classList.add('is-hidden');
                    } else {
                        header.classList.remove('is-hidden');
                    }

                    lastY = y <= 0 ? 0 : y;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /* ========================
       Scroll Reveal
       ======================== */
    function scrollReveal() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: show everything
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -32px 0px'
        });

        // Select targets and add reveal class
        var selectors = [
            '.about-card',
            '.diff-item',
            '.service-item',
            '.section-intro',
            '.hero-text',
            '.hero-visual',
            '.manifesto-body',
            '.manifesto-closing',
            '.audience h2',
            '.audience-intro',
            '.tags',
            '.audience-method',
            '.cta-band h2',
            '.cta-band > .wrap > p',
            '.cta-band .btn'
        ];

        document.querySelectorAll(selectors.join(',')).forEach(function (el) {
            el.classList.add('reveal');

            // Add stagger for grid items
            if (el.matches('.about-card, .diff-item, .service-item')) {
                var siblings = Array.from(el.parentElement.children);
                var idx = siblings.indexOf(el);
                el.style.transitionDelay = (idx * 0.07) + 's';
            }

            observer.observe(el);
        });
    }

    /* ========================
       Accessibility
       ======================== */
    function a11y() {
        // Detect keyboard navigation
        var isKeyboard = false;

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                isKeyboard = true;
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', function () {
            if (isKeyboard) {
                isKeyboard = false;
                document.body.classList.remove('keyboard-nav');
            }
        });
    }
})();

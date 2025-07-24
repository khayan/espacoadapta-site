/**
 * Espaço Adapta - Interactive Features
 * Modern, accessible, and mobile-friendly JavaScript
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        initializeMobileNavigation();
        initializeSmoothScrolling();
        initializeScrollAnimations();
        initializeAccessibility();
    }

    /**
     * Mobile Navigation Toggle
     */
    function initializeMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('#nav-menu');
        const header = document.querySelector('.header');

        if (!navToggle || !navMenu) {
            console.warn('Navigation elements not found');
            return;
        }

        // Create mobile menu overlay
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = navMenu.classList.contains('nav-open');
            
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking on overlay
        overlay.addEventListener('click', closeMobileMenu);

        // Close menu when clicking on nav links
        navMenu.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('nav-open')) {
                closeMobileMenu();
            }
        });

        function openMobileMenu() {
            navMenu.classList.add('nav-open');
            navToggle.classList.add('nav-toggle-open');
            overlay.classList.add('nav-overlay-active');
            document.body.style.overflow = 'hidden';
            navToggle.setAttribute('aria-expanded', 'true');
        }

        function closeMobileMenu() {
            navMenu.classList.remove('nav-open');
            navToggle.classList.remove('nav-toggle-open');
            overlay.classList.remove('nav-overlay-active');
            document.body.style.overflow = '';
            navToggle.setAttribute('aria-expanded', 'false');
        }

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768 && navMenu.classList.contains('nav-open')) {
                closeMobileMenu();
            }
        });
    }

    /**
     * Smooth Scrolling for Navigation Links
     */
    function initializeSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (!targetElement) return;
                
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    /**
     * Scroll Animations
     */
    function initializeScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            return; // Graceful degradation for older browsers
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    // Stop observing once animated
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.card, .feature-list li, .section-header, .hero-content'
        );
        
        animateElements.forEach(element => {
            element.classList.add('animate-target');
            observer.observe(element);
        });

        // Add staggered animation for cards
        const cardGrids = document.querySelectorAll('.card-grid');
        cardGrids.forEach(grid => {
            const cards = grid.querySelectorAll('.card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        });

        // Add staggered animation for feature lists
        const featureLists = document.querySelectorAll('.feature-list');
        featureLists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.05}s`;
            });
        });
    }

    /**
     * Accessibility Enhancements
     */
    function initializeAccessibility() {
        // Enhanced focus management
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        // Skip link functionality
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main landmark if not present
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
        }

        // Improve button accessibility
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                console.warn('Button without accessible text found:', button);
            }
        });
    }

    /**
     * Performance Optimizations
     */
    
    // Lazy load images (if any are added in the future)
    function initializeLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        } else {
            // Fallback for browsers that don't support loading="lazy"
            const script = document.createElement('script');
            script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
            document.head.appendChild(script);
        }
    }

    // Throttle scroll events for performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Header scroll behavior
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    if (header) {
        const handleScroll = throttle(function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, 100);

        window.addEventListener('scroll', handleScroll);
    }

})();
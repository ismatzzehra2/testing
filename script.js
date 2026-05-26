(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    /* --- Navbar scroll effect --- */
    function handleNavScroll() {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* --- Hamburger toggle --- */
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            navLinks.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });

        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('open');
            });
        });
    }

    /* --- Hours status --- */
    (function () {
        const statusEl = document.getElementById('status');
        if (!statusEl) return;

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();
        const min = now.getMinutes();

        function isOpen(d, h, m) {
            if (d === 6 || d === 0) return false;
            var total = h * 60 + m;
            var open = 10 * 60;
            var close = 22 * 60;
            return total >= open && total < close;
        }

        var open = isOpen(day, hour, min);

        if (open) {
            statusEl.textContent = 'Open now \u2014 10:00 AM to 10:00 PM';
            statusEl.style.color = '#4caf50';
        } else {
            statusEl.textContent = 'Closed now \u2014 opens Mon\u2013Fri, 10:00 AM';
            statusEl.style.color = '#e57373';
        }
    })();

    /* --- Scroll reveal animation --- */
    (function () {
        var revealElements = document.querySelectorAll(
            '.dish-card, .review-card, .gallery-item, .about-image, .about-content, ' +
            '.reservation-form, .reservation-info, .contact-item, .stat, .info-card'
        );

        revealElements.forEach(function (el) {
            el.classList.add('reveal');
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    })();

    /* --- Animated counter --- */
    (function () {
        var statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-target'), 10);
                    if (isNaN(target)) return;

                    var duration = 2000;
                    var startTime = null;

                    function animate(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);
                        var current = Math.floor(eased * target);

                        if (target >= 1000) {
                            el.textContent = current.toLocaleString() + '+';
                        } else {
                            el.textContent = current + '+';
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            if (target >= 1000) {
                                el.textContent = target.toLocaleString() + '+';
                            } else {
                                el.textContent = target + '+';
                            }
                        }
                    }

                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function (el) {
            counterObserver.observe(el);
        });
    })();

    /* --- Reservation form --- */
    (function () {
        var form = document.getElementById('reservation-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('res-name').value.trim();
            var email = document.getElementById('res-email').value.trim();
            var date = document.getElementById('res-date').value;
            var time = document.getElementById('res-time').value;
            var guests = document.getElementById('res-guests').value;

            if (!name || !email || !date || !time || !guests) {
                alert('Please fill in all required fields.');
                return;
            }

            var btn = form.querySelector('.btn-submit');
            var originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(function () {
                alert('Thank you, ' + name + '! Your reservation for ' + guests + ' guest(s) on ' + date + ' at ' + time + ' has been received. We will confirm shortly.');
                form.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1200);
        });
    })();

    /* --- Smooth anchor scroll offset --- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });
})();

(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const cartToast = document.getElementById('cartToast');
    const gallerySlider = document.getElementById('gallerySlider');

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

    /* --- Cart toast --- */
    function showCartToast() {
        if (!cartToast) return;
        cartToast.classList.add('show');
        setTimeout(function () {
            cartToast.classList.remove('show');
        }, 2000);
    }

    /* --- Add to cart buttons --- */
    document.querySelectorAll('.btn-order, .btn-add-cart').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            showCartToast();
        });
    });

    document.getElementById('orderNowBtn').addEventListener('click', function () {
        document.getElementById('best-sellers').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* --- Scroll reveal animation --- */
    (function () {
        var revealElements = document.querySelectorAll(
            '.dish-card, .deal-card, .review-card, .family-card, .gallery-slide, ' +
            '.counter-item, .ordering-content, .ordering-image, .reservation-form, ' +
            '.reservation-info, .delivery-item, .live-order-content, .about-image, ' +
            '.about-content, .contact-item, .info-card, .stat'
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
        var counters = document.querySelectorAll('.counter-number');
        if (!counters.length) return;

        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseFloat(el.getAttribute('data-target'));
                    var isDecimal = el.getAttribute('data-decimal') === 'true';
                    if (isNaN(target)) return;

                    var duration = 2000;
                    var startTime = null;

                    function animate(timestamp) {
                        if (!startTime) startTime = timestamp;
                        var progress = Math.min((timestamp - startTime) / duration, 1);
                        var eased = 1 - Math.pow(1 - progress, 3);

                        var current;
                        if (isDecimal) {
                            current = (eased * target).toFixed(1);
                        } else if (target >= 1000) {
                            current = Math.floor(eased * target).toLocaleString();
                        } else {
                            current = Math.floor(eased * target);
                        }

                        el.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            if (isDecimal) {
                                el.textContent = target.toFixed(1);
                            } else if (target >= 1000) {
                                el.textContent = target.toLocaleString();
                            } else {
                                el.textContent = target;
                            }
                        }
                    }

                    requestAnimationFrame(animate);
                    counterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) {
            counterObserver.observe(el);
        });
    })();

    /* --- Gallery Slider --- */
    (function () {
        if (!gallerySlider) return;

        var prevBtn = document.getElementById('galleryPrev');
        var nextBtn = document.getElementById('galleryNext');

        function scrollGallery(direction) {
            var slideWidth = gallerySlider.querySelector('.gallery-slide');
            if (!slideWidth) return;
            var scrollAmount = slideWidth.offsetWidth + 16;
            gallerySlider.scrollBy({
                left: direction * scrollAmount,
                behavior: 'smooth'
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', function () { scrollGallery(-1); });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', function () { scrollGallery(1); });
        }
    })();

    /* --- Reservation form --- */
    (function () {
        var form = document.getElementById('reservation-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('res-name').value.trim();
            var email = document.getElementById('res-email').value.trim();
            var phone = document.getElementById('res-phone').value.trim();
            var date = document.getElementById('res-date').value;
            var time = document.getElementById('res-time').value;
            var guests = document.getElementById('res-guests').value;

            if (!name || !email || !phone || !date || !time || !guests) {
                alert('Please fill in all required fields.');
                return;
            }

            var btn = form.querySelector('.btn-submit');
            var originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            setTimeout(function () {
                var msg = 'Thank you, ' + name + '! Your reservation for ' + guests +
                    ' guest(s) on ' + date + ' at ' + time + ' has been received. ' +
                    'We will confirm shortly via ' + phone + ' or ' + email + '.';

                var whatsappUrl = 'https://wa.me/923436847475?text=' +
                    encodeURIComponent('Hi! I would like to confirm my reservation for ' +
                        name + ', ' + guests + ' guests on ' + date + ' at ' + time + '.');

                if (confirm(msg + '\n\nWould you like to confirm via WhatsApp?')) {
                    window.open(whatsappUrl, '_blank');
                }

                form.reset();
                btn.innerHTML = originalText;
                btn.disabled = false;
            }, 1200);
        });
    })();

    /* --- Live Order Button --- */
    var liveOrderBtn = document.getElementById('liveOrderBtn');
    if (liveOrderBtn) {
        liveOrderBtn.addEventListener('click', function () {
            var overlay = document.createElement('div');
            overlay.style.cssText =
                'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:2000;' +
                'display:flex;align-items:center;justify-content:center;' +
                'backdrop-filter:blur(10px);animation:fadeIn 0.3s ease';

            var modal = document.createElement('div');
            modal.style.cssText =
                'background:#151515;border-radius:20px;padding:48px;max-width:480px;' +
                'width:90%;text-align:center;border:1px solid rgba(255,255,255,0.08);' +
                'animation:modalIn 0.4s ease';

            modal.innerHTML =
                '<div style="font-size:3rem;margin-bottom:16px;">🚚</div>' +
                '<h3 style="font-family:Playfair Display,serif;font-size:1.8rem;' +
                'color:#f5f0e8;margin-bottom:12px;">Live Order Tracking</h3>' +
                '<p style="color:#888;margin-bottom:24px;line-height:1.7;">' +
                'Your order is being prepared with love. Track it in real-time!</p>' +
                '<div style="margin-bottom:28px;">' +
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;text-align:left;">' +
                '<div style="width:32px;height:32px;border-radius:50%;background:#4caf50;' +
                'display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.8rem;">✓</div>' +
                '<div><strong style="color:#f5f0e8;font-size:0.9rem;">Order Confirmed</strong>' +
                '<p style="color:#666;font-size:0.75rem;">Your order has been received</p></div></div>' +
                '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;text-align:left;">' +
                '<div style="width:32px;height:32px;border-radius:50%;background:var(--orange,#f4a261);' +
                'display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.8rem;">~</div>' +
                '<div><strong style="color:#f5f0e8;font-size:0.9rem;">Being Prepared</strong>' +
                '<p style="color:#666;font-size:0.75rem;">Our chefs are cooking</p></div></div>' +
                '<div style="display:flex;align-items:center;gap:12px;text-align:left;">' +
                '<div style="width:32px;height:32px;border-radius:50%;background:#666;' +
                'display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.8rem;">🚚</div>' +
                '<div><strong style="color:#888;font-size:0.9rem;">Out for Delivery</strong>' +
                '<p style="color:#666;font-size:0.75rem;">Rider is on the way</p></div></div></div>' +
                '<button class="btn btn-primary" style="padding:14px 40px;font-size:0.85rem;" ' +
                'id="closeLiveModal">Got it!</button>';

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            document.getElementById('closeLiveModal').addEventListener('click', function () {
                document.body.removeChild(overlay);
            });

            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });
        });
    }

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

    /* --- Hero particle effect --- */
    (function () {
        var container = document.getElementById('particles');
        if (!container) return;

        var chars = ['✦', '●', '◆', '•', '·', '✧'];
        for (var i = 0; i < 20; i++) {
            var dot = document.createElement('span');
            var char = chars[Math.floor(Math.random() * chars.length)];
            var x = Math.random() * 100;
            var y = Math.random() * 100;
            var size = 4 + Math.random() * 10;
            var duration = 8 + Math.random() * 12;
            var delay = Math.random() * 10;

            dot.textContent = char;
            dot.style.cssText =
                'position:absolute;left:' + x + '%;top:' + y + '%;' +
                'font-size:' + size + 'px;color:rgba(201,169,78,0.15);' +
                'animation:particleFloat ' + duration + 's ease-in-out ' + delay + 's infinite;' +
                'pointer-events:none;';

            container.appendChild(dot);
        }
    })();

    /* --- Inject keyframe for particles --- */
    var style = document.createElement('style');
    style.textContent =
        '@keyframes particleFloat {' +
        '0%,100%{transform:translateY(0) rotate(0deg);opacity:0.3;}' +
        '25%{transform:translateY(-30px) rotate(90deg);opacity:0.6;}' +
        '50%{transform:translateY(-10px) rotate(180deg);opacity:0.3;}' +
        '75%{transform:translateY(-40px) rotate(270deg);opacity:0.7;}' +
        '}' +
        '@keyframes fadeIn{from{opacity:0}to{opacity:1}}' +
        '@keyframes modalIn{from{opacity:0;transform:scale(0.9)translateY(20px)}to{opacity:1;transform:scale(1)translateY(0)}}';
    document.head.appendChild(style);

    /* --- Set min date for reservation --- */
    var dateInput = document.getElementById('res-date');
    if (dateInput) {
        var today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
})();

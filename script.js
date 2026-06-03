(function () {
    'use strict';

    /* ─── DOM refs ─── */
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('navLinks');
    var langToggle = document.getElementById('langToggle');
    var backToTop = document.getElementById('backToTop');
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toastMessage');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImage');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var musicToggle = document.getElementById('musicToggle');

    var currentLang = 'en';
    var lightboxImages = [];
    var lightboxIndex = 0;

    /* --- Soft opening music --- */
    (function () {
        var backgroundMusic = document.getElementById('backgroundMusic');
        if (!musicToggle || !backgroundMusic) return;

        var isPlaying = false;
        backgroundMusic.volume = 0.28;

        function updateButton() {
            musicToggle.classList.toggle('is-playing', isPlaying);
            musicToggle.setAttribute('aria-pressed', String(isPlaying));
            musicToggle.innerHTML = isPlaying ? '<i class="fas fa-volume-high"></i>' : '<i class="fas fa-volume-xmark"></i>';
        }

        function startMusic() {
            backgroundMusic.play().then(function () {
                isPlaying = true;
                updateButton();
            }).catch(function () {
                isPlaying = false;
                updateButton();
            });
        }

        function stopMusic() {
            backgroundMusic.pause();
            isPlaying = false;
            updateButton();
        }

        musicToggle.addEventListener('click', function () {
            if (isPlaying) stopMusic();
            else startMusic();
        });

        window.addEventListener('load', startMusic);
        document.addEventListener('pointerdown', function () {
            if (!isPlaying) startMusic();
        }, { once: true });

        updateButton();
    })();

    /* ─── Hero title letter-by-letter split ─── */
    (function () {
        var title = document.getElementById('heroTitle');
        if (!title) return;
        var idx = 0;
        function splitText(text) {
            var frag = document.createDocumentFragment();
            for (var i = 0; i < text.length; i++) {
                var ch = text[i];
                var span = document.createElement('span');
                span.className = 'char' + (ch === ' ' ? ' space' : '');
                span.textContent = ch === ' ' ? '\u00A0' : ch;
                span.style.animationDelay = (0.6 + idx * 0.05) + 's';
                frag.appendChild(span);
                idx++;
            }
            return frag;
        }
        var children = Array.from(title.childNodes);
        title.textContent = '';
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node.nodeType === 3) {
                title.appendChild(splitText(node.textContent));
            } else if (node.nodeName === 'BR') {
                title.appendChild(document.createElement('br'));
            } else if (node.nodeType === 1) {
                var clone = node.cloneNode(false);
                clone.textContent = '';
                var startIdx = idx;
                clone.appendChild(splitText(node.textContent));
                title.appendChild(clone);
            }
        }
    })();

    /* ─── Navbar scroll ─── */
    function handleScroll() {
        var y = window.scrollY;
        if (y > 60) { navbar.classList.add('scrolled'); }
        else { navbar.classList.remove('scrolled'); }
        if (y > 500) { backToTop.classList.add('visible'); }
        else { backToTop.classList.remove('visible'); }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ─── Active nav link ─── */
    function handleActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var links = document.querySelectorAll('.nav-link');
        var current = '';
        sections.forEach(function (s) {
            if (window.scrollY >= s.offsetTop - 160) { current = s.getAttribute('id'); }
        });
        links.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', handleActiveNav, { passive: true });

    /* ─── Hamburger ─── */
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            var open = navLinks.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', open);
        });
        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); });
        });
    }

    /* ─── Language Toggle (menu only) ─── */
    if (langToggle) {
        langToggle.addEventListener('click', function () {
            currentLang = currentLang === 'en' ? 'ur' : 'en';
            var menuSection = document.querySelector('.menu-section');
            if (menuSection) {
                menuSection.classList.toggle('lang-ur', currentLang === 'ur');
            }
            langToggle.textContent = currentLang === 'en' ? 'EN | اردو' : 'اردو | EN';
        });
    }

    /* ─── Tab System ─── */
    function initTabs(containerId, tabClass, contentClass, dataAttr) {
        var container = document.getElementById(containerId);
        if (!container) return;
        var tabs = container.querySelectorAll('.' + tabClass);
        var contents = container.parentElement.querySelectorAll('.' + contentClass);

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var cat = this.getAttribute(dataAttr);
                tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
                this.classList.add('active'); this.setAttribute('aria-selected', 'true');
                contents.forEach(function (c) { c.classList.remove('active'); });
                var target = document.getElementById(contentClass.replace('category','') + cat);
                if (target) { target.classList.add('active'); }
                /* update tab indicator for menu tabs */
                if (containerId === 'menuTabs') {
                    updateTabIndicator(this);
                }
            });
        });
    }

    /* ─── Tab indicator ─── */
    function updateTabIndicator(activeTab) {
        var indicator = document.getElementById('tabIndicator');
        if (!indicator || !activeTab) return;
        indicator.style.left = activeTab.offsetLeft + 'px';
        indicator.style.width = activeTab.offsetWidth + 'px';
    }
    initTabs('menuTabs', 'menu-tab', 'menu-category', 'data-category');
    initTabs('galleryTabs', 'gallery-tab', 'gallery-category', 'data-category');
    /* init tab indicator on load */
    (function () {
        var activeTab = document.querySelector('.menu-tab.active');
        if (activeTab) updateTabIndicator(activeTab);
    })();

    /* ─── Menu Search ─── */
    var menuSearch = document.getElementById('menuSearch');
    if (menuSearch) {
        menuSearch.addEventListener('input', function () {
            var q = this.value.toLowerCase().trim();
            var items = document.querySelectorAll('.menu-category.active .menu-item');
            var cats = document.querySelectorAll('.menu-category');
            if (q === '') {
                items.forEach(function (i) { i.style.display = ''; });
                return;
            }
            cats.forEach(function (cat) {
                var matches = 0;
                cat.querySelectorAll('.menu-item').forEach(function (item) {
                    var text = item.textContent.toLowerCase();
                    var match = text.indexOf(q) !== -1;
                    item.style.display = match ? '' : 'none';
                    if (match) matches++;
                });
                cat.style.display = matches > 0 ? 'block' : 'none';
            });
        });
    }

    /* ─── Gallery Lightbox ─── */
    function openLightbox(images, index) {
        if (!lightbox || !lightboxImg) return;
        lightboxImages = images;
        lightboxIndex = index;
        lightboxImg.src = images[index].src;
        lightboxImg.alt = images[index].alt || 'Gallery image';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxImg.alt = lightboxImages[lightboxIndex].alt || 'Gallery image';
    }

    document.querySelectorAll('.gallery-item').forEach(function (item, idx) {
        item.addEventListener('click', function () {
            var container = this.closest('.gallery-category.active') || this.closest('.gallery-category');
            if (!container) return;
            var imgs = container.querySelectorAll('.gallery-item img');
            var arr = Array.from(imgs);
            openLightbox(arr, arr.indexOf(this.querySelector('img')));
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
    if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });
    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });

    /* ─── Reservation Form ─── */
    var resForm = document.getElementById('reservationForm');
    if (resForm) {
        resForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('resName').value.trim();
            var phone = document.getElementById('resPhone').value.trim();
            var guests = document.getElementById('resGuests').value;
            var date = document.getElementById('resDate').value;
            var time = document.getElementById('resTime').value;

            if (!name || !phone || !guests || !date || !time) {
                showToast('Please fill in all required fields.');
                return;
            }

            var btn = resForm.querySelector('.form-submit');
            var orig = btn.innerHTML;
            btn.innerHTML = 'Processing...';
            btn.disabled = true;

            setTimeout(function () {
                var msg = 'Hello! I would like to confirm my reservation for ' + name +
                    ', ' + guests + ' guest(s) on ' + date + ' at ' + time + '.';
                var waUrl = 'https://wa.me/923499740602?text=' + encodeURIComponent(msg);
                if (confirm('Reservation received for ' + name + '.\n\nConfirm via WhatsApp?')) {
                    window.open(waUrl, '_blank');
                }
                showToast('Reservation confirmed. We look forward to serving you.');
                resForm.reset();
                btn.innerHTML = orig;
                btn.disabled = false;
            }, 1000);
        });
    }

    /* ─── Contact Form ─── */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('contactName').value.trim();
            var subject = document.getElementById('contactSubject').value.trim();
            var message = document.getElementById('contactMessage').value.trim();
            if (!name || !subject || !message) { showToast('Please fill in all fields.'); return; }
            var waUrl = 'https://wa.me/923499740602?text=' + encodeURIComponent('Name: ' + name + '\nSubject: ' + subject + '\nMessage: ' + message);
            window.open(waUrl, '_blank');
            showToast('Message sent. We will respond shortly.');
            contactForm.reset();
        });
    }

    /* ─── Event Enquiry Form ─── */
    var eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('eventName').value.trim();
            var phone = document.getElementById('eventPhone').value.trim();
            var type = document.getElementById('eventType').value;
            var guests = document.getElementById('eventGuests').value;
            var msg = document.getElementById('eventMessage').value.trim();
            if (!name || !phone || !type || !guests || !msg) { showToast('Please fill in all fields.'); return; }
            var waMsg = 'Event Enquiry - Name: ' + name + ', Phone: ' + phone + ', Type: ' + type + ', Guests: ' + guests + ', Details: ' + msg;
            window.open('https://wa.me/923499740602?text=' + encodeURIComponent(waMsg), '_blank');
            showToast('Enquiry sent. We will contact you shortly.');
            eventForm.reset();
        });
    }

    /* ─── Today's Special Badge ─── */
    (function () {
        var items = document.querySelectorAll('.menu-item');
        var today = new Date().getDay();
        var indices = [2, 5, 1, 4, 0, 3, 2];
        var idx = indices[today] || 0;
        if (items.length > idx) {
            var badge = document.createElement('span');
            badge.className = 'menu-tag menu-tag--today';
            badge.textContent = 'Today\'s Special';
            var meta = items[idx].querySelector('.menu-item-meta');
            if (meta) { meta.appendChild(badge); }
        }
    })();

    /* ─── Newsletter ─── */
    var nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
        nlForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var email = document.getElementById('newsletterEmail').value.trim();
            if (!email) return;
            var btn = nlForm.querySelector('button');
            btn.textContent = 'Subscribed!';
            showToast('Thank you for subscribing!');
            setTimeout(function () { btn.textContent = 'Subscribe'; }, 2000);
            nlForm.reset();
        });
    }

    /* ─── Toast ─── */
    function showToast(msg) {
        if (!toast || !toastMsg) return;
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(function () { toast.classList.remove('show'); }, 3000);
    }

    /* ─── Animated Counters ─── */
    (function () {
        var counters = document.querySelectorAll('.stat-number');
        if (!counters.length) return;
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute('data-count'), 10);
                    if (isNaN(target)) return;
                    var duration = 1500;
                    var start = performance.now();
                    function animate(now) {
                        var p = Math.min((now - start) / duration, 1);
                        var eased = 1 - Math.pow(1 - p, 3);
                        var val = target >= 1000 ? Math.floor(eased * target).toLocaleString() : Math.floor(eased * target);
                        el.textContent = val;
                        if (p < 1) { requestAnimationFrame(animate); }
                        else { el.textContent = target >= 1000 ? target.toLocaleString() : target; }
                    }
                    requestAnimationFrame(animate);
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(function (c) { obs.observe(c); });
    })();

    /* ─── Parallax Hero ─── */
    (function () {
        var hero = document.querySelector('.hero');
        var heroContent = document.querySelector('.hero-content');
        if (!hero || !heroContent) return;
        window.addEventListener('scroll', function () {
            var scrolled = window.pageYOffset;
            var rate = scrolled * 0.3;
            if (rate < 200) { heroContent.style.transform = 'translateY(' + rate + 'px)'; }
        }, { passive: true });
    })();

    /* ─── Scroll Reveal ─── */
    (function () {
        var els = document.querySelectorAll(
            '.featured-card, .stat-item, .about-content, .about-media, ' +
            '.menu-item, .deal-card, .gallery-item, .testimonial-card, ' +
            '.event-card, .blog-card, .instagram-item, .reservation-form, ' +
            '.res-info-card, .contact-info, .contact-map, .newsletter-wrapper, ' +
            '.owner-card, .chef-card, .tourist-step, .event-form, .footer-owner-signature'
        );
        els.forEach(function (el) { el.classList.add('reveal'); });
        /* divider row reveal */
        var dividers = document.querySelectorAll('.divider-row');
        /* owner card frame trace */
        var frames = document.querySelectorAll('.owner-card-frame');
        if (typeof IntersectionObserver !== 'undefined') {
            var obs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
            els.forEach(function (el) { obs.observe(el); });
            /* divider rows */
            dividers.forEach(function (d) {
                obs.observe(d);
            });
            /* owner frames */
            frames.forEach(function (f) {
                obs.observe(f);
            });
        }
        /* divider row class addition via separate observer */
        if (typeof IntersectionObserver !== 'undefined') {
            var divObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        divObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            dividers.forEach(function (d) { divObs.observe(d); });
        }
    })();

    /* ─── Back to Top ─── */
    if (backToTop) {
        backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }

    /* ─── Smooth Anchor Scroll ─── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' });
            }
        });
    });

    /* ─── Min date for reservations ─── */
    var dateInput = document.getElementById('resDate');
    if (dateInput) {
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    }

    /* ─── PDF Download (placeholder) ─── */
    var pdfBtn = document.getElementById('pdfDownload');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showToast('PDF menu coming soon. Please check back.');
        });
    }

    /* ─── WhatsApp Order buttons ─── */
    document.querySelectorAll('.menu-item .btn--ghost').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var item = this.closest('.menu-item');
            var nameEl = item ? item.querySelector('.name-en') : null;
            var name = nameEl ? nameEl.textContent.trim() : 'this item';
            var msg = 'Hello! I would like to order ' + name + ' from Rasoie.';
            window.open('https://wa.me/923499740602?text=' + encodeURIComponent(msg), '_blank');
        });
    });

    /* ─── Deal Order buttons ─── */
    document.querySelectorAll('.deal-card .btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var card = this.closest('.deal-card');
            var nameEl = card ? card.querySelector('h4') : null;
            var name = nameEl ? nameEl.textContent.trim() : 'this deal';
            var msg = 'Hello! I would like to order the ' + name + ' deal from Rasoie.';
            window.open('https://wa.me/923499740602?text=' + encodeURIComponent(msg), '_blank');
        });
    });

    /* ─── Splash Screen ─── */
    (function () {
        var splash = document.getElementById('splash');
        if (!splash) return;
        var scrollY = window.scrollY;
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
        function hideSplash() {
            splash.classList.add('splash--hidden');
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
            splash.addEventListener('transitionend', function () { splash.style.display = 'none'; }, { once: true });
        }
        splash.addEventListener('click', hideSplash);
        setTimeout(hideSplash, 3000);
    })();

})();

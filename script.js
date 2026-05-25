(function () {
    // --- Hamburger Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('open');
            }
        });
    }

    // --- Hours Status ---
    const statusEl = document.getElementById('status');

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const min = now.getMinutes();

    function isOpen(d, h, m) {
        if (d === 6) return false;
        if (d === 0) return false;
        const total = h * 60 + m;
        const open = 10 * 60;
        const close = 22 * 60;
        return total >= open && total < close;
    }

    const open = isOpen(day, hour, min);

    if (open) {
        statusEl.textContent = 'Open now — 10:00 AM to 10:00 PM';
        statusEl.style.color = '#2b8a3e';
    } else {
        statusEl.textContent = 'Closed now — opens Mon–Fri, 10:00 AM';
        statusEl.style.color = '#c92a2a';
    }
})();

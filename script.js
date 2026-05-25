(function () {
    const statusEl = document.getElementById('status');

    const now = new Date();
    const day = now.getDay();       // 0=Sun, 1=Mon …
    const hour = now.getHours();
    const min = now.getMinutes();

    function isOpen(d, h, m) {
        if (d === 6) return false;           // Sat closed
        if (d === 0) return false;           // Sun closed
        const total = h * 60 + m;
        const open = 10 * 60;                // 10:00
        const close = 22 * 60;               // 22:00
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

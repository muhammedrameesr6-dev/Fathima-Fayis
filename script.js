// ============================================================
// FALLING FLOWERS — SVG petals drift from top to bottom
// ============================================================
(function () {
  const field = document.getElementById('flowerField');
  if (!field) return;

  // Colour palette matching the dark crimson theme
  const colours = [
    '#C8393A', '#9a1a20', '#F5EBE6',
    '#C4909A', '#e05050', '#7a0e14',
    '#F0E4E0', '#A84350'
  ];

  // Four SVG flower shapes (as inline SVG strings)
  const shapes = [
    // 5-petal rounded flower
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.65" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(72  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(144 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(216 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5" ry="9" transform="rotate(288 20 20)"/>
      <circle  cx="20" cy="20" r="5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // 6-petal daisy
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(60  20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(120 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(240 20 20)"/>
      <ellipse cx="20" cy="7"  rx="4" ry="8" transform="rotate(300 20 20)"/>
      <circle  cx="20" cy="20" r="4.5" fill="${c}" opacity="0.8"/>
    </svg>`,

    // Single petal / leaf shape
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.55" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4 C 28 12, 28 28, 20 36 C 12 28, 12 12, 20 4 Z"/>
    </svg>`,

    // 4-petal botanical style
    (c, s) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40" fill="${c}" opacity="0.6" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(0   20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(90  20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(180 20 20)"/>
      <ellipse cx="20" cy="8"  rx="5.5" ry="10" transform="rotate(270 20 20)"/>
      <circle  cx="20" cy="20" r="4" fill="${c}" opacity="0.75"/>
    </svg>`,
  ];

  const TOTAL = 12;  // number of flowers in the pool
  const rnd = (a, b) => Math.random() * (b - a) + a;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < TOTAL; i++) {
    const el = document.createElement('div');
    el.className = 'flower';

    const size = rnd(14, 32);                   // px
    const colour = pick(colours);
    const shapeIdx = Math.floor(rnd(0, shapes.length));
    const duration = rnd(7, 18);                // fall speed (s)
    const spinSpeed = rnd(4, 14);               // rotation speed (s)
    const delay = rnd(-duration, 0);            // stagger so they're already mid-air
    const leftPct = rnd(0, 100);                // horizontal start
    const drift = `${rnd(-80, 80)}px`;          // horizontal wander during fall

    el.style.cssText = `
      left: ${leftPct}%;
      --drift: ${drift};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    el.innerHTML = shapes[shapeIdx](colour, Math.round(size));

    // Apply spin speed to the inner svg
    const svg = el.querySelector('svg');
    if (svg) {
      svg.style.animationDuration = `${spinSpeed}s`;
    }

    field.appendChild(el);
  }
})();

// Wedding Reception: Sunday, 27th December 2026, 6:00 PM IST
const RECEPTION_DATE = new Date('2026-12-27T18:00:00+05:30').getTime();

const cdDays = document.getElementById('cd-days');
const cdHours = document.getElementById('cd-hours');
const cdMins = document.getElementById('cd-mins');
const cdSecs = document.getElementById('cd-secs');

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = Date.now();
  let diff = RECEPTION_DATE - now;

  if (diff <= 0) {
    if (cdDays) cdDays.textContent = '00';
    if (cdHours) cdHours.textContent = '00';
    if (cdMins) cdMins.textContent = '00';
    if (cdSecs) cdSecs.textContent = '00';
    return;
  }

  const days = Math.floor(diff / 86400000); diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000); diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  if (cdDays) cdDays.textContent = pad(days);
  if (cdHours) cdHours.textContent = pad(hours);
  if (cdMins) cdMins.textContent = pad(mins);
  if (cdSecs) cdSecs.textContent = pad(secs);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// SPLASH SCREEN — dismiss on "Open Invitation" click + autoplay music
// ============================================================
const splashOverlay = document.getElementById('splashOverlay');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const bgMusic = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const musicRing = document.getElementById('musicRing');
const iconOn = musicBtn ? musicBtn.querySelector('.music-icon--on') : null;
const iconOff = musicBtn ? musicBtn.querySelector('.music-icon--off') : null;

// Update button appearance to match actual playing state
function syncMusicBtn(playing) {
  if (!musicBtn) return;
  if (playing) {
    if (iconOn) iconOn.style.display = '';
    if (iconOff) iconOff.style.display = 'none';
    musicBtn.setAttribute('aria-label', 'Pause music');
    if (musicRing) musicRing.classList.add('spinning');
  } else {
    if (iconOn) iconOn.style.display = 'none';
    if (iconOff) iconOff.style.display = '';
    musicBtn.setAttribute('aria-label', 'Play music');
    if (musicRing) musicRing.classList.remove('spinning');
  }
}

// Attempt autoplay when user clicks "Open Invitation"
if (openInvitationBtn) {
  openInvitationBtn.addEventListener('click', () => {
    if (splashOverlay) {
      splashOverlay.classList.add('hidden');
      splashOverlay.addEventListener('transitionend', () => {
        splashOverlay.remove();
      }, { once: true });
    }

    // Make the floating music toggle button visible
    if (musicBtn) {
      musicBtn.classList.add('visible');
    }

    // Autoplay — browsers allow this after a user gesture
    if (bgMusic) {
      bgMusic.volume = 0.55;
      bgMusic.play().then(() => {
        syncMusicBtn(true);
      }).catch(() => {
        // Autoplay blocked — show button in paused state
        syncMusicBtn(false);
      });
    }
  });
}

// Toggle play / pause via floating button
if (musicBtn && bgMusic) {
  musicBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => syncMusicBtn(true));
    } else {
      bgMusic.pause();
      syncMusicBtn(false);
    }
  });

  // Keep button in sync if audio ends or pauses
  bgMusic.addEventListener('pause', () => syncMusicBtn(false));
  bgMusic.addEventListener('play', () => syncMusicBtn(true));
}

// ============================================================
// REVEAL ON SCROLL
// ============================================================
const revealTargets = document.querySelectorAll(
  '.occasion-card, .countdown-grid, .venue-card, .rsvp-card, .section-title, .section-eyebrow, .invite-note p, .couples-img-container, .wish-card, .contact-card'
);

revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => observer.observe(el));

// ============================================================
// WISHING BOX — sends message to WhatsApp
// ============================================================

// Target WhatsApp number (international format, no + or spaces)
const WHATSAPP_NUMBER = '919846966833';

const wishForm     = document.getElementById('wishForm');
const wishSuccess  = document.getElementById('wishSuccess');
const wishAgainBtn = document.getElementById('wishAgainBtn');

if (wishForm) {
  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('wishName');
    const msgEl  = document.getElementById('wishMessage');
    const name   = nameEl ? nameEl.value.trim() : '';
    const msg    = msgEl ? msgEl.value.trim() : '';

    // Basic validation — highlight empty fields
    let valid = true;
    [nameEl, msgEl].forEach(el => {
      if (el && !el.value.trim()) {
        el.style.borderColor = 'var(--gold)';
        el.style.boxShadow   = '0 0 0 3px rgba(212, 175, 55, 0.25)';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow   = '';
        }, 2200);
        valid = false;
      }
    });
    if (!valid) { if (nameEl) nameEl.focus(); return; }

    // Build WhatsApp deep-link with pre-filled message
    const text = `*Wedding Reception Wish for Fathima & Fayis*\n\n*From:* ${name}\n\n*Message:*\n${msg}`;
    const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');

    // Show success state
    wishForm.hidden    = true;
    if (wishSuccess) wishSuccess.hidden = false;
  });
}

if (wishAgainBtn) {
  wishAgainBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('wishName');
    const msgInput = document.getElementById('wishMessage');
    if (nameInput) nameInput.value = '';
    if (msgInput) msgInput.value = '';
    if (wishSuccess) wishSuccess.hidden = true;
    if (wishForm) wishForm.hidden = false;
  });
}

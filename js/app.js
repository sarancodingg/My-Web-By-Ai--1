/**
 * Main Application Logic for Romantic Flirting & Confession Website
 */

// Initial default state
const AppState = {
  recipient: 'ขนมหวาน',
  sender: 'เค้าเอง 🩵',
  startDate: '2023-11-15T21:00:00', // 15 พฤศจิกายน 2566 เวลา 21:00 น. (3 ทุ่ม)
  question: 'อยู่ด้วยกันนานๆนะ 💖',
  subQuestion: 'ถ้าตกลง เค้าสัญญาว่าจะดูแลขนมหวานให้ดีที่สุดเลย... อย่ากดปุ่มปฏิเสธเลยนะ 🥺',
  yesText: 'ตกลงเลยยย! 🥰',
  letterText: `ตั้งแต่มีขนมหวานเข้ามาในชีวิต โลกใบเดิมก็สดใสและมีความหมายขึ้นเยอะเลย ขอบคุณในทุกๆ รอยยิ้ม ความอบอุ่น และความน่ารักที่มอบให้กันเสมอมานะ\n\nทุกครั้งที่ได้คุยด้วย หรือแม้แต่เห็นข้อความของขนมหวาน มันทำให้วันธรรมดาๆ กลายเป็นวันที่ดีที่สุดได้เสมอเลย...`,
  theme: 'sky'
};

// Fun dodging messages for the 'No' button
const NO_BUTTON_TEXTS = [
  'ไม่เอาหรอกก 😜',
  'กดไม่ทันหรอกก~ 💨',
  'อย่าดื้อสิ 🥺',
  'ปุ่มนี้เสียนะ กดไม่ได้! 🙈',
  'ใจร้ายจังงง 🥺',
  'ยอมใจอ่อนเถอะน้าา 💕',
  'กดปุ่มเขียวดีกว่าเยอะ! ✨',
  'จับให้ได้สิ แบร่ 😝',
  'ไม่ให้กดหรอกก 🏃‍♂️'
];

// Romantic Fortune Cards
const FORTUNE_MESSAGES = [
  { icon: '☕', hint: 'แตะเพื่อเปิด', text: 'กาแฟยังมีคาเฟอีน แต่เวลาเธอยิ้มให้ที มีแต่ความฟินล้วนๆ ☕' },
  { icon: '👀', hint: 'แตะเพื่อเปิด', text: 'ที่มองบ่อยๆ ไม่ได้จับผิดนะ... แค่จับใจ ❤️' },
  { icon: '🤝', hint: 'แตะเพื่อเปิด', text: 'ไม่อยากเป็นแค่คนคุย อยากเป็นคนข้างๆ ที่กุมมือเธอไปเรื่อยๆ 👫' },
  { icon: '🌟', hint: 'แตะเพื่อเปิด', text: 'ไม่ได้ชอบคนที่หน้าตา... แต่ชอบทุกอย่างที่เป็นเธอเลยนะ 🙈' },
  { icon: '🧣', hint: 'แตะเพื่อเปิด', text: 'อากาศจะหนาวหรือร้อน แค่มีเธออยู่ด้วยก็อบอุ่นหัวใจเสมอ 💖' },
  { icon: '🍀', hint: 'แตะเพื่อเปิด', text: 'การได้เจอกับเธอ คือเรื่องโชคดีที่สุดของปีนี้เลยนะ ✨' }
];

document.addEventListener('DOMContentLoaded', () => {
  initUrlParams();
  initEnvelope();
  initThemeToggle();
  initMusicToggle();
  initMeter();
  initFortuneCards();
  initDayCounter();
  initRunawayButton();
  initCelebration();
  initSettingsModal();
  updateUI();
});

/* ==========================================================================
   State & URL Params Engine
   ========================================================================== */
function initUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);

  // Check URL parameters first (allows sharing directly via link!)
  if (urlParams.has('to')) AppState.recipient = urlParams.get('to');
  if (urlParams.has('from')) AppState.sender = urlParams.get('from');
  if (urlParams.has('d')) AppState.startDate = urlParams.get('d');
  if (urlParams.has('q')) AppState.question = urlParams.get('q');
  if (urlParams.has('msg')) AppState.letterText = decodeURIComponent(urlParams.get('msg'));

  // If no URL params, restore from localStorage if available
  if (!urlParams.has('to')) {
    const saved = localStorage.getItem('romantic_web_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(AppState, parsed);
        // Ensure recipient defaults to ขนมหวาน if old default was saved
        if (!parsed.recipient || parsed.recipient === 'เธอคนพิเศษ') {
          AppState.recipient = 'ขนมหวาน';
        }
        if (parsed.letterText && parsed.letterText.includes('ตั้งแต่มีเธอเข้ามาในชีวิต')) {
          AppState.letterText = `ตั้งแต่มีขนมหวานเข้ามาในชีวิต โลกใบเดิมก็สดใสและมีความหมายขึ้นเยอะเลย ขอบคุณในทุกๆ รอยยิ้ม ความอบอุ่น และความน่ารักที่มอบให้กันเสมอมานะ\n\nทุกครั้งที่ได้คุยด้วย หรือแม้แต่เห็นข้อความของขนมหวาน มันทำให้วันธรรมดาๆ กลายเป็นวันที่ดีที่สุดได้เสมอเลย...`;
        }
        if (parsed.subQuestion && parsed.subQuestion.includes('ดูแลเธอให้ดีที่สุดเลย')) {
          AppState.subQuestion = 'ถ้าตกลง เค้าสัญญาว่าจะดูแลขนมหวานให้ดีที่สุดเลย... อย่ากดปุ่มปฏิเสธเลยนะ 🥺';
        }
        // Ensure the default date is 2023-11-15T21:00:00 if saved had old relative date
        if (!urlParams.has('d') && (!parsed.startDate || parsed.startDate.length < 16)) {
          AppState.startDate = '2023-11-15T21:00:00';
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }
}

function saveState() {
  localStorage.setItem('romantic_web_state', JSON.stringify(AppState));
  updateUI();
}

function updateUI() {
  // Update recipient
  const dispRecipient = document.getElementById('display-recipient');
  if (dispRecipient) dispRecipient.textContent = `ถึง: ${AppState.recipient} 💕`;

  const dispMeterName = document.getElementById('display-meter-name');
  if (dispMeterName) dispMeterName.textContent = AppState.recipient;

  const certReceiver = document.getElementById('cert-receiver');
  if (certReceiver) certReceiver.textContent = AppState.recipient;

  // Update sender
  const dispSender = document.getElementById('display-sender');
  if (dispSender) dispSender.textContent = `จาก: ${AppState.sender}`;

  const certSender = document.getElementById('cert-sender');
  if (certSender) certSender.textContent = AppState.sender;

  // Update letter text
  const dispLetter = document.getElementById('display-letter-text');
  if (dispLetter) dispLetter.textContent = AppState.letterText;

  // Update question & subquestion
  const dispQuestion = document.getElementById('display-main-question');
  if (dispQuestion) dispQuestion.textContent = AppState.question;

  const dispSubQuestion = document.getElementById('display-sub-question');
  if (dispSubQuestion && AppState.subQuestion) dispSubQuestion.textContent = AppState.subQuestion;

  // Update date
  const dispDate = document.getElementById('display-date');
  if (dispDate && AppState.startDate) {
    const d = new Date(AppState.startDate);
    const dateFormatted = d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeFormatted = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    dispDate.textContent = `${dateFormatted} (${timeFormatted})`;
  }

  const counterStartLabel = document.getElementById('counter-start-label');
  if (counterStartLabel && AppState.startDate) {
    const d = new Date(AppState.startDate);
    const dateFormatted = d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const timeFormatted = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.';
    counterStartLabel.textContent = `นับตั้งแต่วันที่ ${dateFormatted} เวลา ${timeFormatted}`;
  }

  const certDateText = document.getElementById('cert-date-text');
  if (certDateText) {
    const now = new Date();
    certDateText.textContent = `ออกให้ ณ วันที่ ${now.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}`;
  }
}

/* ==========================================================================
   Envelope Opening Logic
   ========================================================================== */
function initEnvelope() {
  const wrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  if (!wrapper || !envelope) return;

  wrapper.addEventListener('click', (e) => {
    // If click was inside the letter paper when opened and target was a link or close hint, handle toggle
    const isOpened = envelope.classList.contains('opened');

    if (!isOpened) {
      envelope.classList.add('opened');
      if (window.romanticAudio) {
        window.romanticAudio.playEnvelopeOpen();
      }
      if (window.romanticParticles) {
        const rect = envelope.getBoundingClientRect();
        window.romanticParticles.burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 45);
      }
    } else {
      // Toggle close if clicking envelope flap or close hint
      if (e.target.closest('.letter-close-hint') || e.target.closest('.wax-seal') || e.target.classList.contains('envelope-flap')) {
        envelope.classList.remove('opened');
        if (window.romanticAudio) {
          window.romanticAudio.playHeartPop();
        }
      }
    }
  });

  // Keyboard accessibility (Enter or Space)
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      wrapper.click();
    }
  });
}

/* ==========================================================================
   Music & Theme Controls
   ========================================================================== */
function initThemeToggle() {
  const btn = document.getElementById('btn-theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    AppState.theme = AppState.theme === 'sky' ? 'hearts' : 'sky';
    btn.textContent = AppState.theme === 'sky' ? '☁️' : '🩵';
    if (window.romanticParticles) {
      window.romanticParticles.setTheme(AppState.theme);
    }
    if (window.romanticAudio) {
      window.romanticAudio.playHeartPop();
    }
  });
}

function initMusicToggle() {
  const btn = document.getElementById('btn-music-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (window.romanticAudio) {
      const isPlaying = window.romanticAudio.toggleMusic();
      btn.classList.toggle('active', isPlaying);
      btn.title = isPlaying ? 'หยุดเล่นเพลงกล่องดนตรี' : 'เปิดเพลงกล่องดนตรีบรรเลง';
    }
  });
}

/* ==========================================================================
   Cute-O-Meter Logic
   ========================================================================== */
function initMeter() {
  const btn = document.getElementById('btn-charge-meter');
  const bar = document.getElementById('meter-bar');
  const num = document.getElementById('meter-num');
  const text = document.getElementById('meter-text');
  if (!btn || !bar || !num || !text) return;

  let isCharging = false;

  btn.addEventListener('click', () => {
    if (isCharging) return;
    isCharging = true;
    btn.disabled = true;

    if (window.romanticAudio) window.romanticAudio.playHeartPop();

    text.textContent = '🔍 กำลังประมวลผลความน่ารักแบบเรียลไทม์...';
    bar.style.width = '10%';
    num.textContent = '10%';

    let current = 10;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 18) + 12;

      if (current >= 100 && current < 120) {
        num.textContent = '100%';
        bar.style.width = '100%';
        text.textContent = '✨ น่ารักเต็มร้อย... เดี๋ยวนะ! มิเตอร์ยังไม่ยอมหยุด?!';
        if (window.romanticAudio) window.romanticAudio.playChime();
      } else if (current >= 150) {
        clearInterval(interval);
        // Overload explosion to 999%
        num.textContent = '999%';
        num.style.transform = 'scale(1.35)';
        bar.style.width = '100%';
        bar.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8, #06b6d4)';
        text.innerHTML = '⚠️ <strong>แจ้งเตือนฉุกเฉิน!</strong> ขนมหวานน่ารักเกิน 999% ทะลุหลอดแตก! ใจละลายหมดแล้ววว! 💥🩵';

        if (window.romanticAudio) window.romanticAudio.playCelebration();
        if (window.romanticParticles) {
          const rect = btn.getBoundingClientRect();
          window.romanticParticles.burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 70);
        }

        setTimeout(() => {
          num.style.transform = 'scale(1)';
          btn.disabled = false;
          isCharging = false;
        }, 1500);
        return;
      } else {
        num.textContent = `${current}%`;
        bar.style.width = `${Math.min(current, 100)}%`;
      }
    }, 70);
  });
}

/* ==========================================================================
   Days Counter Logic
   ========================================================================== */
function initDayCounter() {
  function tick() {
    const daysEl = document.getElementById('count-days');
    const hoursEl = document.getElementById('count-hours');
    const minsEl = document.getElementById('count-minutes');
    const secsEl = document.getElementById('count-seconds');
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    const start = new Date(AppState.startDate).getTime();
    const now = new Date().getTime();
    let diff = Math.max(0, now - start);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);

    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = days.toLocaleString('th-TH');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   Fortune Cards
   ========================================================================== */
function initFortuneCards() {
  const container = document.getElementById('fortune-container');
  if (!container) return;

  container.innerHTML = '';
  FORTUNE_MESSAGES.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'fortune-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `การ์ดความในใจใบที่ ${index + 1}`);

    card.innerHTML = `
      <div class="fortune-card-inner">
        <div class="fortune-card-front">
          <div class="icon">${item.icon}</div>
          <div style="font-weight: 600; font-size: 1.05rem;">การ์ดความรู้สึก #${index + 1}</div>
          <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 4px;">${item.hint}</div>
        </div>
        <div class="fortune-card-back">
          <p>${item.text}</p>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
      if (window.romanticAudio) {
        window.romanticAudio.playChime();
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });

    container.appendChild(card);
  });
}

/* ==========================================================================
   The Runaway 'No' Button Logic
   ========================================================================== */
function initRunawayButton() {
  const btnNo = document.getElementById('btn-confess-no');
  const btnYes = document.getElementById('btn-confess-yes');
  const arena = document.getElementById('button-arena');
  if (!btnNo || !btnYes || !arena) return;

  let noDodgeCount = 0;
  let yesScale = 1;

  function dodge() {
    noDodgeCount++;
    const arenaRect = arena.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Calculate maximum allowable coordinates inside arena
    const maxX = arenaRect.width - btnRect.width - 20;
    const maxY = arenaRect.height - btnRect.height - 20;

    // Pick random target location
    const newX = Math.max(10, Math.floor(Math.random() * maxX));
    const newY = Math.max(10, Math.floor(Math.random() * maxY));

    btnNo.style.position = 'absolute';
    btnNo.style.left = `${newX}px`;
    btnNo.style.top = `${newY}px`;

    // Pick playful teasing text
    const textIndex = noDodgeCount % NO_BUTTON_TEXTS.length;
    btnNo.querySelector('span').textContent = NO_BUTTON_TEXTS[textIndex];

    // Yes button gets bigger with each dodge attempt!
    yesScale = Math.min(yesScale + 0.08, 1.6);
    btnYes.style.transform = `scale(${yesScale})`;

    if (window.romanticAudio) {
      window.romanticAudio.playDodge();
    }
  }

  // Hover on desktop
  btnNo.addEventListener('mouseenter', dodge);

  // Proximity detection: when mouse comes within 60px of the button
  arena.addEventListener('mousemove', (e) => {
    const btnRect = btnNo.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    if (dist < 60) {
      dodge();
    }
  });

  // Touch for mobile devices
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodge();
  }, { passive: false });

  // Click attempt fallback
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    dodge();
  });
}

/* ==========================================================================
   Celebration Modal & Certificate
   ========================================================================== */
function initCelebration() {
  const btnYes = document.getElementById('btn-confess-yes');
  const modal = document.getElementById('modal-celebration');
  const btnClose = document.getElementById('btn-close-celebration');
  const btnCopy = document.getElementById('btn-copy-sweet-message');
  const btnShareLine = document.getElementById('btn-share-line');
  if (!btnYes || !modal) return;

  btnYes.addEventListener('click', () => {
    modal.classList.add('active');

    if (window.romanticAudio) {
      window.romanticAudio.playCelebration();
    }

    if (window.romanticParticles) {
      // Fire multi-stage fireworks!
      window.romanticParticles.burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 120);
      setTimeout(() => {
        window.romanticParticles.burstConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4, 90);
      }, 400);
      setTimeout(() => {
        window.romanticParticles.burstConfetti(window.innerWidth * 0.7, window.innerHeight * 0.4, 90);
      }, 800);
    }
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Copy sweet message
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const sweetText = `เย้! เค้าตกลงเป็นแฟนกับเธอแล้วนะ 💕 ขอบคุณที่คอยอยู่ข้างๆ กันนะคนเก่ง! (${window.location.href})`;
      navigator.clipboard.writeText(sweetText).then(() => {
        const origText = btnCopy.textContent;
        btnCopy.textContent = '✅ คัดลอกสำเร็จแล้ว!';
        setTimeout(() => {
          btnCopy.textContent = origText;
        }, 2000);
      }).catch(() => {
        alert('คัดลอกข้อความ: ' + sweetText);
      });
    });
  }

  // Share to LINE
  if (btnShareLine) {
    btnShareLine.addEventListener('click', () => {
      const lineText = encodeURIComponent(`เย้! เค้าตอบตกลงแล้วนะ 💕 มาดูใบรับรองแฟนของเราตรงนี้สิ: ${window.location.href}`);
      window.open(`https://line.me/R/msg/text/?${lineText}`, '_blank');
    });
  }
}

/* ==========================================================================
   Settings Modal & URL Generator
   ========================================================================== */
function initSettingsModal() {
  const modal = document.getElementById('modal-settings');
  const btnOpen = document.getElementById('btn-open-settings');
  const btnClose = document.getElementById('btn-close-settings');
  const btnSave = document.getElementById('btn-save-settings');
  const btnCopyShare = document.getElementById('btn-copy-share-url');

  const inputRecipient = document.getElementById('input-recipient');
  const inputSender = document.getElementById('input-sender');
  const inputDate = document.getElementById('input-date');
  const inputQuestion = document.getElementById('input-question');
  const inputLetter = document.getElementById('input-letter');

  if (!modal || !btnOpen) return;

  function syncInputs() {
    if (inputRecipient) inputRecipient.value = AppState.recipient;
    if (inputSender) inputSender.value = AppState.sender;
    if (inputDate) inputDate.value = AppState.startDate ? AppState.startDate.slice(0, 16) : '';
    if (inputQuestion) inputQuestion.value = AppState.question;
    if (inputLetter) inputLetter.value = AppState.letterText;
  }

  btnOpen.addEventListener('click', () => {
    syncInputs();
    modal.classList.add('active');
    if (window.romanticAudio) window.romanticAudio.playHeartPop();
  });

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      if (inputRecipient && inputRecipient.value.trim()) AppState.recipient = inputRecipient.value.trim();
      if (inputSender && inputSender.value.trim()) AppState.sender = inputSender.value.trim();
      if (inputDate && inputDate.value) AppState.startDate = inputDate.value;
      if (inputQuestion && inputQuestion.value.trim()) AppState.question = inputQuestion.value.trim();
      if (inputLetter && inputLetter.value.trim()) AppState.letterText = inputLetter.value.trim();

      saveState();
      modal.classList.remove('active');
      if (window.romanticAudio) window.romanticAudio.playChime();
    });
  }

  if (btnCopyShare) {
    btnCopyShare.addEventListener('click', () => {
      // Build full shareable URL with parameters
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('to', inputRecipient ? inputRecipient.value.trim() : AppState.recipient);
      url.searchParams.set('from', inputSender ? inputSender.value.trim() : AppState.sender);
      if (inputDate && inputDate.value) url.searchParams.set('d', inputDate.value);
      if (inputQuestion && inputQuestion.value) url.searchParams.set('q', inputQuestion.value);
      if (inputLetter && inputLetter.value) url.searchParams.set('msg', encodeURIComponent(inputLetter.value));

      const shareLink = url.toString();
      navigator.clipboard.writeText(shareLink).then(() => {
        const origText = btnCopyShare.textContent;
        btnCopyShare.textContent = '✅ คัดลอกลิงก์สำเร็จ!';
        setTimeout(() => {
          btnCopyShare.textContent = origText;
        }, 2200);
      }).catch(() => {
        prompt('คัดลอกลิงก์สำหรับส่งให้เธอ:', shareLink);
      });
    });
  }
}

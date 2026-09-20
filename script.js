const WA_NUMBER = '966559029157';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav') || document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
        if (nav) nav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
      }
    }
  });
});

// FAQ
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
  });
});

// Header: hide on scroll down, show on scroll up
const header = document.getElementById('siteHeader') || document.querySelector('.header');
const scrollTopBtn = document.getElementById('scrollTop');
let lastY = window.pageYOffset;
window.addEventListener('scroll', () => {
  const y = window.pageYOffset;
  if (header) {
    const navOpen = nav && nav.classList.contains('active');
    if (!navOpen) {
      if (y > 250 && y > lastY + 4) {
        header.classList.add('header-hidden'); // نازل لتحت -> إخفاء
      } else if (y < lastY - 4 || y < 150) {
        header.classList.remove('header-hidden'); // طالع لفوق -> إظهار
      }
    }
  }
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle('visible', y > 400);
  }
  lastY = y;
}, { passive: true });

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
}

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const sy = window.pageYOffset;
  sections.forEach(sec => {
    const h = sec.offsetHeight, top = sec.offsetTop - 140, id = sec.getAttribute('id');
    if (sy > top && sy <= top + h) {
      document.querySelectorAll('.nav a').forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + id) l.classList.add('active');
      });
    }
  });
}, { passive: true });

/* ============================================================
   الحجز السريع في الهيرو — العميل يحدد عدد أيامه بحرية
   ============================================================ */
const pkgPick = document.getElementById('pkgPick');
let currentPkg = 'الباقة الاقتصادية (باص + فندق 3 نجوم)';
if (pkgPick) {
  pkgPick.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      pkgPick.querySelectorAll('button').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      currentPkg = b.dataset.pkg;
      updateQuickLink();
    });
  });
}

const MIN_PAX = 1, MAX_PAX = 49;
const MIN_DAYS = 1, MAX_DAYS = 30;
let pax = 2;
let days = 4;

const paxEl = document.getElementById('paxCount');
const daysEl = document.getElementById('daysCount');
const daysCounter = document.getElementById('daysCounter');
const openDays = document.getElementById('openDays');
const quickBtn = document.getElementById('quickBookBtn');

const plusBtn = document.getElementById('plusBtn');
const minusBtn = document.getElementById('minusBtn');
const daysPlus = document.getElementById('daysPlus');
const daysMinus = document.getElementById('daysMinus');

// صيغة الجمع الصحيحة للأيام بالعربية
function daysLabel(n) {
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومان';
  if (n <= 10) return n + ' أيام';
  return n + ' يوماً';
}
function isOpenDuration() {
  return !!(openDays && openDays.checked);
}

function render() {
  if (paxEl) paxEl.textContent = pax;
  if (daysEl) daysEl.textContent = isOpenDuration() ? 'غير محددة' : daysLabel(days);
  if (daysCounter) daysCounter.classList.toggle('is-off', isOpenDuration());
  if (minusBtn) minusBtn.disabled = pax <= MIN_PAX;
  if (plusBtn) plusBtn.disabled = pax >= MAX_PAX;
  if (daysMinus) daysMinus.disabled = isOpenDuration() || days <= MIN_DAYS;
  if (daysPlus) daysPlus.disabled = isOpenDuration() || days >= MAX_DAYS;
  updateQuickLink();
}

function updateQuickLink() {
  if (!quickBtn) return;
  const duration = isOpenDuration() ? 'غير محددة — سأحددها عند التأكيد' : daysLabel(days);
  const msg = 'السلام عليكم، أريد حجز رحلة عمرة\n\n'
    + 'الباقة: ' + currentPkg + '\n'
    + 'عدد المعتمرين: ' + pax + '\n'
    + 'مدة الرحلة: ' + duration + '\n\n'
    + 'برجاء تأكيد التوفر والسعر';
  quickBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
}

if (plusBtn) plusBtn.addEventListener('click', () => { pax = Math.min(MAX_PAX, pax + 1); render(); });
if (minusBtn) minusBtn.addEventListener('click', () => { pax = Math.max(MIN_PAX, pax - 1); render(); });
if (daysPlus) daysPlus.addEventListener('click', () => { days = Math.min(MAX_DAYS, days + 1); render(); });
if (daysMinus) daysMinus.addEventListener('click', () => { days = Math.max(MIN_DAYS, days - 1); render(); });
if (openDays) openDays.addEventListener('change', render);
render();

// Contact form -> WhatsApp
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = 'السلام عليكم،\n\nالاسم: ' + name + '\nالجوال: ' + phone + '\nالرسالة: ' + message;
    if (typeof gtag_report_whatsapp === 'function') gtag_report_whatsapp();
    window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank');
  });
}

/* ============================================================
   تتبّع تحويلات إعلانات جوجل
   يعمل فقط في الصفحة التي تحتوي وسم gtag (الصفحة الرئيسية).
   صفحات تحويل الواتساب لا تحتوي الوسم — فلا يُسجَّل فيها أي شيء.
   ============================================================ */
document.addEventListener('click', function (e) {
  if (typeof gtag !== 'function') return;
  const link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (!link || link.hasAttribute('onclick')) return;   // الروابط ذات onclick تتولى التتبع بنفسها

  const href = link.getAttribute('href') || '';
  if (href.indexOf('wa.me/') > -1 || href.indexOf('api.whatsapp.com') > -1) {
    if (typeof gtag_report_whatsapp === 'function') gtag_report_whatsapp();
  } else if (href.indexOf('tel:') === 0) {
    if (typeof gtag_report_call === 'function') gtag_report_call();
  }
}, true);

// Reveal on scroll
const revealTargets = document.querySelectorAll('.service-card, .bus-card, .why-us-card, .faq-item, .contact-card, .hero-card, .gallery figure');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity = '1';
        en.target.style.transform = 'translateY(0)';
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    io.observe(el);
  });
}

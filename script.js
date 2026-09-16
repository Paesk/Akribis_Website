const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const demo = document.querySelector('[data-precision-demo]');
const modeButtons = document.querySelectorAll('button[data-mode]');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

modeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === demo?.dataset.mode)));

modeButtons.forEach((button) => button.addEventListener('click', () => {
  const mode = button.dataset.mode;
  modeButtons.forEach((item) => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  demo.dataset.mode = mode;
  demo.querySelector('[data-mode-label]').textContent = mode === 'akribis' ? 'Micro-correction active' : 'Macro movement';
  demo.querySelector('[data-path-legend]').innerHTML = mode === 'akribis'
    ? '<i class="legend-actual"></i>Corrected path'
    : '<i class="legend-actual"></i>Deviation';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
document.querySelector('[data-year]').textContent = new Date().getFullYear();

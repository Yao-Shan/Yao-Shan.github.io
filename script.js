'use strict';

const translations = [...document.querySelectorAll('[data-zh]')].map(element => ({
  element,
  en: element.textContent,
  zh: element.dataset.zh
}));
const languageButtons = [...document.querySelectorAll('[data-language]')];

function setLanguage(language) {
  const selected = language === 'zh' ? 'zh' : 'en';
  translations.forEach(({ element, en, zh }) => {
    element.textContent = selected === 'zh' ? zh : en;
  });
  document.documentElement.lang = selected === 'zh' ? 'zh-CN' : 'en';
  document.title = selected === 'zh' ? 'Shanyao Li · 个人学术主页' : 'Shanyao Li · Statistics & Mathematics';
  document.querySelector('nav').setAttribute('aria-label', selected === 'zh' ? '主导航' : 'Main navigation');
  languageButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === selected)));
  try { localStorage.setItem('shanyao-site-language', selected); } catch (_) { /* The page also works with storage disabled. */ }
}

languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
try {
  if (localStorage.getItem('shanyao-site-language') === 'zh') setLanguage('zh');
} catch (_) { /* Keep the readable English default. */ }

const sections = [...document.querySelectorAll('main > section[id]')];
const navigationLinks = [...document.querySelectorAll('nav a')];
let pendingFrame = false;

function updateNavigation() {
  const guide = window.innerHeight * 0.32;
  let current = sections[0].id;
  sections.forEach(section => {
    if (section.getBoundingClientRect().top <= guide) current = section.id;
  });
  navigationLinks.forEach(link => {
    const active = link.hash === `#${current}`;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  pendingFrame = false;
}

window.addEventListener('scroll', () => {
  if (!pendingFrame) {
    pendingFrame = true;
    window.requestAnimationFrame(updateNavigation);
  }
}, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

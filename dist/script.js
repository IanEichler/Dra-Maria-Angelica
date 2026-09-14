const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', expanded);
  menuButton.setAttribute('aria-expanded', String(expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Fechar menu' : 'Abrir menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) { closeMenu(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.navigation')) closeMenu();
});

const header = document.querySelector('.site-header');
const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')];
const linkedSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateNavigationState() {
  header.classList.toggle('scrolled', window.scrollY > 16);

  const marker = window.scrollY + window.innerHeight * 0.38;
  let currentSection = null;
  linkedSections.forEach(section => {
    if (section.offsetTop <= marker) currentSection = section.id;
  });

  sectionLinks.forEach(link => {
    const isCurrent = link.getAttribute('href') === `#${currentSection}`;
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

let navigationFrame = null;
window.addEventListener('scroll', () => {
  if (navigationFrame) return;
  navigationFrame = requestAnimationFrame(() => {
    updateNavigationState();
    navigationFrame = null;
  });
}, { passive: true });
updateNavigationState();
document.querySelector('#year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealGroups = [
  '.about-grid > *',
  '.section-heading > *',
  '.care-grid > *',
  '.services-layout > *',
  '.services-list > *',
  '.experience-grid > *',
  '.experience-list > *',
  '.contact-inner > *',
  '.footer-inner > *'
];

const revealElements = [];
revealGroups.forEach(selector => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 85}ms`);
    revealElements.push(element);
  });
});

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealElements.forEach(element => revealObserver.observe(element));
}

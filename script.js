document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    if (window.lucide) window.lucide.createIcons();
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (toggle) { toggle.innerHTML = '<i data-lucide="menu"></i>'; if (window.lucide) window.lucide.createIcons(); }
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  } else items.forEach(item => item.classList.add('visible'));
});

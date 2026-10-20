export function setupNavigation(page) {
  document.querySelectorAll('[data-page-link]').forEach(link => {
    if (link.dataset.pageLink === page) link.setAttribute('aria-current', 'page');
  });
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 4);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  const button = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('#main-nav');
  if (!button || !nav) return;
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const setOpen = open => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  };
  button.addEventListener('click', () => setOpen(!isOpen()));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('click', event => {
    if (isOpen() && !nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) { setOpen(false); button.focus(); }
  });
  matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
}

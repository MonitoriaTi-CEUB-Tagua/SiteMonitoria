import { icon } from '../core/icons.js';

// O tema inicial é aplicado por um script curto no <head> de cada página (evita o "piscar").
// Sem escolha salva, o site segue o tema do sistema; ao clicar, a escolha fica no navegador.
const KEY = 'tema';
const system = matchMedia('(prefers-color-scheme: dark)');
const stored = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const current = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

function apply(theme, button) {
  document.documentElement.dataset.theme = theme;
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach(meta => meta.setAttribute('content', bg));
  if (!button) return;
  const dark = theme === 'dark';
  button.innerHTML = icon(dark ? 'sun' : 'moon');
  button.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
  button.title = dark ? 'Tema claro' : 'Tema escuro';
}

export function setupTheme() {
  const button = document.querySelector('[data-theme-toggle]');
  apply(current(), button);
  button?.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(KEY, next); } catch { /* navegação privada: vale só nesta página */ }
    apply(next, button);
  });
  system.addEventListener('change', event => { if (!stored()) apply(event.matches ? 'dark' : 'light', button); });
}

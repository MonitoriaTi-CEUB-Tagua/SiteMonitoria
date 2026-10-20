import { loadIncludes } from './core/includes.js';
import { loadData } from './core/data.js';
import { hydrateIcons } from './core/icons.js';
import { safeURL } from './core/dom.js';
import { setupNavigation } from './components/navigation.js';
import { setupDialog } from './components/dialog.js';
import { setupTheme } from './components/theme.js';

const pages = {
  home: () => import('./pages/home.js'),
  contents: () => import('./pages/contents.js'),
  ideas: () => import('./pages/ideas.js'),
  projects: () => import('./pages/projects.js'),
  monitors: () => import('./pages/monitors.js'),
};

// Se a foto de um avatar não carregar, exibe as iniciais no lugar.
document.addEventListener('error', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || !img.matches('img.avatar')) return;
  const fallback = document.createElement('span');
  fallback.className = 'avatar';
  fallback.setAttribute('aria-hidden', 'true');
  fallback.textContent = img.dataset.initials || '';
  img.replaceWith(fallback);
}, true);

async function boot() {
  const page = document.body.dataset.page;
  // Componentes e dados são buscados em paralelo.
  const [, data] = await Promise.all([loadIncludes(), loadData()]);
  hydrateIcons();
  setupNavigation(page);
  setupTheme();
  document.querySelectorAll('[data-current-year]').forEach(node => { node.textContent = new Date().getFullYear(); });
  setupDialog(data.monitores, data.site);
  const github = safeURL(data.site.github);
  if (github) document.querySelectorAll('[data-community-github]').forEach(anchor => { anchor.href = github; });
  const module = await pages[page]();
  module.renderPage(data);
  document.querySelectorAll('[data-loading]').forEach(node => node.remove());
  document.documentElement.dataset.ready = 'true';
}

boot().catch(error => {
  console.error(error);
  const box = document.createElement('div');
  box.className = 'boot-error';
  box.setAttribute('role', 'alert');
  box.textContent = location.protocol === 'file:'
    ? 'Para visualizar os componentes e dados, abra este site por um servidor local. As instruções estão no README do projeto.'
    : 'Não foi possível carregar parte da página. Atualize para tentar novamente. Você também pode acessar o perfil da monitoria no GitHub.';
  document.querySelector('main').prepend(box);
  document.querySelectorAll('[data-loading]').forEach(node => node.remove());
  document.querySelectorAll('[data-participate]').forEach(button => { button.disabled = true; button.title = 'Atualize a página para carregar os contatos.'; });
});

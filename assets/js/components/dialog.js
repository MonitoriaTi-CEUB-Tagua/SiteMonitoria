import { escapeHTML as e, safeURL, externalAttrs } from '../core/dom.js';
import { icon } from '../core/icons.js';

// Lista os monitores atuais: contatos cadastrados + perfil do GitHub.
export function setupDialog(monitors, site) {
  const dialog = document.getElementById('participate-dialog');
  const list = dialog.querySelector('[data-contacts]');
  const current = monitors
    .filter(monitor => monitor.active)
    .map(monitor => {
      const links = monitor.contacts.map(contact => ({ ...contact, icon: contact.url.startsWith('mailto:') ? 'mail' : 'external' }));
      if (monitor.github && !links.some(link => link.url === monitor.github)) links.push({ label: 'GitHub', url: monitor.github, icon: 'github' });
      return { name: monitor.name, links };
    })
    .filter(monitor => monitor.links.length);
  list.innerHTML = current.map(monitor => `<div class="contact-row"><strong>${e(monitor.name)}</strong><div class="contact-links">${monitor.links.map(link => {
    const url = safeURL(link.url, { mail: true });
    return url ? `<a class="text-link" href="${e(url)}" ${externalAttrs(url)}>${icon(link.icon)}${e(link.label)}</a>` : '';
  }).join('')}</div></div>`).join('');
  if (!current.length) {
    const github = safeURL(site.github);
    list.innerHTML = `<div class="contact-empty">Os contatos serão adicionados em breve. Enquanto isso, acesse o perfil da monitoria.${github ? `<br><a class="text-link" href="${e(github)}" ${externalAttrs(github)}>${icon('github')}Abrir perfil da monitoria ${icon('external')}</a>` : ''}</div>`;
  }
  let trigger = null;
  const close = () => dialog.close();
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-participate]');
    if (!opener) return;
    trigger = opener;
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
  dialog.querySelector('[data-close-dialog]').addEventListener('click', close);
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    trigger?.focus();
  });
  // <dialog>.showModal() cuida da modalidade, do foco e da tecla Escape.
}

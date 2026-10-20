import { monitorCard, emptyState } from '../components/cards.js';

export function renderPage(data) {
  for (const [selector, active] of [['current', true], ['former', false]]) {
    const people = data.monitores.filter(person => person.active === active);
    document.querySelector(`[data-monitors="${selector}"]`).innerHTML = people.length ? people.map(monitorCard).join('') : emptyState(active ? 'Perfis em atualização.' : 'Histórico em construção.', active ? 'Os nomes e perfis dos monitores atuais serão adicionados em breve.' : 'Estamos reunindo os perfis de quem já participou da monitoria.', active ? 'users' : 'award');
    const count = document.querySelector(`[data-monitor-count="${selector}"]`);
    if (count && people.length) {
      count.textContent = people.length;
      count.setAttribute('aria-label', `${people.length} ${people.length === 1 ? 'pessoa' : 'pessoas'}`);
      count.hidden = false;
    }
  }
}

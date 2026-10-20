import { projectCard, emptyState } from '../components/cards.js';
import { setupCollection } from '../components/collection.js';
import { statusLabels } from '../core/schema.js';

export function renderPage(data) {
  setupCollection({
    items: data.projetos, filterKey: 'status', labels: statusLabels, render(items, { selected, query }) {
      document.querySelector('[data-projects]').innerHTML = items.length ? items.map(projectCard).join('') : emptyState(query || selected !== 'todos' ? 'Nenhum repositório com esse filtro.' : 'Nenhum projeto cadastrado.', query || selected !== 'todos' ? 'Tente outra busca ou veja todos os projetos.' : 'Os repositórios da comunidade serão apresentados aqui.', 'code');
    }
  });
}

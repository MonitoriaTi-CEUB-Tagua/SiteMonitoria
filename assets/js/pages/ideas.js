import { ideaCard, emptyState } from '../components/cards.js';
import { setupCollection } from '../components/collection.js';
import { statusLabels } from '../core/schema.js';

export function renderPage(data) {
  setupCollection({
    items: data.propostas, filterKey: 'status', labels: statusLabels, render(items, { selected, query }) {
      document.querySelector('[data-ideas]').innerHTML = items.length ? items.map(ideaCard).join('') : emptyState(query || selected !== 'todos' ? 'Nenhuma proposta com esse filtro.' : 'Nenhuma proposta registrada.', query || selected !== 'todos' ? 'Experimente outro termo ou selecione todas as situações.' : 'As sugestões recebidas e suas atualizações aparecerão aqui.', 'bulb');
    }
  });
}

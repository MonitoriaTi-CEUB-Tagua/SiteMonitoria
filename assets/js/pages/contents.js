import { contentCard, emptyState } from '../components/cards.js';
import { setupCollection } from '../components/collection.js';
import { typeLabels } from '../core/schema.js';

export function renderPage(data) {
  setupCollection({
    items: data.conteudos, filterKey: 'type', labels: typeLabels, render(items, { selected, query }) {
      for (const type of ['oficina', 'projeto']) {
        const section = document.querySelector(`[data-content-group="${type}"]`);
        section.hidden = selected !== 'todos' && selected !== type;
        const filtered = items.filter(item => item.type === type);
        section.querySelector('.card-grid').innerHTML = filtered.length ? filtered.map(contentCard).join('') : emptyState(query ? 'Nenhum conteúdo encontrado.' : type === 'oficina' ? 'Nenhuma oficina publicada.' : 'Nenhum projeto concluído publicado.', query ? 'Tente outro termo ou altere os filtros da busca.' : type === 'oficina' ? 'Os materiais das oficinas realizadas serão reunidos nesta seção.' : 'As entregas e referências dos projetos concluídos serão reunidas aqui.', type === 'oficina' ? 'book' : 'layers');
      }
    }
  });
}

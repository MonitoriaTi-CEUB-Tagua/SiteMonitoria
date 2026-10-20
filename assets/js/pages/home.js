import { statusBadge, emptyState } from '../components/cards.js';
import { escapeHTML as e, safeURL, externalAttrs, formatDate } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { TYPES } from '../core/schema.js';

// Os dados já chegam ordenados do mais recente para o mais antigo.
export function renderPage(data) {
  const featured = data.conteudos.slice(0, 3);
  document.querySelector('[data-home-contents]').innerHTML = featured.length ? featured.map(item => {
    const url = safeURL(item.url) || `conteudos.html?filtro=${item.type}`;
    return `<article class="summary-row"><div><h3><a href="${e(url)}" ${externalAttrs(url)}>${e(item.title)}</a></h3>${item.description ? `<p class="summary-description">${e(item.description)}</p>` : ''}<p>${e(TYPES[item.type]?.label || item.type)}${item.date ? ` · ${e(formatDate(item.date))}` : ''}</p></div>${icon('arrow')}</article>`;
  }).join('') : emptyState('Ainda não há materiais publicados.', 'As oficinas e os projetos concluídos aparecerão aqui.', 'book');
  const ideas = data.propostas.filter(item => !['arquivada', 'concluida'].includes(item.status)).slice(0, 3);
  document.querySelector('[data-home-ideas]').innerHTML = ideas.length ? ideas.map(item => `<article class="summary-row"><div><h3><a href="ideias.html?busca=${e(encodeURIComponent(item.title))}">${e(item.title)}</a></h3>${item.updatedAt ? `<p>Atualizada em ${e(formatDate(item.updatedAt))}</p>` : ''}</div>${statusBadge(item.status)}</article>`).join('') : emptyState('Nenhuma proposta registrada.', 'As sugestões recebidas serão acompanhadas no mural.', 'bulb');
}

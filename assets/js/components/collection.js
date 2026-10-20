import { matchesQuery } from '../core/dom.js';

// Busca e filtros combináveis; o estado fica na URL para poder compartilhar a seleção.
export function setupCollection({ items, filterKey, labels = {}, render }) {
  const input = document.querySelector('[data-search]');
  const select = document.querySelector('[data-select-filter]');
  const chips = [...document.querySelectorAll('[data-filter-value]')];
  const params = new URLSearchParams(location.search);
  const allowed = select ? [...select.options].map(option => option.value) : chips.map(chip => chip.dataset.filterValue);
  let selected = allowed.includes(params.get('filtro')) ? params.get('filtro') : 'todos';
  if (input) input.value = params.get('busca') || '';
  if (select) select.value = selected;
  chips.forEach(chip => { if (labels[chip.dataset.filterValue]) chip.textContent = labels[chip.dataset.filterValue]; });
  select?.querySelectorAll('option').forEach(option => {
    if (labels[option.value]) option.textContent = labels[option.value];
  });
  const draw = (persist = false) => {
    const query = input?.value || '';
    const filtered = items.filter(item => matchesQuery(item, query) && (selected === 'todos' || item[filterKey] === selected));
    chips.forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.filterValue === selected)));
    const count = document.querySelector('[data-result-count]');
    if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}${query ? ` para “${query}”` : ''}`;
    render(filtered, { selected, query });
    if (persist) {
      const url = new URL(location.href);
      query ? url.searchParams.set('busca', query) : url.searchParams.delete('busca');
      selected === 'todos' ? url.searchParams.delete('filtro') : url.searchParams.set('filtro', selected);
      history.replaceState(null, '', url);
    }
  };
  input?.addEventListener('input', () => draw(true));
  select?.addEventListener('change', () => { selected = select.value; draw(true); });
  chips.forEach(chip => chip.addEventListener('click', () => { selected = chip.dataset.filterValue; draw(true); }));
  draw();
}

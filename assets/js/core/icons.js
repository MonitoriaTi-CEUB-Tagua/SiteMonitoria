// Ícones SVG (traço 24×24). Para um novo ícone, acrescente uma chave aqui e use o nome em "icone" nos JSONs.
const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  external: '<path d="M14 4h6v6m0-6L10 14"/><path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
  book: '<path d="M12 5v15m0-15C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z"/>',
  code: '<path d="m7 7-5 5 5 5m10-10 5 5-5 5m-3-14-4 18"/>',
  bulb: '<path d="M9 18h6m-5 3h4M8 14a7 7 0 1 1 8 0c-1 1-1 2-1 2H9s0-1-1-2Z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m0-17a3 3 0 0 1 0 6m3 3a5 5 0 0 1 3 5v3"/>',
  branch: '<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M6 7v10m12-10a8 8 0 0 1-8 8H6"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-4a3.5 3.5 0 0 0-1-3c3 0 6-1.5 6-6a4.7 4.7 0 0 0-1-3c.3-1 .3-2 0-3 0 0-1 0-3 1a11 11 0 0 0-8 0C6 3 5 3 5 3c-.3 1-.3 2 0 3a4.7 4.7 0 0 0-1 3c0 4.5 3 6 6 6a3.5 3.5 0 0 0-1 3v4"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  message: '<path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z"/><path d="M8 10h8m-8 4h5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  folder: '<path d="M3 20h18V6h-9L9 3H3v17Z"/><path d="M3 9h18"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  award: '<circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/>',
  terminal: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m6 9 3 3-3 3m6 0h5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  game: '<path d="M7 7h10c3 0 4 4 5 10 0 3-3 3-5-1H7c-2 4-5 4-5 1 1-6 2-10 5-10Z"/><path d="M6 11v4m-2-2h4m7-1v.01m3 2v.01"/>',
  quote: '<path d="M3 12V6h7v8l-4 5H3l4-7H3Zm11 0V6h7v8l-4 5h-3l4-7h-4Z"/>',
  layers: '<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
};

export function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.folder}</svg>`;
}

export const iconNames = () => Object.keys(paths);

export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(node => {
    node.innerHTML = icon(node.dataset.icon);
    node.replaceWith(node.firstElementChild);
  });
}

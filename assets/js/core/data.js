import { normalizeAll } from './schema.js';

export const SITE_ROOT = new URL('../../../', import.meta.url);
export const DATA_FILES = ['site', 'conteudos', 'propostas', 'projetos', 'monitores'];
const pending = new Map();

export async function readJSON(path) {
  if (!pending.has(path)) {
    pending.set(path, fetch(new URL(path, SITE_ROOT)).then(response => {
      if (!response.ok) throw new Error(`Não foi possível ler ${path}: HTTP ${response.status}`);
      return response.json();
    }));
  }
  return pending.get(path);
}

export async function loadRawData() {
  const values = await Promise.all(DATA_FILES.map(name => readJSON(`data/${name}.json`)));
  return Object.fromEntries(DATA_FILES.map((name, index) => [name, values[index]]));
}

export async function loadData() {
  return normalizeAll(await loadRawData());
}

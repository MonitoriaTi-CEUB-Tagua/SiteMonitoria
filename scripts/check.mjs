// Verifica a estrutura publicável sem instalar dependências ou iniciar um servidor.
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validate } from '../assets/js/core/schema.js';
import { DATA_FILES } from '../assets/js/core/data.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const errors = [];
const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    entry.isDirectory() ? await walk(full) : files.push(full);
  }
}
await walk(root);
for (const file of files) {
  const rel = path.relative(root, file);
  if (/\.(?:js|mjs)$/.test(file)) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) errors.push(`${rel}: ${result.stderr}`);
  }
  if (/\.(?:html|css|svg|js)$/.test(file) && !rel.startsWith('tests')) {
    const text = await readFile(file, 'utf8');
    const references = file.endsWith('.css')
      ? [...text.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => match[1])
      : file.endsWith('.js')
        ? [...text.matchAll(/(?:from\s+|import\()["'](\.[^"']+)["']/g)].map(match => match[1])
        : [...text.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    for (const reference of references) {
      if (/^(?:https?:|mailto:|#|data:)/.test(reference) || reference.includes('${')) continue;
      const base = rel.startsWith('components' + path.sep) ? root : path.dirname(file);
      const local = path.resolve(base, reference.split(/[?#]/)[0]);
      try { await access(local); } catch { errors.push(`${rel}: arquivo não encontrado: ${reference}`); }
    }
    if (file.endsWith('.html') && !rel.startsWith('components')) {
      if ((text.match(/<h1[ >]/g) || []).length !== 1) errors.push(`${rel}: deve ter exatamente um h1`);
      const ids = [...text.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
      if (new Set(ids).size !== ids.length) errors.push(`${rel}: IDs duplicados`);
    }
  }
}
// Dados: a mesma normalização usada pelo site, com mensagens que apontam o item com problema.
const raw = {};
for (const name of DATA_FILES) {
  try { raw[name] = JSON.parse(await readFile(path.join(root, `data/${name}.json`), 'utf8')); }
  catch (error) { errors.push(`data/${name}.json: JSON inválido — ${error.message}. Confira vírgulas, aspas e chaves.`); }
}
if (Object.keys(raw).length === DATA_FILES.length) errors.push(...validate(raw));
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Estrutura válida: ${files.length} arquivos, referências locais e dados verificados.`);

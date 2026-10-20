import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { normalizeAll, toStatus, toType, toDate, toGithubUser, toContactURL, normalizeCredits, validate } from '../assets/js/core/schema.js';

const readRaw = async name => JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8'));

test('dados e includes usam a raiz do projeto, inclusive quando publicado em subpasta', async () => {
  const { SITE_ROOT, readJSON, loadData, DATA_FILES } = await import('../assets/js/core/data.js');
  assert.equal(new URL('data/site.json', new URL('../../../', 'https://example.org/monitoria/assets/js/core/data.js')).href, 'https://example.org/monitoria/data/site.json');
  assert.equal(new URL('components/header.html', SITE_ROOT).pathname.endsWith('/components/header.html'), true);
  const oldFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async url => {
    requests++;
    const content = await readFile(url, 'utf8');
    return { ok: true, json: async () => JSON.parse(content) };
  };
  try {
    const [first, second] = await Promise.all([readJSON('data/site.json'), readJSON('data/site.json')]);
    assert.deepEqual(first, second);
    assert.equal(requests, 1);
    const raw = Object.fromEntries(await Promise.all(DATA_FILES.map(async name => [name, await readRaw(name)])));
    assert.deepEqual(await loadData(), normalizeAll(raw));
  } finally { globalThis.fetch = oldFetch; }
});

test('os dados publicados passam na validação', async () => {
  const raw = Object.fromEntries(await Promise.all(['site', 'conteudos', 'propostas', 'projetos', 'monitores'].map(async name => [name, await readRaw(name)])));
  assert.deepEqual(validate(raw), []);
  const data = normalizeAll(raw);
  assert.ok(data.monitores.some(person => person.active));
  assert.ok(data.monitores.every(person => person.name && person.github.startsWith('https://github.com/')));
});

test('o modelo de cada arquivo é um item válido', async () => {
  const raw = { site: await readRaw('site'), monitores: { atuais: [(await readRaw('monitores'))._modelo], antigos: [] } };
  for (const name of ['conteudos', 'propostas', 'projetos']) raw[name] = { itens: [(await readRaw(name))._modelo] };
  assert.deepEqual(validate(raw), []);
});

test('campos aceitam variações naturais de escrita', () => {
  assert.equal(toStatus('Em andamento'), 'em-andamento');
  assert.equal(toStatus('andamento'), 'em-andamento');
  assert.equal(toStatus('Concluído'), 'concluida');
  assert.equal(toStatus('qualquer'), '');
  assert.equal(toType('Projeto concluído'), 'projeto');
  assert.equal(toType('Oficina'), 'oficina');
  assert.equal(toDate('06/10/2026'), '2026-10-06');
  assert.equal(toDate('2026-02-30'), '');
  assert.equal(toGithubUser('https://github.com/Gustavo-Gomide/'), 'Gustavo-Gomide');
  assert.equal(toGithubUser('@sati-e'), 'sati-e');
  assert.equal(toContactURL('monitor@example.org'), 'mailto:monitor@example.org');
  assert.equal(toContactURL('javascript:alert(1)'), '');
});

test('créditos ligam nomes de monitores ao GitHub', () => {
  const people = [{ id: 'Gustavo-Gomide', name: 'Gustavo Gomide', github: 'https://github.com/Gustavo-Gomide' }];
  assert.deepEqual(normalizeCredits(['gustavo gomide', 'Outra Pessoa', { nome: 'Ana', link: 'https://example.org' }], people), [
    { name: 'Gustavo Gomide', url: 'https://github.com/Gustavo-Gomide' },
    { name: 'Outra Pessoa', url: '' },
    { name: 'Ana', url: 'https://example.org/' },
  ]);
});

test('a validação aponta o item e o campo com problema', () => {
  const errors = validate({
    site: {},
    conteudos: { itens: [{ tipo: 'palestra', titulo: 'X', descricao: 'Y', data: '31/02/2026' }] },
    propostas: { itens: [{ titulo: 'P', descricao: 'D', situacao: 'talvez' }] },
    projetos: { itens: [{ titulo: '', descricao: 'D', situacao: 'Recebida' }] },
    monitores: { atuais: [{ github: 'nome com espaço' }], antigos: [] },
  });
  assert.ok(errors.some(error => error.includes('conteudos.json › item 1 (“X”): "tipo"')));
  assert.ok(errors.some(error => error.includes('"data"')));
  assert.ok(errors.some(error => error.includes('propostas.json') && error.includes('"situacao"')));
  assert.ok(errors.some(error => error.includes('projetos.json') && error.includes('"titulo"')));
  assert.ok(errors.some(error => error.includes('monitores.json › atuais')));
});

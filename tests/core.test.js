import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHTML, safeURL, matchesQuery, formatDate, initials } from '../assets/js/core/dom.js';
import { contentCard, ideaCard, monitorCard, projectCard } from '../assets/js/components/cards.js';

test('busca ignora acentos, maiúsculas e combina termos entre campos', () => {
  const record = { title: 'Introdução à programação', description: 'Aprender em conjunto', tags: ['Python'] };
  assert.equal(matchesQuery(record, 'INTRODUCAO python'), true);
  assert.equal(matchesQuery(record, 'programacao java'), false);
  assert.equal(matchesQuery(record, '  '), true);
});

test('links permitem HTTPS, materiais locais e e-mail explícito, rejeitando esquemas perigosos', () => {
  assert.equal(safeURL('https://github.com/MonitoriaTi-CEUB-Tagua'), 'https://github.com/MonitoriaTi-CEUB-Tagua');
  assert.equal(safeURL('materiais/oficina.pdf'), 'materiais/oficina.pdf');
  for (const url of ['javascript:alert(1)', 'data:text/html,evil', '//other.example', '../segredo', '/caminho-absoluto', 'https://user:secret@example.org']) assert.equal(safeURL(url), '');
  assert.equal(safeURL('mailto:monitor@example.org'), '');
  assert.equal(safeURL('mailto:monitor@example.org', { mail: true }), 'mailto:monitor@example.org');
});

test('conteúdo dos dados é escapado antes de virar HTML', () => {
  assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
  const record = { title: '<img src=x onerror=alert(1)>', name: '<script>evil</script>', description: '<b>text</b>', tags: ['<svg>'], status: 'analise', type: 'oficina', github: 'javascript:evil()', url: 'javascript:evil()', credits: [{ name: '<b>autor</b>', url: 'javascript:evil()' }], contacts: [], update: '<script>evil</script>' };
  for (const render of [contentCard, ideaCard, monitorCard, projectCard]) {
    const html = render(record);
    assert.equal(html.includes('<script>'), false);
    assert.equal(html.includes('<img src=x'), false);
    assert.equal(html.includes('href="javascript:'), false);
  }
});

test('datas e iniciais têm apresentação estável', () => {
  assert.match(formatDate('2026-10-06'), /06.*2026/);
  assert.equal(formatDate('sem-data'), '');
  assert.equal(initials('Ana Souza'), 'AS');
  assert.equal(initials(''), '');
});

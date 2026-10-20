// Converte os JSONs editáveis (em português, tolerantes a variações) no formato usado pela interface.
// A mesma lógica valida os dados em `npm run check`, com mensagens apontando o item com problema.
import { normalize, safeURL } from './dom.js';
import { iconNames } from './icons.js';

export const TYPES = {
  oficina: { label: 'Oficina', icon: 'book' },
  projeto: { label: 'Projeto concluído', icon: 'layers' },
};

export const STATUSES = {
  'recebida': { label: 'Recebida', color: 'gray' },
  'em-analise': { label: 'Em análise', color: 'amber' },
  'planejada': { label: 'Planejada', color: 'blue' },
  'em-andamento': { label: 'Em andamento', color: '' },
  'concluida': { label: 'Concluída', color: 'green' },
  'arquivada': { label: 'Arquivada', color: 'gray' },
};
export const PROJECT_STATUSES = ['planejada', 'em-andamento', 'concluida', 'arquivada'];
export const statusLabels = Object.fromEntries(Object.entries(STATUSES).map(([key, meta]) => [key, meta.label]));
export const typeLabels = Object.fromEntries(Object.entries(TYPES).map(([key, meta]) => [key, meta.label]));

// "Em andamento", "em_andamento" e "andamento" viram "em-andamento".
const STATUS_ALIASES = { analise: 'em-analise', andamento: 'em-andamento', planejado: 'planejada', concluido: 'concluida', arquivado: 'arquivada' };

export const slug = value => normalize(value).trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const text = value => (typeof value === 'string' ? value.trim() : '');
const list = value => (Array.isArray(value) ? value : typeof value === 'string' && value.trim() ? value.split(',') : []).map(item => String(item).trim()).filter(Boolean);
export const items = raw => (Array.isArray(raw) ? raw : Array.isArray(raw?.itens) ? raw.itens : []);

export function toStatus(value) {
  const key = slug(value);
  const resolved = STATUS_ALIASES[key] || key;
  return STATUSES[resolved] ? resolved : '';
}

export function toType(value) {
  const key = slug(value);
  return Object.keys(TYPES).find(type => key === type || key.startsWith(`${type}-`)) || '';
}

// Aceita AAAA-MM-DD ou DD/MM/AAAA; devolve AAAA-MM-DD ou vazio se a data não existir.
export function toDate(value) {
  const raw = text(value);
  const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const iso = br ? `${br[3]}-${br[2]}-${br[1]}` : raw;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const date = new Date(`${iso}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : '';
}

// "usuario", "@usuario" ou "https://github.com/usuario" → "usuario".
export function toGithubUser(value) {
  const raw = text(value).replace(/^@/, '').replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/+$/, '');
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(raw) ? raw : '';
}

// Um e-mail simples vira link mailto:.
export function toContactURL(value) {
  const raw = text(value);
  return safeURL(/^[^\s@/:]+@[^\s@]+\.[^\s@]+$/.test(raw) ? `mailto:${raw}` : raw, { mail: true });
}

const byNewest = key => (a, b) => (b[key] || '').localeCompare(a[key] || '');

export function normalizeSite(raw = {}) {
  const user = toGithubUser(raw.github);
  return { name: text(raw.nome) || 'Monitoria TI', location: text(raw.local), github: user ? `https://github.com/${user}` : safeURL(text(raw.github)) };
}

export function normalizeMonitor(raw, active) {
  const entry = typeof raw === 'string' ? { github: raw } : raw || {};
  const user = toGithubUser(entry.github);
  const github = user ? `https://github.com/${user}` : '';
  const contacts = (Array.isArray(entry.contatos) ? entry.contatos : [])
    .map(contact => ({ label: text(contact?.rotulo) || 'Contato', url: toContactURL(contact?.link) }))
    .filter(contact => contact.url);
  return {
    id: user || slug(entry.nome),
    name: text(entry.nome) || user,
    summary: text(entry.resumo),
    github,
    avatar: safeURL(text(entry.foto)) || (user ? `https://github.com/${user}.png?size=160` : ''),
    active,
    contacts,
  };
}

export function normalizeMonitors(raw = {}) {
  return [
    ...(Array.isArray(raw.atuais) ? raw.atuais : []).map(entry => normalizeMonitor(entry, true)),
    ...(Array.isArray(raw.antigos) ? raw.antigos : []).map(entry => normalizeMonitor(entry, false)),
  ];
}

// Créditos: "Nome", "usuario-do-github" (ligado ao perfil do monitor) ou { "nome", "link" }.
export function normalizeCredits(value, people = []) {
  return (Array.isArray(value) ? value : list(value)).map(entry => {
    if (entry && typeof entry === 'object') {
      const user = toGithubUser(entry.github);
      return { name: text(entry.nome) || user, url: safeURL(text(entry.link)) || (user ? `https://github.com/${user}` : '') };
    }
    const key = slug(entry);
    const person = people.find(p => slug(p.name) === key || slug(p.id) === key);
    return person ? { name: person.name, url: person.github } : { name: text(String(entry)), url: '' };
  }).filter(credit => credit.name);
}

export function normalizeContent(raw, people) {
  const type = toType(raw.tipo);
  return {
    id: text(raw.id) || slug(raw.titulo),
    type,
    title: text(raw.titulo),
    description: text(raw.descricao),
    date: toDate(raw.data),
    tags: list(raw.tags),
    icon: text(raw.icone) || TYPES[type]?.icon || 'book',
    thumb: safeURL(text(raw.imagem)),
    url: safeURL(text(raw.link)),
    credits: normalizeCredits(raw.creditos, people),
  };
}

export function normalizeIdea(raw) {
  return {
    id: text(raw.id) || slug(raw.titulo),
    title: text(raw.titulo),
    description: text(raw.descricao),
    status: toStatus(raw.situacao) || 'recebida',
    tags: list(raw.tags),
    update: text(raw.atualizacao),
    nextStep: text(raw.proximoPasso),
    updatedAt: toDate(raw.atualizadaEm),
  };
}

export function normalizeProject(raw, people) {
  const repository = text(raw.repositorio).replace(/\s*\/\s*/g, '/');
  const derived = /^[\w.-]+\/[\w.-]+$/.test(repository) ? `https://github.com/${repository}` : '';
  return {
    id: text(raw.id) || slug(raw.titulo),
    title: text(raw.titulo),
    description: text(raw.descricao),
    status: toStatus(raw.situacao) || 'em-andamento',
    tags: list(raw.tags),
    icon: text(raw.icone) || 'code',
    repository,
    url: safeURL(text(raw.link)) || derived,
    credits: normalizeCredits(raw.creditos, people),
  };
}

export function normalizeAll(raw) {
  const monitores = normalizeMonitors(raw.monitores);
  return {
    site: normalizeSite(raw.site),
    monitores,
    conteudos: items(raw.conteudos).map(item => normalizeContent(item, monitores)).sort(byNewest('date')),
    propostas: items(raw.propostas).map(normalizeIdea).sort(byNewest('updatedAt')),
    projetos: items(raw.projetos).map(item => normalizeProject(item, monitores)),
  };
}

// Validação amigável usada por scripts/check.mjs.
export function validate(raw) {
  const errors = [];
  const where = (file, index, item) => `${file} › item ${index + 1}${item?.titulo || item?.nome ? ` (“${item.titulo || item.nome}”)` : ''}`;
  const icons = iconNames();
  const checkCommon = (file, item, index) => {
    if (!text(item.titulo)) errors.push(`${where(file, index, item)}: preencha "titulo".`);
    if (!text(item.descricao)) errors.push(`${where(file, index, item)}: preencha "descricao".`);
    if (item.icone && !icons.includes(item.icone)) errors.push(`${where(file, index, item)}: ícone "${item.icone}" não existe. Opções: ${icons.join(', ')}.`);
    if (text(item.link) && !safeURL(text(item.link))) errors.push(`${where(file, index, item)}: "link" inválido.`);
  };
  for (const file of ['conteudos', 'propostas', 'projetos']) {
    if (!Array.isArray(raw[file]) && !Array.isArray(raw[file]?.itens)) errors.push(`${file}.json: deve ter uma lista "itens".`);
  }
  items(raw.conteudos).forEach((item, i) => {
    checkCommon('conteudos.json', item, i);
    if (!toType(item.tipo)) errors.push(`${where('conteudos.json', i, item)}: "tipo" deve ser ${Object.keys(TYPES).map(t => `"${t}"`).join(' ou ')}.`);
    if (item.data && !toDate(item.data)) errors.push(`${where('conteudos.json', i, item)}: "data" deve ser AAAA-MM-DD ou DD/MM/AAAA.`);
    if (text(item.imagem) && !safeURL(text(item.imagem))) errors.push(`${where('conteudos.json', i, item)}: "imagem" inválida.`);
  });
  items(raw.propostas).forEach((item, i) => {
    checkCommon('propostas.json', item, i);
    if (!toStatus(item.situacao)) errors.push(`${where('propostas.json', i, item)}: "situacao" deve ser uma de: ${Object.values(STATUSES).map(s => s.label).join(', ')}.`);
    if (item.atualizadaEm && !toDate(item.atualizadaEm)) errors.push(`${where('propostas.json', i, item)}: "atualizadaEm" deve ser AAAA-MM-DD ou DD/MM/AAAA.`);
  });
  items(raw.projetos).forEach((item, i) => {
    checkCommon('projetos.json', item, i);
    if (!PROJECT_STATUSES.includes(toStatus(item.situacao))) errors.push(`${where('projetos.json', i, item)}: "situacao" deve ser uma de: ${PROJECT_STATUSES.map(s => STATUSES[s].label).join(', ')}.`);
  });
  const monitors = raw.monitores || {};
  if (!Array.isArray(monitors.atuais) || !Array.isArray(monitors.antigos)) errors.push('monitores.json: deve ter as listas "atuais" e "antigos".');
  for (const group of ['atuais', 'antigos']) {
    (Array.isArray(monitors[group]) ? monitors[group] : []).forEach((entry, i) => {
      const item = typeof entry === 'string' ? { github: entry } : entry || {};
      const label = `monitores.json › ${group} › item ${i + 1}${item.nome || item.github ? ` (“${item.nome || item.github}”)` : ''}`;
      if (!text(item.nome) && !toGithubUser(item.github)) errors.push(`${label}: preencha "nome" ou "github".`);
      if (text(item.github) && !toGithubUser(item.github)) errors.push(`${label}: "github" deve ser só o nome de usuário.`);
      (Array.isArray(item.contatos) ? item.contatos : []).forEach((contact, j) => {
        if (!toContactURL(contact?.link)) errors.push(`${label}: contato ${j + 1} tem "link" inválido.`);
      });
    });
  }
  return errors;
}

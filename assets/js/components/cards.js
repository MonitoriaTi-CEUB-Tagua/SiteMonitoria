import { escapeHTML as e, safeURL, externalAttrs, formatDate, initials } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { STATUSES, TYPES } from '../core/schema.js';

export function statusBadge(status) {
  const meta = STATUSES[status] || STATUSES.recebida;
  return `<span class="badge badge-dot ${meta.color ? `badge--${meta.color}` : ''}">${e(meta.label)}</span>`;
}

function tags(items = []) {
  return items.length ? `<ul class="tag-list" aria-label="Assuntos">${items.map(tag => `<li class="tag">${e(tag)}</li>`).join('')}</ul>` : '';
}

function credits(items = []) {
  if (!items.length) return '';
  return `<p class="credits">Contribuições de ${items.map(author => {
    const url = safeURL(author.url);
    return url ? `<a href="${e(url)}" ${externalAttrs(url)}>${e(author.name)}</a>` : e(author.name);
  }).join(', ')}</p>`;
}

function resourceLink(url, label) {
  const href = safeURL(url);
  return href ? `<a class="text-link" href="${e(href)}" ${externalAttrs(href)}>${e(label)}${icon('external')}</a>` : '<span class="muted">Material em preparação</span>';
}

export function contentCard(item) {
  const thumb = safeURL(item.thumb);
  return `<article class="card content-card">${thumb ? `<img class="content-thumb" src="${e(thumb)}" alt="" loading="lazy" decoding="async">` : ''}<div class="card-body"><div class="content-card-top"><span class="icon-box">${icon(item.icon || 'book')}</span><span class="badge">${e(TYPES[item.type]?.label || item.type)}</span></div><h3>${e(item.title)}</h3><p>${e(item.description)}</p>${tags(item.tags)}${credits(item.credits)}<div class="card-footer">${resourceLink(item.url, 'Ver conteúdo')}<small>${e(formatDate(item.date))}</small></div></div></article>`;
}

export function ideaCard(item) {
  return `<article class="card idea-card"><div class="card-body"><div class="idea-meta">${statusBadge(item.status)}${icon('bulb')}</div><h3>${e(item.title)}</h3><p>${e(item.description)}</p>${tags(item.tags)}${item.update ? `<details><summary>Ver acompanhamento</summary><p>${e(item.update)}</p>${item.nextStep ? `<p><strong>Próximo passo:</strong> ${e(item.nextStep)}</p>` : ''}</details>` : ''}<div class="card-footer"><small>${item.updatedAt ? `Atualizada em ${e(formatDate(item.updatedAt))}` : 'Acompanhamento pela monitoria'}</small></div></div></article>`;
}

export function projectCard(item) {
  return `<article class="card repo-card"><div class="card-body"><div class="repo-heading"><span class="icon-box">${icon(item.icon || 'code')}</span>${statusBadge(item.status)}</div>${item.repository ? `<span class="repo-slug">${e(item.repository)}</span>` : ''}<h3>${e(item.title)}</h3><p>${e(item.description)}</p>${tags(item.tags)}${credits(item.credits)}<div class="card-footer">${resourceLink(item.url, 'Ver repositório')}${icon('github')}</div></div></article>`;
}

export function monitorCard(monitor) {
  const avatar = safeURL(monitor.avatar);
  const github = safeURL(monitor.github);
  return `<article class="card monitor-card">${avatar ? `<img class="avatar" src="${e(avatar)}" alt="" data-initials="${e(initials(monitor.name))}" width="64" height="64" loading="lazy" decoding="async">` : `<span class="avatar" aria-hidden="true">${e(initials(monitor.name))}</span>`}<h3>${e(monitor.name)}</h3>${monitor.summary ? `<p>${e(monitor.summary)}</p>` : ''}${github ? `<a class="text-link" href="${e(github)}" ${externalAttrs(github)}>${icon('github')}Perfil no GitHub${icon('external')}</a>` : ''}</article>`;
}

export function emptyState(title, description, name = 'folder', participate = false) {
  return `<div class="empty-state"><span class="icon-box">${icon(name)}</span><div><h3>${e(title)}</h3><p>${e(description)}</p>${participate ? `<button class="btn btn--outline btn--small" type="button" data-participate>Como participar ${icon('arrow')}</button>` : ''}</div></div>`;
}

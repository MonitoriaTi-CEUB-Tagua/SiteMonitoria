export const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

// Rejeita esquemas executáveis e endereços relativos que saiam da pasta do site.
export function safeURL(value, { mail = false } = {}) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const candidate = value.trim();
  if (/^https?:\/\/[^\s]+$/i.test(candidate)) {
    try { const url = new URL(candidate); return url.username || url.password ? '' : url.href; } catch { return ''; }
  }
  if (mail && /^mailto:[^\s@]+@[^\s@]+$/i.test(candidate)) return candidate;
  if (/^[a-zA-Z0-9_./-]+(?:[?#][^\s]*)?$/.test(candidate) && !candidate.startsWith('/') && !candidate.split(/[/?#]/).includes('..')) return candidate;
  return '';
}

export function normalize(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function matchesQuery(item, query) {
  const haystack = normalize([item.title, item.description, item.name, item.summary, item.topic, ...(item.tags || [])].join(' '));
  return normalize(query).split(/\s+/).filter(Boolean).every(word => haystack.includes(word));
}

export function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return '';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date);
}

export function initials(name) {
  return String(name).trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}

export function externalAttrs(url) {
  return /^https?:\/\//i.test(url) ? 'target="_blank" rel="noopener noreferrer"' : '';
}

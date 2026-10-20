import { SITE_ROOT } from './data.js';

// Includes limitados aos arquivos locais confiáveis em components/.
export async function loadIncludes() {
  await Promise.all([...document.querySelectorAll('[data-include]')].map(async host => {
    const name = host.dataset.include;
    if (!/^[a-z-]+\.html$/.test(name)) throw new Error('Componente inválido.');
    const response = await fetch(new URL(`components/${name}`, SITE_ROOT));
    if (!response.ok) throw new Error(`Falha ao carregar o componente ${name}.`);
    host.innerHTML = await response.text();
  }));
}

# Monitoria TI — CEUB Taguatinga

Site extraoficial da monitoria de TI do CEUB, campus Taguatinga.

O projeto é um site estático feito com HTML, CSS e JavaScript. Os conteúdos ficam nos arquivos JSON da pasta `data/`.

## Abrir no VS Code

1. Abra esta pasta no VS Code.
2. Abra `index.html` com a extensão **Live Server**.
3. O site será aberto no navegador.

Não abra o arquivo diretamente pelo explorador de arquivos: o site precisa de um servidor local para carregar os componentes e os arquivos JSON.

## Publicar no GitHub Pages

1. Envie o conteúdo desta pasta para um repositório do GitHub.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch publicada e a pasta `/(root)`.
5. Salve e aguarde o GitHub Pages gerar o endereço do site.

O arquivo `.nojekyll` já está incluído no projeto.

## Dados do site

Todo o conteúdo fica em `data/`. Cada arquivo traz um `_modelo` pronto: copie, cole dentro de `"itens"` e preencha. Depois rode `npm run check` para conferir.

- `conteudos.json`: oficinas realizadas e projetos concluídos.
- `propostas.json`: ideias e propostas em acompanhamento.
- `projetos.json`: projetos e repositórios.
- `monitores.json`: monitores atuais e antigos (basta o usuário do GitHub: foto e link são automáticos).
- `site.json`: nome, localização e GitHub da comunidade.

O guia detalhado de inserção, edição e remoção de dados está em [data/crud.md](data/crud.md). A manutenção geral do site está em [docs/MANUTENCAO.md](docs/MANUTENCAO.md).

## Páginas

- `index.html`: início.
- `conteudos.html`: conteúdos.
- `ideias.html`: propostas.
- `projetos.html`: projetos.
- `monitores.html`: monitores.

O botão **Participe** aparece nas páginas e mostra os contatos públicos dos monitores ativos.

## Visual

- As cores ficam centralizadas em `assets/css/tokens.css`. O botão do cabeçalho alterna entre tema claro e escuro e lembra a escolha; sem escolha, o site segue o sistema.
- `base.css` traz reset e tipografia, `components.css` traz os componentes compartilhados e `pages.css` os estilos de cada página. As quatro folhas são carregadas em paralelo em cada HTML.

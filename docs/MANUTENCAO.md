# Guia de manutenção

Todo o conteúdo do site fica em `data/`. Não é preciso mexer em HTML ou JavaScript para adicionar itens. O guia detalhado, campo a campo, está em [`data/crud.md`](../data/crud.md).

## Como adicionar qualquer item

Cada arquivo de `data/` tem o mesmo formato:

```json
{
  "_ajuda": "Explicação do arquivo.",
  "_campos": { "campo": "o que ele aceita" },
  "_modelo": { "um item de exemplo, pronto para copiar": "" },
  "itens": [ ... ]
}
```

1. Copie o bloco `_modelo` (das chaves `{` até `}`).
2. Cole dentro de `"itens": [ ... ]`. Separe os itens com vírgula e não deixe vírgula depois do último.
3. Troque os valores de exemplo.
4. Rode `npm run check`. Se algo estiver errado, a mensagem aponta o arquivo, o item e o campo, por exemplo:

```text
conteudos.json › item 2 (“Oficina de SQL”): "tipo" deve ser "oficina" ou "projeto".
```

As chaves que começam com `_` são só instruções; o site as ignora.

### Regras gerais

- **Datas:** `2026-10-20` ou `20/10/2026`.
- **Situação:** escreva como aparece no site (`"Em andamento"`, `"Concluída"`). Variações como `"andamento"` ou `"Concluído"` também funcionam.
- **Tags:** escreva exatamente como devem aparecer: `["Python", "Banco de dados"]`.
- **Textos** são exibidos como texto puro; HTML não é interpretado.
- **Links:** `https://...` ou caminho dentro do site (`materiais/aula.pdf`). E-mails são aceitos em contatos de monitores.
- **Campos opcionais** podem ficar `""` ou `[]`.
- **Ordem:** conteúdos e propostas são ordenados automaticamente pela data mais recente. Projetos e monitores aparecem na ordem do arquivo.

## Conteúdos — `data/conteudos.json`

Oficinas já realizadas e projetos concluídos.

```json
{
  "tipo": "oficina",
  "titulo": "Introdução ao Git",
  "descricao": "Materiais e exercícios da oficina.",
  "data": "2026-10-20",
  "tags": ["Git", "Colaboração"],
  "link": "materiais/oficina-git.pdf",
  "imagem": "",
  "icone": "branch",
  "creditos": ["Gustavo Gomide", { "nome": "Convidada", "link": "https://github.com/usuario" }]
}
```

- `tipo`: `oficina` ou `projeto`.
- `link` vazio mostra “Material em preparação”.
- `creditos`: nome de um monitor cadastrado vira link para o GitHub dele automaticamente. Para outra pessoa com link, use `{ "nome": "...", "link": "..." }`.
- `icone` é opcional (padrão: livro para oficinas, camadas para projetos).

Oficinas futuras pertencem ao mural de propostas. Para um PDF próprio, crie a pasta `materiais/`, envie o arquivo e use o caminho relativo.

## Ideias e propostas — `data/propostas.json`

```json
{
  "titulo": "Oficina de Git",
  "descricao": "Resumo da sugestão.",
  "situacao": "Em análise",
  "tags": ["Git"],
  "atualizacao": "Estamos avaliando a disponibilidade dos monitores.",
  "proximoPasso": "Definir o roteiro.",
  "atualizadaEm": "2026-10-20"
}
```

| `situacao` | Quando usar |
| --- | --- |
| Recebida | A sugestão foi registrada. |
| Em análise | Os monitores avaliam interesse e recursos. |
| Planejada | A proposta está sendo organizada. |
| Em andamento | A iniciativa está sendo desenvolvida. |
| Concluída | Resultou em uma atividade ou entrega. |
| Arquivada | Não seguirá neste momento. |

“Ver acompanhamento” aparece quando `atualizacao` está preenchido. A página inicial destaca até três propostas em aberto, das mais recentes para as mais antigas. Atualize `atualizadaEm` sempre que houver novidade.

## Projetos — `data/projetos.json`

```json
{
  "titulo": "Nome do projeto",
  "descricao": "O que o projeto faz.",
  "situacao": "Em andamento",
  "repositorio": "MonitoriaTi-CEUB-Tagua/nome-do-repositorio",
  "link": "",
  "tags": ["HTML", "CSS"],
  "icone": "code",
  "creditos": []
}
```

- `situacao`: Planejada, Em andamento, Concluída ou Arquivada.
- Com `link` vazio, o botão aponta para `https://github.com/<repositorio>`.

## Monitores — `data/monitores.json`

```json
{
  "atuais": [
    {
      "nome": "Nome Sobrenome",
      "github": "usuario",
      "resumo": "Monitor de TI no campus Taguatinga.",
      "foto": "",
      "contatos": [{ "rotulo": "E-mail", "link": "monitor@exemplo.com" }]
    }
  ],
  "antigos": ["usuario-antigo", "outro-usuario"]
}
```

- `github`: só o nome de usuário. A foto e o link do perfil são gerados a partir dele.
- `foto`: opcional, substitui a foto do GitHub (ex.: `assets/images/nome.jpg`).
- `contatos`: canais extras exibidos na janela **Participe**. O GitHub de cada monitor atual já aparece lá automaticamente.
- **Saída da monitoria:** mova o registro de `atuais` para `antigos`. Em `antigos` basta o usuário do GitHub entre aspas, mas o formato completo também funciona.

## Dados gerais — `data/site.json`

`nome`, `local` e `github` (usuário ou organização) da comunidade.

## Ícones

Disponíveis para o campo `icone`: `book`, `code`, `branch`, `terminal`, `database`, `game`, `layers`, `bulb`, `users`, `award`, `folder`, `info`, `heart`, `message`, `clock`, `check`, `quote`.

Para criar um ícone, acrescente uma chave em `assets/js/core/icons.js` com o conteúdo SVG (traço, área 24×24). No HTML, use `<span data-icon="book"></span>`.

## Tema claro e escuro

O botão ☀/☾ do cabeçalho alterna o tema e guarda a escolha no navegador do visitante. Sem escolha salva, o site segue o tema do sistema. As cores dos dois temas ficam em `assets/css/tokens.css`: o claro em `:root` e o escuro em `:root[data-theme="dark"]`.

## Componentes HTML

`assets/js/core/includes.js` carrega os arquivos de `components/` nos elementos com `data-include`:

```html
<div data-include="header.html"></div>
```

Ao alterar `components/header.html`, todas as páginas mudam juntas.

## Nova página

1. Copie uma página existente na raiz (mantenha o script de tema do `<head>`, os CSS e `assets/js/app.js`).
2. Ajuste título, descrição, `h1` e o `data-page` do `body`.
3. Crie um módulo em `assets/js/pages/` exportando `renderPage(data)` e registre-o em `pages` no `app.js`.
4. Acrescente o link em `components/header.html` com `data-page-link` igual ao `data-page`.

## Como funciona por dentro

`assets/js/core/schema.js` converte os JSONs em português para o formato usado pelos cards (resolvendo apelidos de situação, datas, usuários do GitHub e créditos) e valida os dados. A mesma validação é usada por `npm run check`.

## Problemas comuns

| Sintoma | Conferir |
| --- | --- |
| Página sem menu e sem cards | Abra por um servidor (Live Server), não por `file://`. |
| “Não foi possível carregar parte da página” | Rode `npm run check`: normalmente é vírgula sobrando/faltando no JSON. |
| Item não aparece | Confira se ele está dentro de `"itens"` (e não dentro de `_modelo`). |
| Monitor sem foto | Confira o usuário em `github`; sem foto, o site mostra as iniciais. |
| Mudança não aparece logo após publicar | O GitHub Pages guarda arquivos em cache por cerca de 10 minutos; aguarde e atualize com Ctrl+F5. |

# CRUD dos dados do site

Guia para quem vai manter o site no futuro. Explica como **criar, consultar, editar e remover** itens de cada tela, editando apenas os arquivos desta pasta (`data/`). Não é preciso saber HTML, CSS ou JavaScript.

> **Resumo de 30 segundos:** abra o arquivo da tela, copie o bloco `_modelo`, cole dentro de `"itens"`, troque os valores, rode `npm run check` e publique.

---

## Sumário

1. [Qual arquivo alimenta qual tela](#1-qual-arquivo-alimenta-qual-tela)
2. [Anatomia de um arquivo](#2-anatomia-de-um-arquivo)
3. [JSON em 2 minutos](#3-json-em-2-minutos)
4. [Regras que valem para todos os arquivos](#4-regras-que-valem-para-todos-os-arquivos)
5. [Conteúdos](#5-conteúdos--conteudosjson)
6. [Propostas](#6-propostas--propostasjson)
7. [Projetos](#7-projetos--projetosjson)
8. [Monitores](#8-monitores--monitoresjson)
9. [Dados gerais](#9-dados-gerais--sitejson)
10. [Conferindo antes de publicar](#10-conferindo-antes-de-publicar)
11. [Publicando](#11-publicando)
12. [Erros comuns e como resolver](#12-erros-comuns-e-como-resolver)
13. [Como funciona por dentro](#13-como-funciona-por-dentro)

---

## 1. Qual arquivo alimenta qual tela

| Arquivo | Onde aparece no site |
| --- | --- |
| `conteudos.json` | Página **Conteúdos** e bloco “Conteúdos recentes” da página inicial (os 3 mais recentes). |
| `propostas.json` | Página **Ideias e propostas** e bloco “Últimas propostas” da página inicial (as 3 mais recentes que não estão concluídas nem arquivadas). |
| `projetos.json` | Página **Projetos**. |
| `monitores.json` | Página **Monitores** e janela **Participe** (só os monitores atuais). |
| `site.json` | Links do GitHub da comunidade no cabeçalho, no rodapé e na janela Participe. |

Este arquivo (`crud.md`) é só documentação; o site não o lê.

---

## 2. Anatomia de um arquivo

`conteudos.json`, `propostas.json` e `projetos.json` seguem esta estrutura:

```json
{
  "_ajuda": "Explicação curta do arquivo.",
  "_campos": {
    "titulo": "o que este campo aceita"
  },
  "_modelo": {
    "titulo": "Exemplo pronto para copiar"
  },
  "itens": [
    { "titulo": "Item real 1" },
    { "titulo": "Item real 2" }
  ]
}
```

| Chave | Para que serve | O site exibe? |
| --- | --- | --- |
| `_ajuda` | Instrução rápida. | Não |
| `_campos` | Lista de campos e valores aceitos. | Não |
| `_modelo` | Um item de exemplo completo, para copiar. | Não |
| `itens` | **Os itens de verdade.** Só o que está aqui aparece no site. | Sim |

Tudo que começa com `_` é ignorado pelo site; essas chaves existem só para orientar quem edita. **Não apague** `_modelo`: o teste automático confere se ele continua válido, e ele é o atalho para o próximo cadastro.

`monitores.json` é igual, mas no lugar de `itens` tem **duas listas**: `atuais` e `antigos`. `site.json` é um objeto simples, sem lista.

---

## 3. JSON em 2 minutos

JSON é rígido: um caractere fora do lugar quebra o arquivo inteiro e a tela fica sem dados. As regras:

```json
{
  "texto": "sempre entre aspas duplas",
  "lista": ["item 1", "item 2"],
  "objeto": { "chave": "valor" },
  "vazio": "",
  "lista vazia": []
}
```

- Chaves e textos usam **aspas duplas** `"`, nunca aspas simples `'` nem aspas “curvas” copiadas do Word/WhatsApp.
- Itens de uma lista são separados por **vírgula**.
- **Não pode haver vírgula depois do último item** de uma lista ou objeto.
- Para usar aspas dentro de um texto, escape com barra: `"descricao": "Oficina \"mão na massa\""`.
- Comentários (`//` ou `/* */`) **não são permitidos**. Use os campos `_ajuda`/`_campos` para anotações.
- Acentos e emojis podem ser usados normalmente (os arquivos são UTF-8).

O erro mais comum, a vírgula no lugar errado:

```json
"itens": [
  { "titulo": "A" },
  { "titulo": "B" },   ← ERRADO: vírgula depois do último
]
```

```json
"itens": [
  { "titulo": "A" },   ← vírgula separando
  { "titulo": "B" }    ← último, sem vírgula
]
```

---

## 4. Regras que valem para todos os arquivos

### Campos obrigatórios e opcionais

Os campos obrigatórios estão indicados em cada seção. Os opcionais podem ficar vazios (`""` para texto, `[]` para lista) ou ser omitidos. Recomendação: **mantenha todos os campos do modelo**, mesmo vazios, para o próximo editor ver o que está disponível.

### Datas

Os dois formatos funcionam:

| Você escreve | O site entende |
| --- | --- |
| `"2026-10-20"` | 20 de out. de 2026 |
| `"20/10/2026"` | 20 de out. de 2026 |

Datas impossíveis (`31/02/2026`) são rejeitadas pelo `npm run check`.

### Situação (status)

Escreva como aparece no site. Maiúsculas, acentos e algumas variações são tolerados:

| Valor final | Também aceita |
| --- | --- |
| `Recebida` | `recebida` |
| `Em análise` | `em analise`, `analise` |
| `Planejada` | `planejado` |
| `Em andamento` | `em-andamento`, `andamento` |
| `Concluída` | `concluido`, `Concluído` |
| `Arquivada` | `arquivado` |

### Tags

Lista de textos, escritos **exatamente como devem aparecer** no card:

```json
"tags": ["Python", "Banco de dados", "SQL"]
```

Também funciona como texto separado por vírgulas: `"tags": "Python, SQL"`. Não há lista fixa de tags; qualquer valor é aceito. A busca das páginas também procura nas tags, então prefira nomes consistentes (sempre `"JavaScript"`, nunca às vezes `"JS"`).

### Links e imagens

| Aceito | Exemplo |
| --- | --- |
| Endereço completo | `"https://github.com/MonitoriaTi-CEUB-Tagua"` |
| Arquivo dentro do site | `"materiais/oficina-git.pdf"`, `"assets/images/capa.jpg"` |
| E-mail (só em contatos de monitores) | `"monitor@exemplo.com"` |

| Rejeitado | Motivo |
| --- | --- |
| `"/materiais/a.pdf"` | Começar com `/` quebra o site quando publicado em subpasta no GitHub Pages. |
| `"../segredo.txt"` | Não pode sair da pasta do site. |
| `"javascript:..."`, `"data:..."` | Bloqueado por segurança. |
| `"https://usuario:senha@site.com"` | Credenciais no link são bloqueadas. |

Um link rejeitado não aparece no site, e o `npm run check` avisa.

Para hospedar um arquivo próprio (PDF, imagem), coloque-o numa pasta do projeto (sugestão: `materiais/` para documentos e `assets/images/` para imagens) e use o caminho relativo. Links do Google Drive, slides publicados etc. também servem; confira se o acesso está liberado para qualquer pessoa com o link.

### Textos

Todo texto é exibido **como texto puro**. Tags HTML como `<b>` aparecem literalmente; não há negrito, quebra de linha ou link dentro de descrições. Escreva descrições curtas (1 a 3 frases): os cards ficam mais legíveis.

### Ícones

O campo `icone` aceita um destes nomes:

| Nome | Sugestão de uso |
| --- | --- |
| `book` | Material, leitura, oficina teórica |
| `code` | Programação, repositório |
| `branch` | Git, versionamento |
| `terminal` | Linha de comando, sistemas, redes |
| `database` | Banco de dados, SQL |
| `game` | Jogos |
| `layers` | Projeto completo, arquitetura |
| `bulb` | Ideia, criatividade |
| `users` | Grupo de estudo, colaboração |
| `award` | Conquista, certificado |
| `folder` | Arquivos diversos |
| `info`, `heart`, `message`, `clock`, `check`, `quote` | Outros usos |

Um nome inexistente é apontado pelo `npm run check`. Para criar um ícone novo, veja a seção [Como funciona por dentro](#13-como-funciona-por-dentro).

### Créditos (`creditos`)

Usados em conteúdos e projetos para dar crédito a quem contribuiu. Cada item da lista pode ser:

```json
"creditos": [
  "Gustavo Gomide",
  "VictorRMRibeiro",
  "Pessoa Convidada",
  { "nome": "Ana Souza", "link": "https://linkedin.com/in/ana" },
  { "nome": "Bruno", "github": "brunodev" }
]
```

| Forma | Resultado |
| --- | --- |
| Nome ou usuário de um monitor cadastrado em `monitores.json` | Vira link para o GitHub do monitor automaticamente. Maiúsculas e acentos não importam. |
| Nome de outra pessoa | Aparece só o nome, sem link. |
| `{ "nome", "link" }` | Nome com o link informado. |
| `{ "nome", "github" }` | Nome com link para `https://github.com/<github>`. |

O card mostra “Contribuições de Gustavo Gomide, Ana Souza…”. Lista vazia (`[]`) não mostra nada.

### Ordem dos itens

| Arquivo | Ordem no site |
| --- | --- |
| `conteudos.json` | Automática, pelo campo `data`, do mais recente para o mais antigo. Sem data vai para o fim. |
| `propostas.json` | Automática, pelo campo `atualizadaEm`, do mais recente para o mais antigo. |
| `projetos.json` | A mesma ordem do arquivo. Coloque os mais importantes primeiro. |
| `monitores.json` | A mesma ordem do arquivo, em cada lista. |

### Identificador (`id`)

Opcional em todos os arquivos. Se omitido, é gerado a partir do título. Não é exibido no site; só use se quiser uma referência estável para algum controle externo.

---

## 5. Conteúdos — `conteudos.json`

Acervo de **oficinas já realizadas** e **projetos concluídos**. Oficinas futuras não entram aqui: elas são propostas (seção 6) até acontecerem.

### Campos

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `tipo` | **Sim** | `"oficina"` ou `"projeto"`. Define em qual seção da página o card aparece e o filtro correspondente. |
| `titulo` | **Sim** | Título do card. |
| `descricao` | **Sim** | Resumo curto. |
| `data` | Não | Quando a oficina aconteceu ou o projeto foi entregue. Define a ordem e os destaques da página inicial. |
| `tags` | Não | Assuntos. |
| `link` | Não | Material, slides, pasta ou repositório. Vazio mostra “Material em preparação”. |
| `imagem` | Não | Capa do card (proporção 16:9 fica melhor). Vazio não mostra capa. |
| `icone` | Não | Ícone do card. Padrão: `book` para oficina, `layers` para projeto. |
| `creditos` | Não | Quem contribuiu. |

### Criar

Cole um novo objeto dentro de `"itens"` (em qualquer posição, porque a ordem é pela data):

```json
"itens": [
  {
    "tipo": "oficina",
    "titulo": "Introdução ao Git",
    "descricao": "Conceitos de versionamento, commits e branches com exercícios práticos.",
    "data": "20/10/2026",
    "tags": ["Git", "Colaboração"],
    "link": "materiais/oficina-git.pdf",
    "imagem": "",
    "icone": "branch",
    "creditos": ["Gustavo Gomide"]
  },
  {
    "tipo": "projeto",
    "titulo": "Site da Monitoria TI CEUB Taguatinga",
    "...": "item que já existia"
  }
]
```

### Consultar

Abra o arquivo e procure pelo título (Ctrl+F). No site, a busca da página Conteúdos procura em título, descrição e tags.

### Editar

Altere só o valor desejado, mantendo as aspas. Exemplo: o material ficou pronto depois da oficina:

```json
"link": "https://docs.google.com/presentation/d/.../pub"
```

### Remover

Apague o objeto inteiro, de `{` até `}`, e ajuste as vírgulas (seção 3). Prefira manter o histórico: só remova conteúdo publicado por engano ou cujo material não pode mais ser compartilhado.

---

## 6. Propostas — `propostas.json`

Mural de **sugestões recebidas** pelos monitores e o andamento de cada uma. O site não recebe sugestões sozinho: alguém conversa com os monitores (contatos da janela Participe) e um monitor registra a proposta aqui.

### Campos

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | **Sim** | Nome da proposta. |
| `descricao` | **Sim** | O que foi sugerido e por quê. |
| `situacao` | **Sim** | `Recebida`, `Em análise`, `Planejada`, `Em andamento`, `Concluída` ou `Arquivada`. |
| `tags` | Não | Assuntos. |
| `atualizacao` | Não | O que está sendo considerado agora. Quando preenchido, o card ganha o botão “Ver acompanhamento”. |
| `proximoPasso` | Não | Próxima ação prevista (aparece dentro do acompanhamento). |
| `atualizadaEm` | Não (recomendado) | Data da última novidade. Define a ordem e os destaques da página inicial. |

### Ciclo de vida de uma proposta

Os estados **não** precisam seguir uma ordem fixa; uma proposta pode ser arquivada e retomada depois. Um caminho típico:

```text
Recebida → Em análise → Planejada → Em andamento → Concluída
                 ↘ Arquivada (com explicação em "atualizacao")
```

### Criar

```json
{
  "titulo": "Grupo de estudo de Python",
  "descricao": "Encontros semanais para resolver exercícios de lógica em Python.",
  "situacao": "Recebida",
  "tags": ["Python", "Lógica"],
  "atualizacao": "",
  "proximoPasso": "",
  "atualizadaEm": "20/10/2026"
}
```

### Editar (atualizar o andamento)

A cada novidade, mude `situacao`, explique em `atualizacao` e **atualize a data**:

```json
{
  "titulo": "Grupo de estudo de Python",
  "descricao": "Encontros semanais para resolver exercícios de lógica em Python.",
  "situacao": "Em análise",
  "tags": ["Python", "Lógica"],
  "atualizacao": "Estamos verificando horários livres dos monitores e salas disponíveis.",
  "proximoPasso": "Abrir uma enquete de horários com os interessados.",
  "atualizadaEm": "27/10/2026"
}
```

Quando a proposta vira uma oficina realizada, marque `"Concluída"` aqui **e** cadastre o material em `conteudos.json` (seção 5).

### Remover

**Prefira `"situacao": "Arquivada"`** com uma explicação em `atualizacao`, em vez de apagar: quem sugeriu continua vendo o que aconteceu. Apague o objeto só se ele foi cadastrado por engano ou contém informação que não deveria estar pública.

---

## 7. Projetos — `projetos.json`

Repositórios da comunidade, com o que fazem e como colaborar.

### Campos

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `titulo` | **Sim** | Nome do projeto. |
| `descricao` | **Sim** | O que o projeto faz e por que existe. |
| `situacao` | **Sim** | Apenas `Planejada`, `Em andamento`, `Concluída` ou `Arquivada` (não use `Recebida`/`Em análise`; ideias ainda não iniciadas ficam em propostas). |
| `repositorio` | Não | `dono/nome` do repositório no GitHub, exibido no card. Ex.: `"MonitoriaTi-CEUB-Tagua/site-monitoria-ceub"`. |
| `link` | Não | Destino do botão “Ver repositório”. Se vazio, é gerado a partir de `repositorio` (`https://github.com/dono/nome`). |
| `tags` | Não | Tecnologias usadas. |
| `icone` | Não | Padrão: `code`. |
| `creditos` | Não | Quem contribuiu. |

### Criar

Como a ordem é a do arquivo, coloque o projeto na posição desejada:

```json
{
  "titulo": "Bot de dúvidas da monitoria",
  "descricao": "Bot para Discord que responde dúvidas frequentes e indica materiais do acervo.",
  "situacao": "Planejada",
  "repositorio": "MonitoriaTi-CEUB-Tagua/bot-duvidas",
  "link": "",
  "tags": ["Python", "Discord"],
  "icone": "terminal",
  "creditos": ["VictorRMRibeiro"]
}
```

Confira se o repositório existe e é público antes de publicar; senão o botão leva a uma página 404 do GitHub.

### Editar e remover

Mude `situacao` conforme o projeto avança. Projetos abandonados ficam melhor como `"Arquivada"` do que apagados. Quando o projeto for concluído e tiver uma entrega para mostrar, cadastre também em `conteudos.json` com `"tipo": "projeto"`.

---

## 8. Monitores — `monitores.json`

Estrutura diferente dos demais: duas listas.

```json
{
  "_ajuda": "...",
  "_campos": { "...": "..." },
  "_modelo": { "...": "..." },
  "atuais": [ ...monitores em atividade... ],
  "antigos": [ ...quem já passou pela monitoria... ]
}
```

### Campos

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `nome` | Um dos dois | Nome público. Se vazio, usa o usuário do GitHub. |
| `github` | Um dos dois | **Só o usuário** (`"Gustavo-Gomide"`). Também aceita `"@usuario"` ou o link completo do perfil. Gera automaticamente a foto e o link do perfil. |
| `resumo` | Não | Apresentação curta (aparece no card de monitor atual). |
| `foto` | Não | Substitui a foto do GitHub. Ex.: `"assets/images/gustavo.jpg"`. |
| `contatos` | Não | Canais extras exibidos na janela **Participe**. |

Sem foto (sem `github` e sem `foto`, ou se a imagem falhar), o site mostra as iniciais do nome.

### Contatos

```json
"contatos": [
  { "rotulo": "E-mail", "link": "monitor@exemplo.com" },
  { "rotulo": "LinkedIn", "link": "https://linkedin.com/in/usuario" },
  { "rotulo": "Discord da turma", "link": "https://discord.gg/convite" }
]
```

- `rotulo`: texto do link na janela.
- `link`: endereço `https://` ou e-mail puro (vira `mailto:` sozinho).
- O **GitHub de cada monitor atual já aparece na janela Participe automaticamente**; não precisa repetir em `contatos`.
- Só publique contatos que a própria pessoa autorizou.

### Criar um monitor atual

```json
"atuais": [
  {
    "nome": "Gustavo Gomide",
    "github": "Gustavo-Gomide",
    "resumo": "...",
    "foto": "",
    "contatos": []
  },
  {
    "nome": "Maria Silva",
    "github": "mariasilva",
    "resumo": "Monitora de TI, interessada em banco de dados e web.",
    "foto": "",
    "contatos": [
      { "rotulo": "E-mail", "link": "maria@exemplo.com" }
    ]
  }
]
```

### Criar um monitor antigo

Em `antigos`, basta o usuário do GitHub entre aspas:

```json
"antigos": [
  "brureads",
  "Elizafc",
  "novo-ex-monitor"
]
```

O formato completo (com `nome`, `resumo` etc.) também funciona em `antigos`, se quiser mostrar o nome real em vez do usuário:

```json
"antigos": [
  "brureads",
  { "nome": "Eliza Ferreira", "github": "Elizafc" }
]
```

### Editar: quando alguém sai da monitoria

**Não apague a pessoa.** Recorte o registro de `atuais` e cole em `antigos`. Ao sair de `atuais`, os contatos dela deixam de aparecer na janela Participe, e o reconhecimento continua na página Monitores. Os créditos em conteúdos e projetos não são afetados.

### Remover

Só remova alguém que pediu para sair do site ou que foi cadastrado por engano.

---

## 9. Dados gerais — `site.json`

```json
{
  "nome": "Monitoria TI",
  "local": "CEUB Taguatinga · Brasília/DF",
  "github": "MonitoriaTi-CEUB-Tagua"
}
```

| Campo | Descrição |
| --- | --- |
| `nome` | Nome da comunidade. |
| `local` | Campus e cidade. |
| `github` | Usuário ou organização da comunidade no GitHub (ou o link completo). Atualiza todos os links “GitHub” do site. |

Não há lista nem `_modelo`: apenas edite os valores.

---

## 10. Conferindo antes de publicar

### Verificação automática (recomendada)

Com o [Node.js](https://nodejs.org) instalado, na pasta raiz do projeto:

```bash
npm run check
```

Se estiver tudo certo:

```text
Estrutura válida: 42 arquivos, referências locais e dados verificados.   (o número varia)
```

Se houver problema, cada linha diz **arquivo › item › campo** e o que fazer:

```text
conteudos.json › item 2 (“Oficina de SQL”): preencha "descricao".
conteudos.json › item 2 (“Oficina de SQL”): "tipo" deve ser "oficina" ou "projeto".
conteudos.json › item 2 (“Oficina de SQL”): "data" deve ser AAAA-MM-DD ou DD/MM/AAAA.
propostas.json › item 1 (“Grupo de Python”): "situacao" deve ser uma de: Recebida, Em análise, ...
monitores.json › atuais › item 3 (“maria silva”): "github" deve ser só o nome de usuário.
data/projetos.json: JSON inválido — Unexpected token ] ... Confira vírgulas, aspas e chaves.
```

“Item 2” é o segundo objeto dentro de `itens` (contando de 1).

Para rodar também os testes automáticos:

```bash
npm test
```

### Verificação visual

1. Abra a pasta no VS Code e inicie o site com a extensão **Live Server** (veja o README).
2. Confira a tela que você alterou e a página inicial.
3. Se o navegador mostrar dados antigos, atualize com **Ctrl+F5**.

### Sem Node instalado

Cole o conteúdo do arquivo num validador de JSON (por exemplo, a extensão de JSON do próprio VS Code, que sublinha erros em vermelho) para pegar erros de sintaxe. As regras de campos (tipo, situação, datas) só são conferidas pelo `npm run check`; revise-as com atenção usando as tabelas acima.

---

## 11. Publicando

O site é publicado pelo GitHub Pages a partir do repositório.

**Pelo navegador (sem instalar nada):**
1. No GitHub, abra o arquivo em `data/` e clique no ícone de lápis (**Edit this file**).
2. Faça a alteração, descreva o que mudou (ex.: “Adiciona oficina de Git”) e clique em **Commit changes**.
3. Aguarde 1 a 2 minutos para o Pages publicar.

**Pelo computador:**

```bash
git add data/
git commit -m "Adiciona oficina de Git"
git push
```

Depois de publicar, o GitHub Pages pode servir a versão anterior por **até ~10 minutos** (cache). Se a mudança não aparecer, aguarde e atualize com Ctrl+F5.

Boa prática: um commit por alteração lógica (“Adiciona proposta X”, “Move Fulano para antigos”) facilita desfazer algo depois pelo histórico do GitHub.

---

## 12. Erros comuns e como resolver

| Sintoma | Causa provável | Solução |
| --- | --- | --- |
| A tela inteira mostra “Não foi possível carregar parte da página” | JSON inválido (vírgula, aspas, chave faltando) em algum arquivo de `data/`. | Rode `npm run check`; ele indica o arquivo. Confira a seção 3. |
| Item novo não aparece | Foi colado dentro de `_modelo` ou fora de `itens`. | Mova para dentro de `"itens": [ ... ]`. |
| Item aparece no lugar “errado” | Conteúdos e propostas são ordenados por data. | Confira `data` / `atualizadaEm`. |
| Conteúdo na seção errada | `tipo` trocado. | `oficina` ou `projeto`. |
| Botão “Material em preparação” em vez do link | `link` vazio ou rejeitado. | Veja “Links e imagens” na seção 4. |
| Monitor sem foto (só iniciais) | Usuário do GitHub escrito errado, ou a foto local não existe. | Confira `github` (respeitando o usuário real) ou o caminho de `foto`. |
| Monitor não aparece na janela Participe | Está em `antigos`. | Só `atuais` aparecem lá. |
| Crédito sem link | O nome não corresponde a nenhum monitor. | Use o nome/usuário igual ao de `monitores.json` ou `{ "nome", "link" }`. |
| Texto com `\"` aparecendo | Barra a mais. | Use `\"` só para aspas dentro de texto. |
| Aspas “curvas” quebram o arquivo | Texto copiado do Word/WhatsApp. | Troque por aspas retas `"`. |
| Mudança publicada não aparece | Cache do GitHub Pages / navegador. | Aguarde ~10 min e use Ctrl+F5. |

---

## 13. Como funciona por dentro

Para quem precisar alterar o comportamento (não é necessário para cadastrar dados):

```text
data/*.json  ──►  assets/js/core/data.js     (baixa os arquivos)
             ──►  assets/js/core/schema.js   (converte e valida)
             ──►  assets/js/pages/*.js       (monta cada tela)
             ──►  assets/js/components/cards.js (HTML dos cards)
```

- **`schema.js`** é o ponto central. Ele transforma os campos em português (`titulo`, `situacao`, `atualizadaEm`…) no formato interno usado pelos cards, resolve apelidos de situação, converte datas `DD/MM/AAAA`, gera links e fotos do GitHub e liga créditos aos monitores. A função `validate` desse arquivo é a mesma usada pelo `npm run check`, então o site e a verificação nunca discordam.
- **Nova situação ou novo tipo de conteúdo:** edite `STATUSES` ou `TYPES` em `schema.js`. Um tipo novo também precisa de uma seção em `conteudos.html` e de um ajuste em `assets/js/pages/contents.js`. Atualize este guia e os `_campos` dos JSONs.
- **Novo campo num item:** leia o campo na função `normalize...` correspondente em `schema.js` e exiba em `cards.js`. Acrescente o campo ao `_modelo` e ao `_campos` do JSON e documente aqui.
- **Novo ícone:** acrescente uma chave em `assets/js/core/icons.js` com o desenho SVG (traço, área 24×24). O nome fica disponível no campo `icone` e na validação.
- **Segurança:** todo texto passa por `escapeHTML` e todo link por `safeURL` (em `assets/js/core/dom.js`) antes de virar HTML. Não remova essas chamadas ao alterar os cards; os testes em `tests/` verificam isso.

Ao mudar o formato de algum arquivo, atualize junto: o `_modelo`/`_campos` do JSON, este `crud.md`, `docs/MANUTENCAO.md` e os testes em `tests/data.test.js`.

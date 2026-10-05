# Fios da Gi

Site oficial da **Fios da Gi**, marca de crochê artesanal criada por **Giovana Arnhold**: peças feitas à mão, com carinho em cada detalhe.

Feito com HTML, CSS e JavaScript puros: sem frameworks, sem etapa de build e sem dependências para instalar.

## Estrutura

```text
fios da gi/
├── index.html   estrutura e textos do site
├── style.css    cores, fontes, layout, animações e responsividade
├── script.js    menu, animações ao rolar, janela de detalhes, carrossel e contatos
├── README.md
└── img/         imagens da marca
```

## Como abrir

Dê dois cliques no `index.html` para abrir no navegador.

As fontes vêm do Google Fonts, então é preciso estar conectado à internet para vê-las. Sem conexão, o site usa as fontes do sistema.

Para testar como se estivesse publicado (opcional), rode na pasta do projeto:

```bash
python -m http.server 5500
```

Depois abra `http://localhost:5500` no navegador.

## Seções

| Seção | Âncora | Conteúdo |
|---|---|---|
| Início | `#inicio` | Nome da marca, frase de apresentação e botão para os produtos |
| Sobre | `#sobre` | A marca e a fundadora, Giovana Arnhold |
| Produtos | `#produtos` | Galeria com janela de detalhes ("Saiba mais"); no celular vira um carrossel |
| Diferenciais | — | Feito à mão, feito com carinho, peças especiais e criatividade |
| Destaque | — | "Cada ponto conta uma história." |
| Contato | `#contato` | Botões de WhatsApp e Instagram |
| Rodapé | — | Navegação, redes, fundadora e direitos reservados |

## Como editar

### WhatsApp e Instagram

Os dados ficam no início do `script.js`:

```js
const CONTATO = {
  whatsapp: '555180538243',
  mensagemWhatsapp: 'Olá, Gi! Vim pelo site da Fios da Gi e gostaria de saber mais sobre as peças.',
  instagram: 'fiosdagii_',
};
```

- `whatsapp`: código do país + DDD + número, só os dígitos. Se ficar vazio, os botões de WhatsApp mostram um aviso indicando o Instagram.
- `mensagemWhatsapp`: texto que já aparece escrito quando a pessoa abre a conversa.
- `instagram`: nome de usuário, sem o `@`.

Todos os links de WhatsApp e Instagram do site (seção Contato, rodapé e menu do celular) são atualizados a partir daqui. Os links escritos no `index.html` servem apenas de reserva, caso o JavaScript não carregue.

### Produtos

Cada item da galeria é um `<li class="produto">` dentro de `<ul class="produtos__lista">`, no `index.html`:

- `img`: imagem, texto alternativo (`alt`) e tamanho original (`width` e `height`);
- `.produto__numero`: número exibido no canto da imagem;
- `.produto__nome` e `.produto__descricao`: nome e descrição curta;
- `<template class="produto__detalhes">`: texto completo mostrado em "Saiba mais".

Em imagens de fundo claro, use também a classe `produto--claro`: assim o tracejado que aparece ao passar o mouse fica rosa em vez de branco. O contador da janela de detalhes e os pontinhos do carrossel se ajustam sozinhos à quantidade de itens.

### Imagens

| Arquivo | Onde aparece |
|---|---|
| `logo redonda.jpg` | Início e galeria; também é o ícone ao salvar o site na tela inicial do celular |
| `logo principal.jpg` | Sobre e galeria |
| `etiqueta frente.jpg` | Galeria |
| `etiqueta verso.jpg` | Galeria; as instruções de cuidado estão transcritas em "Saiba mais" |
| `logo rodapé.jpg` | Rodapé |

Como os nomes têm espaço e acento, no HTML eles aparecem codificados: espaço vira `%20` e `é` vira `%C3%A9` (por exemplo, `./img/logo%20rodap%C3%A9.jpg`). Se renomear algum arquivo, atualize os caminhos.

O fundo do rodapé usa `#dab5de`, o mesmo lilás do fundo de `logo rodapé.jpg`, para a imagem se fundir ao rodapé.

### Cores

As variáveis ficam no `:root` do `style.css`:

| Variável | Cor | Uso |
|---|---|---|
| `--rosa` | `#ff85a1` | Botões e destaques |
| `--pessego` | `#ffe2d1` | Fundos |
| `--lilas` | `#d9b5dd` | Detalhes e seções |
| `--branco` | `#ffffff` | Equilíbrio |

Há também tons de apoio derivados da paleta (`--rosa-texto`, `--rosa-titulo`, `--ameixa` e outros) para os textos terem bom contraste.

### Fontes

- **Fraunces**: títulos.
- **DM Sans**: textos.
- **Gaegu**: detalhes escritos à mão, no estilo do "crochet collection." do logo.

**Atenção:** a Gaegu não tem acentos. Use-a apenas em frases curtas sem acentuação, como "crochet collection.", "ponto a ponto" e "esperamos sua mensagem". Ela é usada nas classes `marca__fios`, `hero__selo`, `hero__nota`, `nota-mao`, `produtos__dica`, `assinatura__saudacao`, `carimbo__texto`, `destaque__assinatura`, `contato__nota` e `menu__frase`.

## Recursos

- Layout responsivo para celular, tablet, notebook e desktop, com menu hambúrguer em telas de até 860 px.
- Animações suaves ao rolar a página, desligadas automaticamente para quem prefere menos movimento (`prefers-reduced-motion`).
- Janela de detalhes que funciona pelo teclado: setas para trocar de item e `Esc` para fechar.
- Imagens fora da tela carregam só quando necessário (`loading="lazy"`).
- Ano do rodapé atualizado automaticamente.

## Créditos

- Ícone de coração baseado no [Feather Icons](https://feathericons.com) (licença MIT).
- Ícone do WhatsApp baseado no [Tabler Icons](https://tabler.io/icons) (licença MIT).
- Fontes [Fraunces](https://fonts.google.com/specimen/Fraunces), [DM Sans](https://fonts.google.com/specimen/DM+Sans) e [Gaegu](https://fonts.google.com/specimen/Gaegu), do Google Fonts (SIL Open Font License).
- Imagens: identidade visual da Fios da Gi.

© 2026 Fios da Gi — Todos os direitos reservados.

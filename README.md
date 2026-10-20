# Portfólio · Seu Nome

Site pessoal feito com **HTML, CSS e JavaScript puros**, sem frameworks. A ideia é dominar a base antes de migrar para React/Next.js.

## Estrutura

```
portfolio/
├── index.html              # Estrutura da página (o "esqueleto")
├── assets/
│   ├── css/style.css       # Visual: cores, layout, responsivo
│   ├── js/main.js          # Comportamento: menu do celular, menu ativo
│   ├── img/                # Foto (WebP) e favicon
│   ├── fonts/              # Fonte hospedada no próprio site
│   └── cv/                 # Coloque aqui o curriculo.pdf
├── vercel.json             # Cabeçalhos de segurança e cache (deploy na Vercel)
├── robots.txt              # Orientação para buscadores
└── .devcontainer/          # Configuração automática do GitHub Codespaces
```

## Rodando no Codespaces

1. Abra o repositório no GitHub → **Code** → **Codespaces** → **Create codespace on main**.
2. Espere o ambiente carregar (as extensões instalam sozinhas).
3. Clique com o botão direito no `index.html` → **Open with Live Server**.
4. O site abre numa aba de prévia. Cada vez que você salvar um arquivo, ele recarrega sozinho.

## Personalizando

- **Cores:** todas estão no topo do `style.css`, em `:root` (os "design tokens").
- **Textos:** procure por `Seu Nome`, `seu-usuario` e `[Sua descrição...]` no `index.html`.
- **Currículo:** salve como `assets/cv/curriculo.pdf` (sem CPF, RG ou endereço).

## Segurança aplicada

- Sem scripts ou estilos inline, e nenhum recurso de terceiros, o que permite uma **CSP** bem restritiva (`default-src 'self'`).
- Cabeçalhos **HSTS**, **X-Frame-Options** (anti-clickjacking), **nosniff** e **Permissions-Policy** em `vercel.json`.
- Links externos com `rel="noopener noreferrer"`.
- Fonte hospedada localmente: o visitante não tem o IP enviado ao Google (ponto positivo para a LGPD).
- `.gitignore` bloqueia arquivos `.env` (segredos nunca vão para o GitHub).

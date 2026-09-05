<!-- LTeX: language=pt-BR -->
# Site do casamento — Pedro & Erin

Site estático (HTML/CSS/JS puro, sem build) com seletor de idioma PT/EN e formulário de RSVP.

## Estrutura

```
wedding-site/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 1. Configurar o RSVP (Formspree)

O formulário está apontando para um endpoint fake do Formspree. Para receber as respostas de verdade:

1. Crie uma conta grátis em https://formspree.io
2. Crie um novo formulário (o plano free permite até 50 envios/mês — dá para aumentar se precisar)
3. Copie o "Form ID" que eles te derem (algo como `xdkoqwzr`)
4. No `index.html`, troque a linha:
   ```html
   <form id="rsvp-form" class="rsvp-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
   pelo seu ID real: `action="https://formspree.io/f/xdkoqwzr"`
5. Pronto — as respostas caem no painel do Formspree e também chegam por e-mail.

Alternativa: se preferirem algo ainda mais simples (mas menos elegante), dá pra trocar por um Google Forms embedado como iframe. Me avisem se quiserem essa versão.

## 2. Publicar o site (grátis) — GitHub Pages

Como vocês já usam Git no dia a dia, esse é o caminho mais direto:

1. Criem um repositório novo no GitHub (ex: `pedro-erin-wedding`). Pode ser público — não tem nada sensível nos arquivos além do que vocês mesmos colocarem (cuidado ao publicar a chave PIX real).
2. Subam os 4 arquivos (`index.html`, `style.css`, `script.js`, `README.md`) pra branch `main`:
   ```bash
   git init
   git add .
   git commit -m "Site do casamento — versão inicial"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/pedro-erin-wedding.git
   git push -u origin main
   ```
3. No repositório, vão em **Settings → Pages**
4. Em "Build and deployment" → **Source**, escolham **Deploy from a branch**
5. Em "Branch", selecionem `main` e a pasta `/ (root)` — salvem
6. Em 1-2 minutos o site fica no ar em `https://SEU_USUARIO.github.io/pedro-erin-wedding`

Depois disso, qualquer `git push` na branch `main` atualiza o site automaticamente — o deploy contínuo já vem de graça, sem precisar configurar nada além disso.

## 3. Domínio .com.br

1. Registrem o domínio em https://registro.br (é o registro oficial, ~R$40/ano)
2. No repositório GitHub: **Settings → Pages → Custom domain**, digitem o domínio (ex: `casamento.com.br`) e salvem — isso cria automaticamente um arquivo `CNAME` na raiz do repo
3. No registro.br, em **Editar Zona DNS**, criem os seguintes registros:
   - 4 registros do tipo **A** apontando o domínio raiz para os IPs do GitHub Pages:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Se quiserem usar `www.casamento.com.br` também, criem um registro **CNAME** apontando `www` para `SEU_USUARIO.github.io`
4. Volta em **Settings → Pages** do repositório e marquem **Enforce HTTPS** (pode levar algumas horas para a opção ficar disponível, até o certificado ser emitido)
5. A propagação de DNS costuma levar de alguns minutos a algumas horas.

## 4. Antes de publicar, troquem os placeholders

Busquem por `[` no `index.html` e no `script.js` (dicionário `translations`) para achar tudo que ainda é texto de exemplo:
- História do casal
- Local e endereço da cerimônia/recepção
- Dress code
- Chave PIX
- Respostas do FAQ

## 5. Rodando localmente para testar

Não precisa de nada instalado — só abram o `index.html` direto no navegador. Se quiserem um servidor local (por exemplo para testar em outro celular na mesma rede), com Python instalado:

```bash
cd wedding-site
python3 -m http.server 8000
```

E acessem `http://localhost:8000`.
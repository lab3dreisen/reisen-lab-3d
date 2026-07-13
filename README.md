# REISEN LAB 3D — Site

Site estático (HTML/CSS/JS puro, sem build) para a loja REISEN LAB 3D, com
cadastro/login de clientes e checkout via Supabase. Pronto para publicar
gratuitamente no **GitHub Pages**.

## Por que GitHub Pages (e não Netlify)

Os dois são gratuitos, mas para este projeto o GitHub Pages é suficiente e
mais simples: o site é 100% estático (HTML/CSS/JS) e toda a "parte de
servidor" — cadastro, login e pedidos — é feita pelo Supabase, não por
funções do próprio host. O Netlify teria vantagens (functions, variáveis de
ambiente, redirects) que este projeto não precisa agora. Se no futuro vocês
quiserem rodar lógica de servidor fora do Supabase, aí sim vale migrar para
Netlify — mas hoje isso não é necessário e o GitHub Pages já resolve sem
custo.

## Estrutura do projeto

```
index.html              Página inicial
loja.html                Catálogo com filtro por categoria
produto.html             Detalhe do produto (?id=)
carrinho.html             Carrinho (localStorage)
checkout.html             Formulário de pedido
pedido-confirmado.html    Confirmação pós-pedido
login.html / cadastro.html  Autenticação de clientes
conta.html                Área do cliente + histórico de pedidos
admin.html                Painel administrativo (produtos + pedidos) — só para admins
sobre.html / contato.html  Páginas institucionais
css/style.css              Design system (cores, tipografia, componentes)
js/config.js                Chaves do Supabase e dados de contato (EDITAR AQUI)
js/products.js               Catálogo placeholder + carregamento do catálogo real do Supabase
js/admin.js                  Lógica do painel administrativo
js/cart.js, auth.js, checkout.js, account.js, main.js   Lógica do site
assets/logo.svg              Ícone recriado a partir da identidade visual
supabase/schema.sql           Script para criar as tabelas no Supabase (produtos, pedidos, admins)
supabase/edge-functions/create-infinitepay-link/index.ts   Gera o link de pagamento InfinitePay
supabase/edge-functions/infinitepay-webhook/index.ts        Confirma o pagamento e marca o pedido como pago
```

## Passo a passo — publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex.: `reisen-lab-3d`).
2. Envie todos os arquivos desta pasta para a raiz do repositório.
3. No repositório, vá em **Settings > Pages**.
4. Em "Source", selecione a branch `main` e a pasta `/root`. Salve.
5. Em alguns minutos o site estará em `https://SEU-USUARIO.github.io/reisen-lab-3d/`.
6. (Opcional) Configure um domínio próprio em Settings > Pages > Custom domain.

Enquanto não configurar o Supabase (próximo passo), o site já funciona em
**modo demonstração**: navegação, carrinho, cadastro/login e checkout
funcionam localmente no navegador (sem gravar em nenhum banco real), então
dá pra revisar o site inteiro antes de ligar o backend.

## Passo a passo — configurar o Supabase

1. Crie uma conta e um projeto em [supabase.com](https://supabase.com) (grátis).
2. Vá em **SQL Editor > New query**, cole o conteúdo de `supabase/schema.sql`
   e clique em "Run". Isso cria as tabelas `profiles`, `products`, `orders`
   e `order_items`, já com as permissões (RLS) e alguns produtos de exemplo.
3. Vá em **Authentication > Providers** e confirme que "Email" está ativo
   (é o padrão).
4. Vá em **Settings > API** e copie:
   - `Project URL`
   - `anon public key`
5. Abra `js/config.js` e substitua:
   ```js
   SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
   SUPABASE_ANON_KEY: "SUA-ANON-KEY-AQUI",
   ```
   pelos valores copiados. Aproveite e ajuste também `WHATSAPP_NUMBER` e
   `CONTACT_EMAIL`.
6. Suba essa alteração para o GitHub (ou edite direto pelo GitHub). A partir
   daí o site sai do "modo demonstração": cadastro e login passam a criar
   usuários reais, e os pedidos do checkout são gravados na tabela `orders`.

Depois disso, os produtos reais são gerenciados direto pelo **painel
administrativo** (`admin.html`) — ver seção abaixo. O site busca o catálogo
da tabela `products` do Supabase automaticamente assim que ele estiver
configurado (fora do modo demonstração); antes disso, continua mostrando os
produtos placeholder de `js/products.js`.

## Painel administrativo (admin.html)

Depois que o Supabase estiver configurado (passo anterior), qualquer pessoa
pode se cadastrar pelo site normalmente, mas só quem for marcado como
**admin** consegue entrar em `admin.html`. Por lá dá para:

- Cadastrar, editar, ativar/desativar e excluir produtos (nome, categoria,
  preço, preço promocional, estoque, foto, descrição).
- Enviar a foto do produto arrastando o arquivo direto para o painel (ou
  clicando para escolher) — não precisa acesso à pasta do projeto nem ao
  GitHub. A foto é enviada para o Supabase Storage (bucket `produtos`) e a
  URL pública é salva automaticamente no produto.
- Ver todos os pedidos, filtrar por status e atualizar o status de cada um
  (aguardando pagamento → pago → enviado → entregue, ou cancelado).

Se o Supabase já foi configurado antes desse recurso existir, rode uma vez
no **SQL Editor** o bloco `STORAGE` de `supabase/schema.sql` (cria o bucket
`produtos` e as permissões de upload) — rodar o arquivo inteiro de novo dá
erro porque as outras políticas já existem.

Para tornar uma conta admin:

1. Crie a conta normalmente pelo site em `cadastro.html`.
2. No Supabase, vá em **SQL Editor > New query** e rode (trocando pelo seu e-mail):
   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'seu-email@exemplo.com');
   ```
3. Faça login de novo (ou atualize a página) e acesse `admin.html` — o link
   não aparece no menu do site de propósito (só quem tem o endereço acessa),
   então guarde essa URL: `https://SEU-USUARIO.github.io/reisen-lab-3d/admin.html`.

Repita o passo 2 para cada pessoa que precisar de acesso de editor.

## Pagamento: InfinitePay (Pix, crédito e débito automáticos)

O checkout já está com a cobrança automática pronta no código. O que falta é
só configuração do lado da InfinitePay e do Supabase — nenhum arquivo
precisa mudar depois disso. Como funciona: o cliente confirma o pedido, o
site gera um link de pagamento da InfinitePay (Pix, crédito em até 12x ou
débito, conforme o que sua conta InfinitePay tiver habilitado) e redireciona
o cliente pra lá. Quando ele paga, a InfinitePay chama um webhook que marca
o pedido como `pago` automaticamente no banco.

### 1. Habilitar o Checkout Integrado na InfinitePay

1. Abra o app InfinitePay (ou [acesse pela web](https://app.infinitepay.io/external-checkout)).
2. Vá em **Vendas > Checkout > Configurações**.
3. Toque em **Habilitar Checkout Integrado**.
4. Anote sua **InfiniteTag** (o `@handle` que aparece no topo do app/site,
   sem o `$` do início) — é só isso que a integração precisa, não tem chave
   secreta de API para essa parte.

### 2. Publicar as duas Edge Functions no Supabase

Direto pelo painel, sem precisar instalar nada:

1. No Supabase, vá em **Edge Functions > Create a new function**.
2. Nome: `create-infinitepay-link`. Cole o conteúdo de
   `supabase/edge-functions/create-infinitepay-link/index.ts` e clique em
   **Deploy**.
3. Nas configurações dessa função (aba de **Secrets**/variáveis), defina:
   - `INFINITEPAY_HANDLE` — sua InfiniteTag, sem `$` (ex.: `reisenlab3d`)
   - `SUPABASE_URL` — a URL do seu projeto (Settings > API)
   - `SUPABASE_SERVICE_ROLE_KEY` — a chave **service_role** (Settings > API —
     essa é diferente da anon key; fica só aqui, nunca no `js/config.js`)
   - `SITE_URL` — `https://SEU-USUARIO.github.io/reisen-lab-3d`
4. Crie outra função, nome: `infinitepay-webhook`. Cole o conteúdo de
   `supabase/edge-functions/infinitepay-webhook/index.ts` e clique em
   **Deploy**. Ela pode usar as mesmas secrets `SUPABASE_URL` e
   `SUPABASE_SERVICE_ROLE_KEY` do passo anterior.

### 3. Pronto

Não precisa editar `js/checkout.js` nem `js/config.js` — já está tudo
plugado: ao confirmar o pedido, o site chama `create-infinitepay-link`,
redireciona para a tela de pagamento da InfinitePay e, após o pagamento, o
`infinitepay-webhook` atualiza o pedido para `pago` automaticamente (isso
aparece tanto na tela de confirmação do cliente quanto no painel `admin.html`).

Se o pedido ficar parado em `aguardando_pagamento` por muito tempo, o
cliente pode ter fechado a tela de pagamento antes de concluir — nesse caso,
combine manualmente pelo WhatsApp ou peça pra ele tentar de novo pelo
checkout.

Documentação oficial: https://ajuda.infinitepay.io/pt-BR/articles/10766888

## Sobre a logo

A logo real (a arte que vocês enviaram) está em `assets/logo.png`, já com o
fundo removido/transparente — usada no cabeçalho e rodapé de todas as
páginas. `assets/favicon.png` é a mesma arte recortada em formato quadrado
para o ícone da aba do navegador. O arquivo `assets/logo.svg` (recriação
simplificada) ficou no projeto sem uso, apenas como referência — pode
apagar se quiser.

Se um dia trocarem a arte da logo, é só substituir `assets/logo.png` (e
`assets/favicon.png`, se quiserem atualizar o ícone da aba) por um arquivo
novo com o mesmo nome — não precisa mexer no HTML/CSS.

## Checklist rápido antes de divulgar

- [ ] Rodar `supabase/schema.sql` no projeto Supabase
- [ ] Preencher `js/config.js` com URL/anon key reais
- [ ] Criar sua conta pelo site e marcar como admin (ver seção do painel administrativo)
- [ ] Cadastrar os produtos reais pelo `admin.html`
- [ ] Trocar `assets/logo.svg` pela arte final da marca
- [ ] Testar cadastro, login, carrinho e checkout com o Supabase já configurado
- [ ] Publicar no GitHub Pages e testar o link público
- [ ] Habilitar o Checkout Integrado no app InfinitePay e pegar sua InfiniteTag
- [ ] Publicar as Edge Functions `create-infinitepay-link` e `infinitepay-webhook` no Supabase (ver seção de pagamento)
- [ ] Fazer um pedido de teste de ponta a ponta (pagar de verdade com valor baixo) para confirmar que o status vira "pago" sozinho

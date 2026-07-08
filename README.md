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
sobre.html / contato.html  Páginas institucionais
css/style.css              Design system (cores, tipografia, componentes)
js/config.js                Chaves do Supabase e dados de contato (EDITAR AQUI)
js/products.js               Catálogo placeholder + helpers de card/preço
js/cart.js, auth.js, checkout.js, account.js, main.js   Lógica do site
assets/logo.svg              Ícone recriado a partir da identidade visual
supabase/schema.sql           Script para criar as tabelas no Supabase
supabase/edge-functions/create-infinitepay-link/index.ts   Esqueleto p/ InfinitePay (próximo passo)
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

Depois disso, quer trocar os produtos placeholder pelos reais? Duas opções:
- Mais simples: edite o array em `js/products.js`.
- Mais robusto: edite/insira linhas na tabela `products` do Supabase e adapte
  as funções no fim de `js/products.js` (já tem um exemplo comentado) para
  buscar de lá em vez do array local.

## Pagamento: onde está a InfinitePay hoje

Como combinado, por enquanto o checkout só monta a **estrutura**: o cliente
preenche endereço e dados, escolhe "InfinitePay" (já indicado como "em
breve" na tela) e o pedido é salvo com status `aguardando_pagamento`. Não há
cobrança automática ainda.

Por que InfinitePay: Pix gratuito pra sempre, cartão em até 12x, integração
é uma simples chamada POST (sem SDK obrigatório) que devolve um link de
pagamento pronto, e webhook avisa quando o cliente pagou.

Quando quiserem ativar o pagamento de verdade:

1. Crie uma conta grátis na InfinitePay em https://www.infinitepay.io/checkout
   e peça a credencial/handle de integração (Checkout Integrado).
2. Implemente e publique a Edge Function `supabase/edge-functions/create-infinitepay-link`
   (o arquivo já está com o esqueleto comentado, incluindo os passos e o
   trecho de código que chama a API de links de pagamento da InfinitePay).
3. No `js/checkout.js`, no lugar do comentário `// TODO (próximo passo)`,
   chame essa função passando o `orderId` e redirecione o cliente para a
   URL de pagamento (`url`) que ela devolver.
4. Crie também uma função de webhook (`infinitepay-webhook`) para a
   InfinitePay avisar quando o pagamento for aprovado, e nela atualizar
   `orders.status` para `pago` (usando o `order_nsu` para casar com o pedido).

Isso é intencionalmente deixado como próximo passo, já que ainda não há
conta InfinitePay criada — a estrutura de banco e checkout já está pronta
para receber essa integração sem precisar redesenhar nada. Documentação
oficial: https://www.infinitepay.io/checkout-documentacao

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
- [ ] Trocar produtos placeholder pelos produtos reais
- [ ] Trocar `assets/logo.svg` pela arte final da marca
- [ ] Testar cadastro, login, carrinho e checkout com o Supabase já configurado
- [ ] Publicar no GitHub Pages e testar o link público
- [ ] Quando tiver a conta InfinitePay criada, implementar a Edge Function de pagamento

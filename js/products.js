/* ==========================================================================
   REISEN LAB 3D — Design System
   Paleta baseada na identidade visual: preto/azul-marinho profundo,
   ciano neon, prata/cromado metálico.
   ========================================================================== */

:root{
  --bg: #04060b;
  --bg-alt: #070b14;
  --surface: #0d1220;
  --surface-2: #121a2c;
  --surface-3: #182238;
  --border: #1e2941;
  --border-bright: #2c3f63;

  --cyan: #22e1ff;
  --cyan-2: #5ef2ff;
  --cyan-dim: #0ea5c4;
  --blue: #2f6fff;
  --blue-dim: #1c3f8f;

  --silver: #cbd5e1;
  --silver-bright: #f4f7fb;
  --silver-dim: #7c8aa3;

  --text: #e7ecf5;
  --text-dim: #93a0b7;
  --text-mute: #5d6a82;

  --danger: #ff4d6d;
  --success: #2dd4bf;
  --warning: #ffb020;

  --radius-sm: 6px;
  --radius: 12px;
  --radius-lg: 20px;

  --font-display: 'Exo 2', sans-serif;
  --font-body: 'Rajdhani', 'Inter', sans-serif;

  --shadow-glow: 0 0 24px rgba(34, 225, 255, .18);
  --shadow-card: 0 10px 30px rgba(0,0,0,.45);
}

*, *::before, *::after{ box-sizing: border-box; }
html{ scroll-behavior: smooth; }
body{
  margin:0;
  background: radial-gradient(ellipse at top, #0a0f1c 0%, #04060b 55%, #030409 100%) fixed;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
img{ max-width:100%; display:block; }
a{ color: inherit; text-decoration:none; }
ul{ margin:0; padding:0; list-style:none; }
button{ font-family: inherit; cursor:pointer; }
input, select, textarea{ font-family: inherit; }

h1,h2,h3,h4{
  font-family: var(--font-display);
  letter-spacing: .02em;
  margin: 0 0 .5em;
  color: var(--silver-bright);
}
h1{ font-size: clamp(2rem, 4vw, 3.2rem); line-height:1.1; }
h2{ font-size: clamp(1.5rem, 3vw, 2.2rem); }
h3{ font-size: 1.2rem; }
p{ margin:0 0 1em; color: var(--text-dim); }

.container{
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Background circuit texture */
.circuit-bg{
  position: fixed;
  inset:0;
  z-index:-1;
  opacity:.35;
  pointer-events:none;
  background-image:
    linear-gradient(rgba(34,225,255,.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,225,255,.05) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: radial-gradient(ellipse at center, black 0%, transparent 75%);
}

/* ==========================================================================
   Botões
   ========================================================================== */
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:.5em;
  padding: .85em 1.6em;
  font-family: var(--font-display);
  font-size: .85rem;
  font-weight:600;
  letter-spacing:.06em;
  text-transform: uppercase;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  transition: all .2s ease;
  white-space: nowrap;
}
.btn-primary{
  background: linear-gradient(135deg, var(--cyan) 0%, var(--blue) 100%);
  color: #04060b;
  box-shadow: 0 0 0 rgba(34,225,255,0), 0 6px 20px rgba(34,225,255,.25);
}
.btn-primary:hover{ box-shadow: 0 0 24px rgba(34,225,255,.55); transform: translateY(-1px); }
.btn-outline{
  background: transparent;
  border-color: var(--border-bright);
  color: var(--silver);
}
.btn-outline:hover{ border-color: var(--cyan); color: var(--cyan); box-shadow: var(--shadow-glow); }
.btn-ghost{
  background: rgba(255,255,255,.03);
  color: var(--text-dim);
  border-color: var(--border);
}
.btn-ghost:hover{ color: var(--text); border-color: var(--border-bright); }
.btn-block{ width:100%; }
.btn-sm{ padding:.55em 1.1em; font-size:.72rem; }
.btn:disabled{ opacity:.5; cursor:not-allowed; }

/* ==========================================================================
   Header
   ========================================================================== */
.topbar{
  background: linear-gradient(90deg, #061019, #0a1626, #061019);
  border-bottom: 1px solid var(--border);
  color: var(--cyan-2);
  font-size: .78rem;
  letter-spacing: .04em;
  text-align:center;
  padding: 7px 12px;
  font-family: var(--font-display);
  overflow:hidden;
  white-space: nowrap;
}
.topbar-brand{
  color: var(--silver-bright);
  font-weight: 700;
  letter-spacing: .12em;
}

.site-header{
  position: sticky;
  top:0;
  z-index: 100;
  background: rgba(4,6,11,.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}
.header-main{
  display:flex;
  align-items:center;
  gap: 24px;
  padding: 14px 20px;
}
.brand{
  display:flex;
  align-items:center;
  gap:10px;
  flex-shrink:0;
}
.brand-logo-img{
  height: 72px;
  width: auto;
  display:block;
}
.brand-logo-img-footer{
  height: 96px;
  width: auto;
  display:block;
}
@media (max-width: 960px){
  .brand-logo-img{ height: 54px; }
}
.main-nav{
  display:flex;
  gap: 6px;
  flex:1;
}
.main-nav a{
  padding: 8px 14px;
  font-size:.92rem;
  font-weight:600;
  color: var(--text-dim);
  border-radius: var(--radius-sm);
  transition: all .15s ease;
}
.main-nav a:hover, .main-nav a.active{
  color: var(--cyan);
  background: rgba(34,225,255,.08);
}
.header-actions{
  display:flex;
  align-items:center;
  gap: 6px;
}
.icon-btn{
  position:relative;
  width:42px; height:42px;
  display:flex; align-items:center; justify-content:center;
  border-radius: var(--radius-sm);
  color: var(--silver);
  border: 1px solid transparent;
}
.icon-btn:hover{ color: var(--cyan); border-color: var(--border-bright); background: rgba(34,225,255,.06); }
.icon-btn svg{ width:20px; height:20px; }
.cart-count{
  position:absolute;
  top:2px; right:2px;
  background: var(--cyan);
  color:#04060b;
  font-size:.62rem;
  font-weight:800;
  min-width:16px; height:16px;
  border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  padding: 0 2px;
}
.menu-toggle{
  display:none;
  background:none; border:none; color: var(--silver); font-size:1.4rem;
}

@media (max-width: 960px){
  .main-nav{
    position:fixed; inset: 64px 0 0 0;
    background: var(--bg-alt);
    flex-direction:column;
    padding: 20px;
    transform: translateX(100%);
    transition: transform .25s ease;
    z-index:99;
    overflow-y:auto;
  }
  .main-nav.open{ transform: translateX(0); }
  .main-nav a{ padding:14px 10px; font-size:1.05rem; border-bottom:1px solid var(--border); border-radius:0; }
  .menu-toggle{ display:block; }
}

/* ==========================================================================
   Hero
   ========================================================================== */
.hero{
  position:relative;
  padding: 90px 20px 70px;
  text-align:center;
  overflow:hidden;
  border-bottom: 1px solid var(--border);
}
.hero::before{
  content:"";
  position:absolute; inset:0;
  background:
    radial-gradient(600px 300px at 20% 20%, rgba(47,111,255,.18), transparent 60%),
    radial-gradient(700px 350px at 80% 30%, rgba(34,225,255,.15), transparent 60%);
  z-index:-1;
}
.hero-brand{
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2.4rem, 7vw, 5.2rem);
  letter-spacing: .06em;
  line-height: 1;
  margin-bottom: 18px;
  color: var(--silver-bright);
  text-shadow: 0 0 40px rgba(34,225,255,.3);
}
.hero-brand span{
  background: linear-gradient(120deg, var(--cyan), var(--blue));
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.hero-eyebrow{
  display:inline-flex; align-items:center; gap:8px;
  font-family: var(--font-display);
  font-size:.72rem;
  letter-spacing:.15em;
  text-transform:uppercase;
  color: var(--cyan);
  border:1px solid var(--border-bright);
  padding: 6px 16px;
  border-radius: 999px;
  margin-bottom: 22px;
  background: rgba(34,225,255,.05);
}
.hero h1{ max-width: 820px; margin:0 auto .4em; }
.hero h1 .grad{
  background: linear-gradient(120deg, var(--cyan), var(--blue));
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.hero p.lead{ max-width:620px; margin:0 auto 30px; font-size:1.05rem; }
.hero-actions{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }

.hero-tags{
  display:flex; justify-content:center; gap: 14px; flex-wrap:wrap;
  margin-top: 40px;
}
.hero-tags span{
  font-size:.78rem; color: var(--text-dim);
  border:1px solid var(--border);
  padding:6px 14px; border-radius:999px;
}

/* ==========================================================================
   Seções gerais
   ========================================================================== */
section{ padding: 64px 0; }
.section-head{
  display:flex; align-items:flex-end; justify-content:space-between; gap:20px;
  margin-bottom: 32px; flex-wrap:wrap;
}
.section-head .eyebrow{
  font-family: var(--font-display);
  font-size:.7rem; letter-spacing:.12em; text-transform:uppercase;
  color: var(--cyan); margin-bottom:6px; display:block;
}
.section-head h2{ margin:0; }
.section-head p{ margin: 6px 0 0; max-width: 520px; }

/* Categorias */
.cat-grid{
  display:grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
}
.cat-card{
  position:relative;
  background: linear-gradient(160deg, var(--surface), var(--surface-2));
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 26px 20px;
  text-align:center;
  transition: all .2s ease;
}
.cat-card:hover{
  border-color: var(--cyan-dim);
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
}
.cat-card .ico{ font-size: 2.2rem; margin-bottom:10px; }
.cat-card h3{ margin:0 0 4px; font-size:1rem; }
.cat-card span{ font-size:.8rem; color: var(--text-mute); }

@media (max-width: 900px){ .cat-grid{ grid-template-columns: repeat(2,1fr); } }

/* Grid de produtos */
.product-grid{
  display:grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
@media (max-width: 1100px){ .product-grid{ grid-template-columns: repeat(3,1fr); } }
@media (max-width: 760px){ .product-grid{ grid-template-columns: repeat(2,1fr); gap: 12px; } }
@media (max-width: 420px){ .product-grid{ gap: 9px; } }

.product-card{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow:hidden;
  display:flex; flex-direction:column;
  transition: all .2s ease;
  position:relative;
}
.product-card:hover{
  border-color: var(--cyan-dim);
  box-shadow: var(--shadow-card), var(--shadow-glow);
  transform: translateY(-3px);
}
.product-thumb{
  aspect-ratio: 1/1;
  display:flex; align-items:center; justify-content:center;
  font-size: 3.6rem;
  background:
    radial-gradient(circle at 30% 20%, rgba(34,225,255,.16), transparent 55%),
    repeating-linear-gradient(45deg, rgba(255,255,255,.02) 0 2px, transparent 2px 14px),
    linear-gradient(160deg, #0c1526, #0a0f1c);
  position:relative;
  border-bottom: 1px solid var(--border);
}
.product-badge{
  position:absolute; top:10px; left:10px;
  font-family: var(--font-display);
  font-size:.62rem; letter-spacing:.08em; text-transform:uppercase;
  padding: 5px 10px; border-radius: 999px;
  background: rgba(34,225,255,.12);
  border: 1px solid var(--cyan-dim);
  color: var(--cyan-2);
}
.product-badge.sale{ background: rgba(255,77,109,.12); border-color:#8a2a3c; color:#ff8fa3; }
.product-body{ padding: 16px; display:flex; flex-direction:column; gap:8px; flex:1; }
.product-cat{ font-size:.7rem; text-transform:uppercase; letter-spacing:.12em; color: var(--text-mute); }
.product-name{ font-size:1rem; font-weight:700; color: var(--silver-bright); line-height:1.3; }
.product-name a:hover{ color: var(--cyan); }
.product-price-row{ margin-top:auto; display:flex; align-items:baseline; gap:8px; }
.price-old{ font-size:.82rem; color: var(--text-mute); text-decoration:line-through; }
.price-now{ font-family: var(--font-display); font-size:1.15rem; color: var(--cyan-2); font-weight:700; }
.product-actions{ display:flex; gap:8px; margin-top:10px; }

@media (max-width: 480px){
  .product-body{ padding: 10px; gap:5px; }
  .product-thumb{ font-size: 2.6rem; }
  .product-cat{ font-size:.6rem; }
  .product-name{ font-size:.82rem; -webkit-line-clamp:2; display:-webkit-box; -webkit-box-orient:vertical; overflow:hidden; }
  .price-now{ font-size:.95rem; }
  .price-old{ font-size:.7rem; }
  .product-badge{ font-size:.55rem; padding:4px 8px; top:6px; left:6px; }
  .product-actions{ gap:6px; margin-top:6px; }
  .product-actions .btn{ padding:.55em .4em; font-size:.65rem; }
}

/* Tabs de categoria (loja) */
.filter-bar{
  display:flex; flex-wrap:wrap; gap:10px; margin-bottom: 28px;
}
.filter-chip{
  padding: 8px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-size:.85rem; font-weight:600; color: var(--text-dim);
  background: var(--surface);
}
.filter-chip.active, .filter-chip:hover{
  color: var(--cyan); border-color: var(--cyan-dim); background: rgba(34,225,255,.06);
}

@media (max-width: 640px){
  .filter-bar{
    flex-wrap: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 4px;
    margin-left: -20px; margin-right: -20px; padding-left: 20px; padding-right: 20px;
  }
  .filter-bar::-webkit-scrollbar{ display:none; }
  .filter-chip{
    flex: 0 0 auto;
    scroll-snap-align: start;
    white-space: nowrap;
    font-size:.8rem; padding:7px 14px;
  }
}

/* Benefícios */
.benefits{
  display:grid; grid-template-columns: repeat(4,1fr); gap:18px;
}
.benefit{
  text-align:center; padding: 24px 14px;
  border:1px solid var(--border); border-radius: var(--radius);
  background: var(--surface);
}
.benefit .ico{ font-size:1.8rem; margin-bottom:8px; }
.benefit h3{ font-size:.95rem; margin-bottom:4px; }
.benefit p{ font-size:.85rem; margin:0; }
@media (max-width: 760px){ .benefits{ grid-template-columns: repeat(2,1fr); } }

/* Cards genéricos */
.card{
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}

/* Formulários */
.field{ margin-bottom: 16px; }
.field label{
  display:block; margin-bottom:6px; font-size:.85rem; font-weight:600;
  color: var(--text-dim); letter-spacing:.02em;
}
.field input, .field select, .field textarea{
  width:100%;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  font-size: .95rem;
  transition: border-color .15s ease;
}
.field input:focus, .field select:focus, .field textarea:focus{
  outline:none; border-color: var(--cyan-dim); box-shadow: 0 0 0 3px rgba(34,225,255,.12);
}
.field-row{ display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
@media (max-width:600px){ .field-row{ grid-template-columns:1fr; } }

/* Painel admin */
.status-select{
  background: var(--bg-alt);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: .8rem;
  margin-top: 6px;
  text-transform: capitalize;
}
#adminProductsBody td, #adminProductsBody th{ vertical-align: middle; }
.form-note{ font-size:.8rem; color: var(--text-mute); margin-top:-8px; }
.form-error{
  background: rgba(255,77,109,.08); border:1px solid #8a2a3c; color:#ff8fa3;
  padding:10px 14px; border-radius: var(--radius-sm); font-size:.85rem; margin-bottom:16px; display:none;
}
.form-success{
  background: rgba(45,212,191,.08); border:1px solid #1b6d63; color:#7fe8db;
  padding:10px 14px; border-radius: var(--radius-sm); font-size:.85rem; margin-bottom:16px; display:none;
}

.auth-shell{
  max-width: 440px; margin: 60px auto; padding: 0 20px;
}
.auth-shell .card{ padding: 32px 28px; }
.auth-shell h1{ font-size:1.6rem; text-align:center; }
.auth-shell p.lead{ text-align:center; color: var(--text-dim); margin-bottom:26px; }
.auth-switch{ text-align:center; margin-top: 18px; font-size:.9rem; color: var(--text-dim); }
.auth-switch a{ color: var(--cyan); font-weight:600; }

/* Carrinho */
.cart-layout{ display:grid; grid-template-columns: 1.6fr 1fr; gap: 28px; align-items:flex-start; }
@media (max-width: 900px){ .cart-layout{ grid-template-columns: 1fr; } }
.cart-item{
  display:grid; grid-template-columns: 64px 1fr auto auto auto; gap:14px; align-items:center;
  padding: 16px 0; border-bottom: 1px solid var(--border);
}
.cart-item .thumb{
  width:64px; height:64px; border-radius: var(--radius-sm);
  display:flex; align-items:center; justify-content:center; font-size:1.8rem;
  background: linear-gradient(160deg, #0c1526, #0a0f1c); border:1px solid var(--border);
}
.qty-control{ display:flex; align-items:center; border:1px solid var(--border); border-radius: var(--radius-sm); }
.qty-control button{ background:none; border:none; color: var(--text); width:28px; height:32px; }
.qty-control input{ width:36px; text-align:center; background:none; border:none; color:var(--text); }
.remove-link{ color: var(--danger); font-size:.8rem; }

@media (max-width: 640px){
  .cart-item{
    grid-template-columns: 56px 1fr;
    grid-template-areas:
      "thumb info"
      "qty   qty"
      "price remove";
    row-gap: 10px;
  }
  .cart-item .thumb{ grid-area: thumb; width:56px; height:56px; }
  .cart-item > div:nth-child(2){ grid-area: info; }
  .cart-item .qty-control{ grid-area: qty; justify-self:start; }
  .cart-item > div:nth-child(4){ grid-area: price; }
  .cart-item .remove-link{ grid-area: remove; justify-self:end; }
}
.summary-row{ display:flex; justify-content:space-between; margin-bottom:10px; color: var(--text-dim); font-size:.92rem; }
.summary-row.total{ color: var(--silver-bright); font-family: var(--font-display); font-size:1.2rem; padding-top:14px; border-top:1px solid var(--border); }
.empty-state{ text-align:center; padding: 60px 20px; color: var(--text-mute); }
.empty-state .ico{ font-size:3rem; margin-bottom:14px; }

/* Produto detalhe */
.product-detail{ display:grid; grid-template-columns: 1fr 1fr; gap: 40px; }
@media (max-width: 860px){ .product-detail{ grid-template-columns: 1fr; } }
.product-gallery{
  aspect-ratio: 1/1;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  font-size: 7rem;
  background:
    radial-gradient(circle at 30% 20%, rgba(34,225,255,.18), transparent 55%),
    linear-gradient(160deg, #0c1526, #0a0f1c);
}
.breadcrumb{ font-size:.82rem; color: var(--text-mute); margin-bottom: 20px; }
.breadcrumb a:hover{ color: var(--cyan); }
.stock-tag{ display:inline-flex; align-items:center; gap:6px; font-size:.8rem; color: var(--success); margin-bottom: 14px; }
.stock-tag::before{ content:""; width:7px; height:7px; border-radius:50%; background: var(--success); }
.qty-selector{ display:flex; align-items:center; gap:14px; margin: 20px 0; }

/* Barra fixa de compra no produto (mobile) */
.buy-bar-mobile{
  position: fixed; left:0; right:0; bottom:0; z-index: 750;
  background: rgba(8,12,22,.97);
  backdrop-filter: blur(14px) saturate(160%);
  border-top: 1px solid var(--border);
  padding: 12px 16px;
  display:flex; align-items:center; justify-content:space-between; gap:14px;
}
.buy-bar-mobile .old{ display:block; font-size:.72rem; color: var(--text-mute); text-decoration:line-through; }
.buy-bar-mobile .price{ font-family: var(--font-display); color: var(--cyan-2); font-weight:800; font-size:1.15rem; }
.buy-bar-mobile button{ flex-shrink:0; white-space:nowrap; }

/* Steps de checkout */
.steps{ display:flex; gap:10px; margin-bottom: 32px; flex-wrap:wrap; }
.step{
  display:flex; align-items:center; gap:8px; font-size:.85rem; color: var(--text-mute);
  padding:8px 14px; border:1px solid var(--border); border-radius:999px;
}
.step.active{ color: var(--cyan); border-color: var(--cyan-dim); }
.step .n{
  width:20px; height:20px; border-radius:50%; background: var(--surface-2); display:flex; align-items:center; justify-content:center;
  font-size:.7rem; font-family: var(--font-display);
}
.step.active .n{ background: var(--cyan); color:#04060b; }

.pay-methods{ display:flex; flex-direction:column; gap:10px; }
.pay-method{
  display:flex; align-items:flex-start; gap:12px;
  border:1px solid var(--border); border-radius: var(--radius); padding:16px;
  cursor:pointer;
}
.pay-method.selected{ border-color: var(--cyan-dim); background: rgba(34,225,255,.05); }
.pay-method input{ margin-top:3px; }
.pay-method .tit{ font-weight:700; color: var(--silver-bright); font-size:.95rem; }
.pay-method .desc{ font-size:.82rem; color: var(--text-mute); margin:0; }
.pay-method .soon{ font-size:.65rem; text-transform:uppercase; letter-spacing:.08em; color: var(--warning); border:1px solid #6b5220; padding:2px 8px; border-radius:999px; margin-left:8px; }

/* Depoimentos */
.testi-grid{ display:grid; grid-template-columns: repeat(3,1fr); gap:20px; }
@media (max-width: 900px){ .testi-grid{ grid-template-columns:1fr; } }
.testi-card{ padding:22px; }
.testi-stars{ color: var(--warning); letter-spacing:2px; margin-bottom:10px; }
.testi-name{ font-weight:700; color: var(--silver-bright); margin-top:14px; }
.testi-loc{ font-size:.8rem; color: var(--text-mute); }

/* Newsletter / CTA banda */
.cta-band{
  border-radius: var(--radius-lg);
  padding: 50px 30px;
  text-align:center;
  background: linear-gradient(135deg, rgba(47,111,255,.15), rgba(34,225,255,.08));
  border: 1px solid var(--border-bright);
}

/* Trust strip */
.trust-strip{
  display:flex; justify-content:center; gap: 30px; flex-wrap:wrap;
  padding: 24px 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border);
  font-size:.8rem; color: var(--text-mute);
}
.trust-strip span{ display:flex; align-items:center; gap:6px; }

/* Footer */
.site-footer{
  background: var(--bg-alt);
  border-top: 1px solid var(--border);
  padding: 56px 0 24px;
  margin-top: 40px;
}
.footer-grid{
  display:grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 32px;
  margin-bottom: 40px;
}
@media (max-width: 800px){ .footer-grid{ grid-template-columns: repeat(2,1fr); } }
.footer-grid h4{ font-size:.85rem; text-transform:uppercase; letter-spacing:.1em; color: var(--cyan); margin-bottom:16px; }
.footer-grid ul li{ margin-bottom:10px; }
.footer-grid ul li a{ color: var(--text-dim); font-size:.9rem; }
.footer-grid ul li a:hover{ color: var(--cyan); }
.footer-bottom{
  border-top: 1px solid var(--border);
  padding-top: 20px;
  display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px;
  font-size:.8rem; color: var(--text-mute);
}

/* Badges genéricos */
.badge{
  display:inline-block; font-size:.68rem; text-transform:uppercase; letter-spacing:.08em;
  padding:4px 10px; border-radius:999px; border:1px solid var(--border-bright); color: var(--text-dim);
}
.status-pill{ padding:4px 12px; border-radius:999px; font-size:.75rem; font-weight:700; }
.status-aguardando_pagamento{ background: rgba(255,176,32,.12); color:#ffb020; }
.status-pago{ background: rgba(45,212,191,.12); color:#2dd4bf; }
.status-enviado{ background: rgba(47,111,255,.15); color:#7ea2ff; }
.status-entregue{ background: rgba(34,225,255,.12); color:#22e1ff; }
.status-cancelado{ background: rgba(255,77,109,.12); color:#ff4d6d; }

/* utilidades */
.text-center{ text-align:center; }
.mt-0{ margin-top:0; }
.mb-0{ margin-bottom:0; }
.flex{ display:flex; }
.gap-8{ gap:8px; }
.hidden{ display:none !important; }

/* Page header simples */
.page-hero{
  padding: 48px 0 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 40px;
}
.page-hero .eyebrow{
  font-family: var(--font-display); font-size:.7rem; letter-spacing:.12em; text-transform:uppercase; color: var(--cyan);
}

/* Loading spinner */
.spinner{
  width:18px; height:18px; border-radius:50%;
  border: 2px solid rgba(255,255,255,.2); border-top-color: var(--cyan);
  animation: spin .7s linear infinite; display:inline-block;
}
@keyframes spin{ to{ transform: rotate(360deg); } }

/* Botão flutuante do WhatsApp */
.whatsapp-float{
  position: fixed;
  right: 22px;
  bottom: 22px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #25D366;
  display:flex;
  align-items:center;
  justify-content:center;
  color: #04120a;
  box-shadow: 0 6px 22px rgba(0,0,0,.45), 0 0 0 rgba(37,211,102,0);
  z-index: 200;
  transition: transform .2s ease, box-shadow .2s ease;
}
.whatsapp-float svg{ width: 30px; height: 30px; }
.whatsapp-float:hover{
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 28px rgba(0,0,0,.5), 0 0 22px rgba(37,211,102,.55);
  color: #04120a;
}
@media (max-width: 600px){
  .whatsapp-float{ right: 16px; bottom: 16px; width: 52px; height: 52px; }
  .whatsapp-float svg{ width: 26px; height: 26px; }
}

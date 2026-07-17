/**
 * Catálogo placeholder — troque por dados reais quando tiver fotos/preços
 * definitivos. Quando o Supabase estiver configurado (js/config.js) e a
 * tabela "products" tiver linhas, dá pra migrar getProducts() para buscar
 * de lá em vez deste array (ver comentário no fim do arquivo).
 */
window.REISEN_CATEGORIES = [
  { slug: "miniaturas", name: "Miniaturas & RPG", icon: "🐉" },
  { slug: "pecas", name: "Peças & Protótipos", icon: "⚙️" },
  { slug: "filamentos", name: "Filamentos", icon: "🧵" },
  { slug: "decoracao", name: "Decoração", icon: "💡" },
  { slug: "acessorios", name: "Acessórios", icon: "📱" },
  { slug: "chaveiros", name: "Chaveiros", icon: "🔑" },
  { slug: "servicos", name: "Serviços sob Encomenda", icon: "🛠️" },
];

window.REISEN_PRODUCTS = [
  {
    id: "p1",
    slug: "miniatura-dragao-ancião",
    name: "Miniatura RPG — Dragão Ancião",
    category: "miniaturas",
    price: 89.9,
    oldPrice: 109.9,
    emoji: "🐉",
    badge: "Mais vendido",
    stock: 18,
    featured: true,
    short: "Miniatura em resina para RPG de mesa, alta definição de escamas e detalhes.",
    description:
      "Impressa em resina de alta resolução, ideal para mesas de RPG e colecionadores. Acabamento com suporte para pintura, base texturizada incluída. Escala 32mm (outras escalas sob consulta).",
  },
  {
    id: "p2",
    slug: "kit-guerreiros-fantasia",
    name: "Kit Miniaturas Guerreiros (6 un.)",
    category: "miniaturas",
    price: 149.9,
    oldPrice: null,
    emoji: "⚔️",
    badge: null,
    stock: 12,
    short: "Set com 6 miniaturas variadas para campanhas de fantasia medieval.",
    description:
      "Conjunto com 6 miniaturas de guerreiros em poses variadas, perfeitas para grupos de aventureiros. Resina de alta definição, prontas para lixar e pintar.",
  },
  {
    id: "p3",
    slug: "suporte-celular-modular",
    name: "Suporte de Celular Modular",
    category: "acessorios",
    price: 39.9,
    oldPrice: null,
    emoji: "📱",
    badge: null,
    stock: 40,
    short: "Suporte ajustável em PETG, resistente e leve, para mesa ou estação de trabalho.",
    description:
      "Impresso em PETG de alta resistência, com ajuste de ângulo e altura. Compatível com a maioria dos smartphones, com ou sem capinha.",
  },
  {
    id: "p4",
    slug: "prototipo-funcional-sob-encomenda",
    name: "Protótipo Funcional sob Encomenda",
    category: "servicos",
    price: 299.0,
    oldPrice: null,
    emoji: "🧩",
    badge: "Sob orçamento",
    stock: 999,
    featured: true,
    short: "Modelagem e impressão de protótipos funcionais a partir do seu projeto ou ideia.",
    description:
      "Serviço completo de modelagem 3D e impressão de protótipos funcionais para projetos pessoais, startups e empresas. Valor inicial — orçamento final conforme complexidade e material.",
  },
  {
    id: "p5",
    slug: "peca-reposicao-personalizada",
    name: "Peça de Reposição Personalizada",
    category: "pecas",
    price: 59.9,
    oldPrice: null,
    emoji: "🔩",
    badge: null,
    stock: 25,
    short: "Recriamos peças quebradas ou descontinuadas a partir de medição ou amostra.",
    description:
      "Envie a peça original ou as medidas e recriamos em material compatível (PLA, PETG ou ABS). Ideal para eletrodomésticos, móveis e equipamentos com peças difíceis de encontrar.",
  },
  {
    id: "p6",
    slug: "filamento-pla-premium-preto",
    name: "Filamento PLA Premium 1kg — Preto",
    category: "filamentos",
    price: 119.9,
    oldPrice: 134.9,
    emoji: "🧵",
    badge: "Promoção",
    stock: 60,
    short: "Filamento PLA de alta fluidez, baixo odor e acabamento uniforme.",
    description:
      "PLA premium com diâmetro controlado (1.75mm ±0.02mm), ideal para impressões detalhadas com bom acabamento superficial. Rolo com 1kg.",
  },
  {
    id: "p7",
    slug: "filamento-petg-cinza-metalico",
    name: "Filamento PETG Premium 1kg — Cinza Metálico",
    category: "filamentos",
    price: 139.9,
    oldPrice: null,
    emoji: "🧵",
    badge: null,
    stock: 35,
    short: "PETG resistente a impacto e umidade, com acabamento metálico.",
    description:
      "PETG de alta resistência mecânica e térmica, ótimo para peças funcionais que exigem mais durabilidade. Acabamento metálico acetinado.",
  },
  {
    id: "p8",
    slug: "luminaria-led-voronoi",
    name: "Luminária LED Voronoi",
    category: "decoracao",
    price: 129.9,
    oldPrice: null,
    emoji: "💡",
    badge: "Novo",
    stock: 15,
    featured: true,
    short: "Luminária decorativa com padrão orgânico Voronoi e iluminação LED embutida.",
    description:
      "Peça decorativa impressa em 3D com padrão Voronoi, acompanha fita LED USB. Um destaque futurista para qualquer ambiente.",
  },
  {
    id: "p9",
    slug: "vaso-geometrico-decorativo",
    name: "Vaso Geométrico Decorativo",
    category: "decoracao",
    price: 69.9,
    oldPrice: null,
    emoji: "🏺",
    badge: null,
    stock: 22,
    short: "Vaso com geometria facetada, acabamento fosco, várias cores disponíveis.",
    description:
      "Vaso decorativo com design geométrico facetado. Disponível em diversas cores sob consulta. Ideal para plantas pequenas ou decoração de mesa.",
  },
  {
    id: "p10",
    slug: "chaveiro-polvo-articulado",
    name: "Chaveiro Polvo Articulado",
    category: "chaveiros",
    price: 34.9,
    oldPrice: null,
    emoji: "🐙",
    image: "assets/produtos/chaveiros/chaveiropolvolaranja.jpg",
    badge: "Novo",
    stock: 30,
    short: "Chaveiro articulado de polvo, com tentáculos móveis e olhinhos 3D.",
    description:
      "Impresso com peças articuladas que se movem como um polvo de verdade. Acabamento liso em laranja vibrante, com argola e correntinha metálicas inclusas.",
  },
  {
    id: "p11",
    slug: "chaveiro-taca-copa-do-mundo",
    name: "Chaveiro Taça Copa do Mundo",
    category: "chaveiros",
    price: 29.9,
    oldPrice: null,
    emoji: "🏆",
    image: "assets/produtos/chaveiros/chaveirocopadomundo.jpg",
    badge: "Novo",
    stock: 25,
    short: "Mini réplica da taça da Copa do Mundo, em dourado com detalhes verde e amarelo.",
    description:
      "Peça impressa com acabamento dourado metalizado e faixa verde/amarela na base. Um mimo perfeito para apaixonados por futebol.",
  },
  {
    id: "p12",
    slug: "chaveiro-monster-energy",
    name: "Chaveiro Monster Energy",
    category: "chaveiros",
    price: 24.9,
    oldPrice: null,
    emoji: "⚡",
    image: "assets/produtos/chaveiros/chaveiromonster.jpg",
    badge: "Novo",
    stock: 40,
    featured: true,
    short: "Chaveiro com o logo Monster Energy, em preto e amarelo.",
    description:
      "Impresso em multicor (preto e amarelo) com acabamento fosco, argola e correntinha douradas. Ótimo mimo para fãs da marca.",
  },
  {
    id: "p13",
    slug: "chaveiro-caneca-monster",
    name: "Chaveiro Caneca Monster",
    category: "chaveiros",
    price: 27.9,
    oldPrice: null,
    emoji: "🍺",
    image: "assets/produtos/chaveiros/chaveirocanecamonster.jpg",
    badge: "Novo",
    stock: 35,
    short: "Mini caneca decorativa com textura do logo Monster, disponível em branco ou verde.",
    description:
      "Detalhe divertido em formato de caneca, impresso com textura em relevo do logo Monster. Disponível em branco ou verde (cor sortida conforme estoque).",
  },
];

function reisenFormatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function reisenGetProductById(id) {
  return window.REISEN_PRODUCTS.find((p) => p.id === id);
}

function reisenGetProductsByCategory(categorySlug) {
  if (!categorySlug || categorySlug === "todos") return window.REISEN_PRODUCTS;
  return window.REISEN_PRODUCTS.filter((p) => p.category === categorySlug);
}

function reisenProductCardHTML(p) {
  const badge = p.badge ? `<span class="product-badge ${p.oldPrice ? "sale" : ""}">${p.badge}</span>` : "";
  const oldPrice = p.oldPrice ? `<span class="price-old">${reisenFormatBRL(p.oldPrice)}</span>` : "";
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
    : `<span>${p.emoji}</span>`;
  return `
  <article class="product-card">
    <a href="produto.html?id=${p.id}" class="product-thumb">
      ${badge}
      ${media}
    </a>
    <div class="product-body">
      <span class="product-cat">${(window.REISEN_CATEGORIES.find(c=>c.slug===p.category)||{}).name || p.category}</span>
      <h3 class="product-name"><a href="produto.html?id=${p.id}">${p.name}</a></h3>
      <div class="product-price-row">
        ${oldPrice}
        <span class="price-now">${reisenFormatBRL(p.price)}</span>
      </div>
      <div class="product-actions">
        <a href="produto.html?id=${p.id}" class="btn btn-outline btn-sm btn-block">Ver detalhes</a>
        <button class="btn btn-primary btn-sm btn-block" onclick="reisenAddToCart('${p.id}',1); reisenToast('Adicionado ao carrinho');">Comprar</button>
      </div>
    </div>
  </article>`;
}

function reisenToast(message) {
  let el = document.getElementById("reisenToast");
  if (!el) {
    el = document.createElement("div");
    el.id = "reisenToast";
    el.style.cssText =
      "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0d1220;border:1px solid #0ea5c4;color:#5ef2ff;padding:12px 20px;border-radius:8px;font-family:'Rajdhani',sans-serif;font-weight:600;z-index:999;box-shadow:0 0 20px rgba(34,225,255,.3);opacity:0;transition:opacity .25s ease;";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.opacity = "1";
  clearTimeout(window._reisenToastTimeout);
  window._reisenToastTimeout = setTimeout(() => (el.style.opacity = "0"), 2200);
}

/**
 * Converte uma linha da tabela "products" do Supabase (snake_case) para o
 * mesmo formato usado pelo array local REISEN_PRODUCTS (camelCase).
 */
function reisenMapDbProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    oldPrice: row.old_price !== null && row.old_price !== undefined ? Number(row.old_price) : null,
    emoji: row.emoji || "📦",
    image: row.image_url || null,
    badge: row.badge || null,
    stock: row.stock,
    short: row.description,
    description: row.description,
    weightKg: row.weight_kg !== null && row.weight_kg !== undefined ? Number(row.weight_kg) : 0.3,
    lengthCm: row.length_cm !== null && row.length_cm !== undefined ? Number(row.length_cm) : 16,
    widthCm: row.width_cm !== null && row.width_cm !== undefined ? Number(row.width_cm) : 11,
    heightCm: row.height_cm !== null && row.height_cm !== undefined ? Number(row.height_cm) : 11,
    featured: !!row.featured,
  };
}

/**
 * Card de produto no estilo da página inicial (design "premium", classes
 * rp-*). Usado pela seção "Produtos em destaque" do index.html — diferente
 * de reisenProductCardHTML, que é o card usado em loja.html.
 */
function reisenFeaturedProductCardHTML(p, idx) {
  const badge = p.badge ? `<span class="badge">${p.badge}</span>` : "";
  const tileClass = !p.image ? ` tile-${(idx % 6) + 1}` : "";
  const media = p.image
    ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;">`
    : `${p.emoji || "📦"}`;
  const oldPrice = p.oldPrice ? `<span class="rp-price-old">${reisenFormatBRL(p.oldPrice)}</span>` : "";
  const priceNow =
    p.category === "servicos"
      ? `a partir de ${reisenFormatBRL(p.price)}`
      : reisenFormatBRL(p.price);
  return `
  <div class="rp-product-card">
    <a href="produto.html?id=${p.id}" class="rp-product-thumb${tileClass}">${badge}${media}</a>
    <div class="rp-product-body">
      <h3 class="rp-product-name"><a href="produto.html?id=${p.id}">${p.name}</a></h3>
      <div class="rp-price-row">${oldPrice}<span class="rp-price-now">${priceNow}</span></div>
      <button class="rp-buy-btn" onclick="reisenAddToCart('${p.id}',1); reisenToast('Adicionado ao carrinho');">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        Comprar
      </button>
    </div>
  </div>`;
}

/**
 * Escolhe quais produtos mostrar em "Produtos em destaque" na home: os
 * marcados como destaque (featured=true) no admin; se nenhum estiver
 * marcado, cai para os mais recentes, só para a seção nunca ficar vazia.
 */
function reisenGetFeaturedProducts(limit) {
  limit = limit || 4;
  const all = window.REISEN_PRODUCTS || [];
  const featured = all.filter((p) => p.featured);
  return (featured.length > 0 ? featured : all).slice(0, limit);
}

/**
 * Busca o catálogo real no Supabase (tabela "products") e substitui o array
 * local REISEN_PRODUCTS por ele. Em modo demonstração (sem Supabase
 * configurado) não faz nada — o site continua usando os produtos placeholder
 * definidos acima. Chame e aguarde essa função no início de cada página que
 * lista produtos, antes de usar REISEN_PRODUCTS.
 */
async function reisenLoadCatalog() {
  if (window.REISEN_DEMO_MODE || !window.reisenSupabase) return;
  try {
    const { data, error } = await window.reisenSupabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data) return;
    window.REISEN_PRODUCTS = data.map(reisenMapDbProduct);
  } catch (e) {
    console.error("[REISEN LAB 3D] Falha ao carregar catálogo do Supabase:", e);
  }
}

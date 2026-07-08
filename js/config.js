/**
 * REISEN LAB 3D — Configuração
 * ---------------------------------------------------------------
 * Preencha com as chaves do SEU projeto Supabase (Settings > API).
 * A "anon key" é pública e pode ficar no front-end normalmente —
 * a segurança real é feita pelas políticas RLS (ver supabase/schema.sql).
 *
 * Enquanto SUPABASE_URL/SUPABASE_ANON_KEY estiverem com os valores
 * de exemplo abaixo, o site funciona em "modo demonstração": produtos
 * usam os dados de js/products.js e o checkout não grava pedidos reais.
 * ---------------------------------------------------------------
 */
window.REISEN_CONFIG = {
  SUPABASE_URL: "https://SEU-PROJETO.supabase.co",
  SUPABASE_ANON_KEY: "SUA-ANON-KEY-AQUI",

  // Dados de contato usados no site (WhatsApp, e-mail etc.)
  WHATSAPP_NUMBER: "5561981454998", // +55 61 98145-4998
  CONTACT_EMAIL: "contato@reisenlab3d.com.br",

  // Métodos de pagamento habilitados no checkout
  PAYMENTS: {
    infinitepay: { enabled: true, comingSoon: true }, // estrutura pronta, integração real pendente
  },
  INFINITEPAY_HANDLE: "sua_infinite_tag", // @handle da sua conta InfinitePay
};

window.REISEN_DEMO_MODE =
  !window.REISEN_CONFIG.SUPABASE_URL.includes("supabase.co") ||
  window.REISEN_CONFIG.SUPABASE_URL.includes("SEU-PROJETO");

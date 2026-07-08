/**
 * Inicializa o client do Supabase (carregado via CDN no <head> de cada página):
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
 */
window.reisenSupabase = null;

(function initSupabase() {
  if (window.REISEN_DEMO_MODE) {
    console.warn(
      "[REISEN LAB 3D] Modo demonstração: configure js/config.js com as chaves do seu projeto Supabase para ativar cadastro, login e pedidos reais."
    );
    return;
  }
  if (typeof window.supabase === "undefined") {
    console.error("[REISEN LAB 3D] Biblioteca supabase-js não carregada.");
    return;
  }
  window.reisenSupabase = window.supabase.createClient(
    window.REISEN_CONFIG.SUPABASE_URL,
    window.REISEN_CONFIG.SUPABASE_ANON_KEY
  );
})();

/**
 * Comportamentos gerais de UI compartilhados entre páginas.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // Marca item de navegação ativo (menu de cima e tab bar de baixo)
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a[data-page], .mobile-tabbar a[data-page]").forEach((a) => {
    if (a.getAttribute("data-page") === path) a.classList.add("active");
  });

  // Injeta número de WhatsApp nos links [data-whatsapp]
  if (window.REISEN_CONFIG) {
    document.querySelectorAll("[data-whatsapp]").forEach((el) => {
      const msg = encodeURIComponent(el.getAttribute("data-whatsapp") || "Olá! Vim pelo site da REISEN LAB 3D.");
      el.setAttribute("href", `https://wa.me/${window.REISEN_CONFIG.WHATSAPP_NUMBER}?text=${msg}`);
    });
    document.querySelectorAll("[data-contact-email]").forEach((el) => {
      el.textContent = window.REISEN_CONFIG.CONTACT_EMAIL;
      if (el.tagName === "A") el.setAttribute("href", `mailto:${window.REISEN_CONFIG.CONTACT_EMAIL}`);
    });
  }

  // Botão flutuante do WhatsApp (aparece em todas as páginas)
  if (window.REISEN_CONFIG && !document.querySelector(".whatsapp-float")) {
    const msg = encodeURIComponent("Olá! Vim pelo site da REISEN LAB 3D e gostaria de falar com vocês.");
    const fab = document.createElement("a");
    fab.className = "whatsapp-float";
    fab.href = `https://wa.me/${window.REISEN_CONFIG.WHATSAPP_NUMBER}?text=${msg}`;
    fab.target = "_blank";
    fab.rel = "noopener";
    fab.title = "Falar no WhatsApp";
    fab.setAttribute("aria-label", "Falar no WhatsApp");
    fab.innerHTML = `
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.34.65 4.53 1.78 6.4L4 29l7.76-1.75a11.98 11.98 0 0 0 4.26.78h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.86h-.01c-1.5 0-2.97-.4-4.26-1.16l-.3-.18-4.6 1.04 1.06-4.48-.2-.31a9.83 9.83 0 0 1-1.53-5.75c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.99c0 5.46-4.44 9.9-9.95 9.9zm5.43-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17-.35.22-.65.07a8.1 8.1 0 0 1-2.38-1.47 8.9 8.9 0 0 1-1.65-2.05c-.17-.3 0-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/>
      </svg>`;
    document.body.appendChild(fab);
  }

  // Countdown de oferta (opcional, usado na home)
  const countdownEl = document.getElementById("offerCountdown");
  if (countdownEl) {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    function tick() {
      const diff = end - new Date();
      if (diff <= 0) {
        countdownEl.textContent = "Oferta encerrada";
        return;
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      countdownEl.textContent = `${h}:${m}:${s}`;
    }
    tick();
    setInterval(tick, 1000);
  }
});

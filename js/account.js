/**
 * Página "Minha conta": exige sessão ativa e lista os pedidos do cliente.
 */
async function reisenLoadAccount() {
  const session = await reisenGetSession();
  const guestView = document.getElementById("accountGuest");
  const userView = document.getElementById("accountUser");
  if (!session || !session.user) {
    if (guestView) guestView.classList.remove("hidden");
    if (userView) userView.classList.add("hidden");
    return;
  }
  if (guestView) guestView.classList.add("hidden");
  if (userView) userView.classList.remove("hidden");

  const nameEl = document.getElementById("accountName");
  const emailEl = document.getElementById("accountEmail");
  if (nameEl) nameEl.textContent = session.user.user_metadata?.full_name || "Cliente";
  if (emailEl) emailEl.textContent = session.user.email || "";

  const ordersList = document.getElementById("ordersList");
  if (!ordersList) return;

  if (window.REISEN_DEMO_MODE) {
    ordersList.innerHTML = `<p class="form-note">Modo demonstração: pedidos reais aparecerão aqui assim que o Supabase estiver configurado (js/config.js).</p>`;
    return;
  }

  const { data: orders, error } = await window.reisenSupabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error || !orders || orders.length === 0) {
    ordersList.innerHTML = `<p class="form-note">Você ainda não tem pedidos.</p>`;
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (o) => `
    <div class="card" style="margin-bottom:14px;">
      <div class="flex" style="justify-content:space-between;align-items:center;margin-bottom:10px;">
        <strong>Pedido #${o.id.slice(0, 8)}</strong>
        <span class="status-pill status-${o.status}">${o.status.replace("_", " ")}</span>
      </div>
      <p class="form-note mb-0">${new Date(o.created_at).toLocaleDateString("pt-BR")} — ${o.order_items.length} item(ns) — <strong>${reisenFormatBRL(o.total)}</strong></p>
    </div>`
    )
    .join("");
}

async function reisenHandleLogout() {
  await reisenSignOut();
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("accountUser")) reisenLoadAccount();
});

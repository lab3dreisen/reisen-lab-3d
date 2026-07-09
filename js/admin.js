/**
 * Painel administrativo (admin.html): gestão de produtos e pedidos direto
 * no Supabase. Só funciona com o Supabase configurado (js/config.js) e com
 * o usuário logado marcado como admin (profiles.is_admin = true — ver
 * instruções no fim de supabase/schema.sql).
 */

let reisenAdminEditingId = null;

async function reisenInitAdmin() {
  const gate = document.getElementById("adminGate");
  const app = document.getElementById("adminApp");
  if (!gate || !app) return;

  if (window.REISEN_DEMO_MODE) {
    gate.innerHTML =
      '<div class="ico">⚙️</div><h3>Supabase não configurado</h3><p>Preencha <code>js/config.js</code> com a URL e a anon key do seu projeto Supabase para usar o painel administrativo.</p>';
    gate.classList.remove("hidden");
    return;
  }

  const session = await reisenGetSession();
  if (!session || !session.user) {
    gate.innerHTML =
      '<div class="ico">🔒</div><h3>Faça login</h3><p>Entre com sua conta para acessar o painel.</p><a href="login.html" class="btn btn-primary">Entrar</a>';
    gate.classList.remove("hidden");
    return;
  }

  const { data: profile, error } = await window.reisenSupabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", session.user.id)
    .single();

  if (error || !profile || !profile.is_admin) {
    gate.innerHTML =
      '<div class="ico">🚫</div><h3>Acesso restrito</h3><p>Sua conta não tem permissão de administrador. Peça para alguém com acesso ao Supabase marcar seu perfil como admin (ver supabase/schema.sql).</p>';
    gate.classList.remove("hidden");
    return;
  }

  gate.classList.add("hidden");
  app.classList.remove("hidden");
  const nameEl = document.getElementById("adminUserName");
  if (nameEl) nameEl.textContent = "Logado como " + (profile.full_name || session.user.email);

  reisenFillCategorySelect();
  reisenLoadAdminProducts();
  reisenLoadAdminOrders("todos");
}

function reisenFillCategorySelect() {
  const select = document.getElementById("productCategorySelect");
  if (!select || !window.REISEN_CATEGORIES) return;
  select.innerHTML = window.REISEN_CATEGORIES.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("");
}

function reisenShowAdminTab(tab) {
  document.getElementById("tabProdutos").classList.toggle("active", tab === "produtos");
  document.getElementById("tabPedidos").classList.toggle("active", tab === "pedidos");
  document.getElementById("panelProdutos").classList.toggle("hidden", tab !== "produtos");
  document.getElementById("panelPedidos").classList.toggle("hidden", tab !== "pedidos");
}

/* ============================================================================
   PRODUTOS
   ========================================================================== */

async function reisenLoadAdminProducts() {
  const tbody = document.getElementById("adminProductsBody");
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="padding:16px 8px;">Carregando…</td></tr>';

  const { data, error } = await window.reisenSupabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    tbody.innerHTML = `<tr><td colspan="6" style="padding:16px 8px;">Erro ao carregar produtos: ${error.message}</td></tr>`;
    return;
  }
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="padding:16px 8px;">Nenhum produto cadastrado ainda.</td></tr>';
    window._reisenAdminProductsCache = [];
    return;
  }

  window._reisenAdminProductsCache = data;

  tbody.innerHTML = data
    .map(
      (p) => `
    <tr style="border-bottom:1px solid var(--border);">
      <td style="padding:10px 8px;">${p.emoji || "📦"} ${p.name}</td>
      <td style="padding:10px 8px;">${(window.REISEN_CATEGORIES.find((c) => c.slug === p.category) || {}).name || p.category}</td>
      <td style="padding:10px 8px;">${reisenFormatBRL(Number(p.price))}${
        p.old_price ? `<br><span class="price-old">${reisenFormatBRL(Number(p.old_price))}</span>` : ""
      }</td>
      <td style="padding:10px 8px;">${p.stock}</td>
      <td style="padding:10px 8px;">
        <span class="badge" style="${
          p.active ? "color:var(--success);border-color:var(--success);" : "color:var(--danger);border-color:var(--danger);"
        }">${p.active ? "Ativo" : "Inativo"}</span>
      </td>
      <td style="padding:10px 8px; white-space:nowrap;">
        <button class="btn btn-ghost btn-sm" onclick="reisenEditProduct('${p.id}')">Editar</button>
        <button class="btn btn-outline btn-sm" onclick="reisenToggleProductActive('${p.id}', ${!p.active})">${
        p.active ? "Desativar" : "Ativar"
      }</button>
        <button class="btn btn-outline btn-sm" style="color:var(--danger);border-color:var(--danger);" onclick="reisenDeleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')">Excluir</button>
      </td>
    </tr>`
    )
    .join("");
}

function reisenOpenProductForm(product) {
  reisenAdminEditingId = product ? product.id : null;
  document.getElementById("productFormTitle").textContent = product ? "Editar produto" : "Novo produto";
  const f = document.getElementById("productForm");
  f.name.value = product ? product.name : "";
  f.slug.value = product ? product.slug : "";
  f.category.value = product ? product.category : window.REISEN_CATEGORIES[0].slug;
  f.price.value = product ? product.price : "";
  f.old_price.value = product && product.old_price !== null ? product.old_price : "";
  f.stock.value = product ? product.stock : 0;
  f.emoji.value = product && product.emoji ? product.emoji : "";
  f.image_url.value = product && product.image_url ? product.image_url : "";
  f.badge.value = product && product.badge ? product.badge : "";
  f.description.value = product && product.description ? product.description : "";
  f.active.checked = product ? !!product.active : true;
  document.getElementById("productFormCard").classList.remove("hidden");
  document.getElementById("productFormCard").scrollIntoView({ behavior: "smooth" });
}

function reisenCloseProductForm() {
  document.getElementById("productFormCard").classList.add("hidden");
  document.getElementById("productForm").reset();
  reisenAdminEditingId = null;
}

function reisenEditProduct(id) {
  const product = (window._reisenAdminProductsCache || []).find((p) => p.id === id);
  if (product) reisenOpenProductForm(product);
}

function reisenSlugify(text) {
  const nfd = text.trim().toLowerCase().normalize("NFD");
  let stripped = "";
  for (const ch of nfd) {
    const code = ch.codePointAt(0);
    if (code >= 0x0300 && code <= 0x036f) continue; // remove acentos (marcas combinantes)
    stripped += ch;
  }
  return stripped.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function reisenSubmitProductForm(e) {
  e.preventDefault();
  const f = e.target;
  const errorBox = document.getElementById("productFormError");
  errorBox.style.display = "none";

  const name = f.name.value.trim();
  const payload = {
    name: name,
    slug: f.slug.value.trim() || reisenSlugify(name),
    category: f.category.value,
    price: parseFloat(f.price.value),
    old_price: f.old_price.value ? parseFloat(f.old_price.value) : null,
    stock: parseInt(f.stock.value, 10) || 0,
    emoji: f.emoji.value.trim() || null,
    image_url: f.image_url.value.trim() || null,
    badge: f.badge.value.trim() || null,
    description: f.description.value.trim(),
    active: f.active.checked,
  };

  let error;
  if (reisenAdminEditingId) {
    ({ error } = await window.reisenSupabase.from("products").update(payload).eq("id", reisenAdminEditingId));
  } else {
    ({ error } = await window.reisenSupabase.from("products").insert(payload));
  }

  if (error) {
    errorBox.textContent = "Não foi possível salvar: " + error.message;
    errorBox.style.display = "block";
    return;
  }

  reisenToast("Produto salvo com sucesso");
  reisenCloseProductForm();
  reisenLoadAdminProducts();
}

async function reisenToggleProductActive(id, newState) {
  const { error } = await window.reisenSupabase.from("products").update({ active: newState }).eq("id", id);
  if (error) {
    reisenToast("Erro: " + error.message);
    return;
  }
  reisenLoadAdminProducts();
}

async function reisenDeleteProduct(id, name) {
  if (!confirm('Excluir "' + name + '" definitivamente? Essa ação não pode ser desfeita.')) return;
  const { error } = await window.reisenSupabase.from("products").delete().eq("id", id);
  if (error) {
    reisenToast("Erro ao excluir: " + error.message);
    return;
  }
  reisenToast("Produto excluído");
  reisenLoadAdminProducts();
}

/* ============================================================================
   PEDIDOS
   ========================================================================== */

async function reisenLoadAdminOrders(statusFilter) {
  document.querySelectorAll(".orders-filter .filter-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.status === statusFilter);
  });

  const list = document.getElementById("adminOrdersList");
  if (!list) return;
  list.innerHTML = '<p class="form-note">Carregando…</p>';

  let query = window.reisenSupabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  if (statusFilter && statusFilter !== "todos") query = query.eq("status", statusFilter);

  const { data, error } = await query;

  if (error) {
    list.innerHTML = `<p class="form-note">Erro ao carregar pedidos: ${error.message}</p>`;
    return;
  }
  if (!data || data.length === 0) {
    list.innerHTML = '<p class="form-note">Nenhum pedido encontrado nesse status.</p>';
    return;
  }

  const statusOptions = ["aguardando_pagamento", "pago", "enviado", "entregue", "cancelado"];

  list.innerHTML = data
    .map((o) => {
      const addr = o.shipping_address || {};
      return `
    <div class="card" style="margin-bottom:14px;">
      <div class="flex" style="justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
        <div>
          <strong>Pedido #${o.id.slice(0, 8)}</strong> — ${o.customer_name}
          <div class="form-note mb-0">${o.customer_email} · ${o.customer_phone}</div>
          <div class="form-note mb-0">${new Date(o.created_at).toLocaleString("pt-BR")}</div>
        </div>
        <div style="text-align:right;">
          <div class="price-now" style="font-size:1.1rem;">${reisenFormatBRL(Number(o.total))}</div>
          <select onchange="reisenUpdateOrderStatus('${o.id}', this.value)" class="status-select">
            ${statusOptions
              .map((s) => `<option value="${s}" ${s === o.status ? "selected" : ""}>${s.replace("_", " ")}</option>`)
              .join("")}
          </select>
        </div>
      </div>
      <div style="margin-top:12px; border-top:1px solid var(--border); padding-top:12px;">
        <div class="form-note mb-0"><strong>Endereço:</strong> ${addr.street || ""}, ${addr.number || ""} ${
        addr.complement || ""
      } — ${addr.neighborhood || ""}, ${addr.city || ""}/${addr.state || ""} — CEP ${addr.cep || ""}</div>
        <div class="form-note mb-0" style="margin-top:6px;"><strong>Itens:</strong> ${o.order_items
          .map((i) => `${i.quantity}x ${i.product_name}`)
          .join(", ")}</div>
      </div>
    </div>`;
    })
    .join("");
}

async function reisenUpdateOrderStatus(orderId, newStatus) {
  const { error } = await window.reisenSupabase.from("orders").update({ status: newStatus }).eq("id", orderId);
  if (error) {
    reisenToast("Erro ao atualizar status: " + error.message);
    return;
  }
  reisenToast("Status do pedido atualizado");
}

document.addEventListener("DOMContentLoaded", reisenInitAdmin);

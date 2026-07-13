/**
 * Fluxo de checkout.
 * Grava o pedido no Supabase (tabelas orders/order_items) com status
 * "aguardando_pagamento" e, fora do modo demonstração, chama a Edge Function
 * "create-infinitepay-link" para gerar o link de pagamento da InfinitePay e
 * redireciona o cliente para lá (Pix ou cartão). O pedido só passa para
 * "pago" quando a InfinitePay confirma via webhook (ver
 * supabase/edge-functions/infinitepay-webhook) — a tela de confirmação é
 * só uma tela de "obrigado", não é o que marca o pagamento.
 *
 * O frete é cotado em tempo real via Edge Function "calculate-shipping"
 * (Melhor Envio) assim que o cliente termina de digitar o CEP, e o valor
 * escolhido é somado ao total antes de gerar o link de pagamento.
 */

let reisenSelectedShipping = null;

function reisenRenderCheckoutSummary() {
  const items = reisenCartItemsWithData();
  const list = document.getElementById("checkoutItems");
  if (!list) return;
  if (items.length === 0) {
    window.location.href = "carrinho.html";
    return;
  }
  list.innerHTML = items
    .map(
      (i) => `
    <div class="summary-row">
      <span>${i.qty}x ${i.product.name}</span>
      <span>${reisenFormatBRL(i.subtotal)}</span>
    </div>`
    )
    .join("");
  reisenUpdateCheckoutTotals();
}

function reisenUpdateCheckoutTotals() {
  const totalEl = document.getElementById("checkoutTotal");
  const shippingRow = document.getElementById("checkoutShippingRow");
  const shippingEl = document.getElementById("checkoutShipping");
  const productsTotal = reisenCartTotal();

  if (shippingEl && shippingRow) {
    if (reisenSelectedShipping) {
      shippingEl.textContent = reisenFormatBRL(reisenSelectedShipping.price);
      shippingRow.classList.remove("hidden");
    } else {
      shippingRow.classList.add("hidden");
    }
  }

  const grandTotal = productsTotal + (reisenSelectedShipping ? reisenSelectedShipping.price : 0);
  if (totalEl) totalEl.textContent = reisenFormatBRL(grandTotal);
}

/**
 * Chama a Edge Function "calculate-shipping" com o CEP informado e os itens
 * do carrinho, e devolve a lista de opções (transportadora, serviço, preço,
 * prazo). Lança erro se não conseguir cotar.
 */
async function reisenFetchShippingOptions(cep) {
  const items = reisenCartItemsWithData().map((i) => ({
    productId: i.product.id,
    quantity: i.qty,
    price: i.product.price,
  }));

  const res = await fetch(`${window.REISEN_CONFIG.SUPABASE_URL}/functions/v1/calculate-shipping`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.REISEN_CONFIG.SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ cep, items }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.options) {
    throw new Error((data && data.error) || "Não foi possível calcular o frete para esse CEP.");
  }
  return data.options;
}

/**
 * Dispara a cotação de frete para o CEP atual do formulário, mostra estado de
 * carregamento/erro e renderiza as opções assim que chegarem.
 */
async function reisenHandleShippingLookup() {
  const cepInput = document.querySelector('#checkoutForm [name="cep"]');
  const box = document.getElementById("shippingOptionsBox");
  if (!cepInput || !box) return;

  const cep = cepInput.value.replace(/\D/g, "");
  reisenSelectedShipping = null;
  reisenUpdateCheckoutTotals();

  if (cep.length !== 8) {
    box.innerHTML = "";
    box.classList.add("hidden");
    return;
  }

  box.classList.remove("hidden");
  box.innerHTML = '<p class="form-note">Calculando opções de frete…</p>';

  if (window.REISEN_DEMO_MODE) {
    box.innerHTML = '<p class="form-note">Cálculo de frete disponível quando o Supabase estiver configurado (modo demonstração).</p>';
    return;
  }

  try {
    const options = await reisenFetchShippingOptions(cep);
    box.innerHTML =
      '<div class="pay-methods">' +
      options
        .map(
          (opt, idx) => `
      <label class="pay-method${idx === 0 ? " selected" : ""}">
        <input type="radio" name="shippingOption" value="${idx}" ${idx === 0 ? "checked" : ""} onchange="reisenSelectShippingOption(${idx})">
        <div>
          <div class="tit">${opt.carrier} — ${opt.service}</div>
          <p class="desc">${reisenFormatBRL(opt.price)}${opt.days ? ` · até ${opt.days} dias úteis` : ""}</p>
        </div>
      </label>`
        )
        .join("") +
      "</div>";
    window._reisenShippingOptions = options;
    reisenSelectShippingOption(0);
  } catch (err) {
    box.innerHTML = `<p class="form-note" style="color:var(--danger);">${err.message}</p>`;
  }
}

function reisenSelectShippingOption(idx) {
  const options = window._reisenShippingOptions || [];
  reisenSelectedShipping = options[idx] || null;
  reisenUpdateCheckoutTotals();

  const box = document.getElementById("shippingOptionsBox");
  if (box) {
    box.querySelectorAll(".pay-method").forEach((label, i) => {
      label.classList.toggle("selected", i === idx);
    });
  }
}

async function reisenSubmitOrder(formData) {
  const items = reisenCartItemsWithData();
  const productsTotal = reisenCartTotal();
  const shipping = reisenSelectedShipping;
  const total = productsTotal + (shipping ? shipping.price : 0);
  const session = await reisenGetSession();

  const order = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
    customer_document: (formData.document || "").replace(/\D/g, ""),
    shipping_address: {
      cep: formData.cep,
      street: formData.street,
      number: formData.number,
      complement: formData.complement,
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
    },
    payment_method: "infinitepay",
    status: "aguardando_pagamento",
    total: total,
    shipping_cost: shipping ? shipping.price : 0,
    shipping_carrier: shipping ? shipping.carrier : null,
    shipping_service: shipping ? shipping.service : null,
    shipping_days: shipping ? shipping.days : null,
    shipping_service_id: shipping ? shipping.id : null,
  };

  if (window.REISEN_DEMO_MODE) {
    // Modo demonstração: apenas simula, sem gravar em banco real.
    const fakeOrderId = "DEMO-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    return { orderId: fakeOrderId, error: null };
  }

  const { data: orderRow, error: orderError } = await window.reisenSupabase
    .from("orders")
    .insert({ ...order, user_id: session ? session.user.id : null })
    .select()
    .single();

  if (orderError) return { orderId: null, error: orderError };

  const orderItems = items.map((i) => ({
    order_id: orderRow.id,
    product_id: i.product.id.startsWith("p") ? null : i.product.id, // ids placeholder não são uuid válidos
    product_name: i.product.name,
    unit_price: i.product.price,
    quantity: i.qty,
    subtotal: i.subtotal,
  }));

  const { error: itemsError } = await window.reisenSupabase.from("order_items").insert(orderItems);
  if (itemsError) return { orderId: orderRow.id, error: itemsError };

  return { orderId: orderRow.id, error: null };
}

/**
 * Chama a Edge Function que gera o link de pagamento da InfinitePay para um
 * pedido já criado. Lança um erro se não conseguir gerar o link — quem
 * chamar essa função deve decidir o que fazer nesse caso (ex.: redirecionar
 * para a tela de confirmação mesmo assim, já que o pedido já está salvo).
 */
async function reisenCreateInfinitePayLink(orderId) {
  const res = await fetch(`${window.REISEN_CONFIG.SUPABASE_URL}/functions/v1/create-infinitepay-link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${window.REISEN_CONFIG.SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ orderId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error((data && data.error) || "Não foi possível gerar o link de pagamento.");
  }
  return data.url;
}

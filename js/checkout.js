/**
 * Fluxo de checkout.
 * Grava o pedido no Supabase (tabelas orders/order_items) com status
 * "aguardando_pagamento" e, fora do modo demonstração, chama a Edge Function
 * "create-infinitepay-link" para gerar o link de pagamento da InfinitePay e
 * redireciona o cliente para lá (Pix ou cartão). O pedido só passa para
 * "pago" quando a InfinitePay confirma via webhook (ver
 * supabase/edge-functions/infinitepay-webhook) — a tela de confirmação é
 * só uma tela de "obrigado", não é o que marca o pagamento.
 */

function reisenRenderCheckoutSummary() {
  const items = reisenCartItemsWithData();
  const list = document.getElementById("checkoutItems");
  const totalEl = document.getElementById("checkoutTotal");
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
  if (totalEl) totalEl.textContent = reisenFormatBRL(reisenCartTotal());
}

async function reisenSubmitOrder(formData) {
  const items = reisenCartItemsWithData();
  const total = reisenCartTotal();
  const session = await reisenGetSession();

  const order = {
    customer_name: formData.name,
    customer_email: formData.email,
    customer_phone: formData.phone,
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

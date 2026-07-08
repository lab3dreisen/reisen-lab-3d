/**
 * Fluxo de checkout.
 * Hoje: grava o pedido no Supabase (tabelas orders/order_items) com status
 * "aguardando_pagamento" e mostra confirmação — sem cobrança real ainda.
 * Próximo passo (quando a InfinitePay for plugada): chamar uma Supabase
 * Edge Function que gera o link de pagamento (POST /links da InfinitePay)
 * e redireciona o cliente para a URL de checkout retornada (ver
 * supabase/edge-functions/create-infinitepay-link).
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

  // TODO (próximo passo): chamar Edge Function "create-infinitepay-link" aqui,
  // passando orderRow.id e os items, e redirecionar o cliente para o link
  // de pagamento (campo "url") retornado pela InfinitePay.

  return { orderId: orderRow.id, error: null };
}

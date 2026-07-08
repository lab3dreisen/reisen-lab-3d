// ============================================================================
// REISEN LAB 3D — Edge Function: create-infinitepay-link (ESQUELETO)
// ----------------------------------------------------------------------------
// Isso ainda NÃO está ativo. É o próximo passo para ligar a InfinitePay.
//
// O que essa função vai fazer quando for implementada:
//   1. Receber o ID de um pedido (orders.id) já criado pelo checkout.
//   2. Buscar o pedido e seus itens no banco (com o supabase-js "service role").
//   3. Chamar a API de Checkout Integrado da InfinitePay (POST /links) para
//      gerar um link de pagamento com os itens do pedido.
//   4. Salvar a URL do link em orders.ip_checkout_url.
//   5. Devolver essa URL para o site, que redireciona o cliente até ela —
//      lá ele paga com Pix (grátis) ou cartão (até 12x).
//
// Como publicar (quando for usar):
//   supabase functions deploy create-infinitepay-link
//   supabase secrets set INFINITEPAY_HANDLE=sua_infinite_tag
//
// Depois, no checkout.js, troque o comentário "TODO" por uma chamada a:
//   fetch(`${SUPABASE_URL}/functions/v1/create-infinitepay-link`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${anonKey}` },
//     body: JSON.stringify({ orderId })
//   })
// e redirecionar o navegador para a "url" recebida na resposta.
//
// Documentação oficial: https://www.infinitepay.io/checkout-documentacao
// ============================================================================

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const INFINITEPAY_HANDLE = Deno.env.get("INFINITEPAY_HANDLE") ?? ""; // @handle da conta InfinitePay
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://SEU-SITE"; // ex: https://SEU-USUARIO.github.io/reisen-lab-3d

serve(async (req) => {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId é obrigatório" }), { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Pedido não encontrado" }), { status: 404 });
    }

    // --- Monta o payload do link de pagamento da InfinitePay ---
    // Observação: "price" é em centavos (ex.: R$ 89,90 -> 8990).
    const linkBody = {
      handle: INFINITEPAY_HANDLE,
      redirect_url: `${SITE_URL}/pedido-confirmado.html?id=${order.id}`,
      webhook_url: `${SUPABASE_URL}/functions/v1/infinitepay-webhook`, // criar depois, para receber confirmação de pagamento
      order_nsu: order.id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone_number: order.customer_phone,
      },
      items: order.order_items.map((item: any) => ({
        quantity: item.quantity,
        price: Math.round(Number(item.unit_price) * 100),
        description: item.product_name,
      })),
    };

    const ipResponse = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkBody),
    });

    const ipData = await ipResponse.json();

    if (!ipResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Falha ao criar link de pagamento na InfinitePay", details: ipData }),
        { status: 500 }
      );
    }

    await supabase.from("orders").update({ ip_checkout_url: ipData.url }).eq("id", orderId);

    return new Response(JSON.stringify({ url: ipData.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});

// ----------------------------------------------------------------------------
// Webhook (função separada "infinitepay-webhook", a criar quando for usar):
// A InfinitePay envia um POST para webhook_url quando o pagamento é concluído,
// com um payload como:
//   {
//     "invoice_slug":    "abc123",
//     "amount":          8990,
//     "paid_amount":     8990,
//     "installments":    1,
//     "capture_method":  "credit_card" | "pix",
//     "transaction_nsu": "UUID",
//     "order_nsu":       "<order.id enviado acima>",
//     "receipt_url":     "https://comprovante...",
//     "items": [...]
//   }
// Nessa função, responda 200 OK e atualize:
//   orders.status = 'pago'
//   orders.ip_invoice_slug = invoice_slug
// usando order_nsu para encontrar o pedido certo.
// Se você responder algo diferente de 200, a InfinitePay tenta reenviar.
// ----------------------------------------------------------------------------

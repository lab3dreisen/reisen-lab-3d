// ============================================================================
// REISEN LAB 3D — Edge Function: create-infinitepay-link
// ----------------------------------------------------------------------------
// Recebe o ID de um pedido já criado pelo checkout (orders.id), monta o
// payload com os itens do pedido e chama a API de Checkout Integrado da
// InfinitePay (POST /links) para gerar um link de pagamento (Pix ou cartão,
// com Pix sem taxa e cartão parcelado conforme configurado na sua conta
// InfinitePay). Salva a URL em orders.ip_checkout_url e devolve para o site,
// que redireciona o cliente até ela.
//
// Como publicar (painel do Supabase, sem precisar de terminal):
//   1. No Supabase, vá em Edge Functions > Create a new function.
//   2. Nome da função: create-infinitepay-link
//   3. Cole o conteúdo deste arquivo e clique em Deploy.
//   4. Nas configurações da função (Secrets/Environment variables), defina:
//        INFINITEPAY_HANDLE          = sua InfiniteTag, sem o "$" (ex.: reisenlab3d)
//        SUPABASE_URL                = a mesma URL do seu projeto (Settings > API)
//        SUPABASE_SERVICE_ROLE_KEY   = a "service_role" key (Settings > API — NUNCA
//                                       coloque essa chave no front-end/js/config.js)
//        SITE_URL                    = https://SEU-USUARIO.github.io/reisen-lab-3d
//
// Documentação oficial: https://ajuda.infinitepay.io/pt-BR/articles/10766888
// ============================================================================

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const INFINITEPAY_HANDLE = Deno.env.get("INFINITEPAY_HANDLE") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const SITE_URL = Deno.env.get("SITE_URL") ?? "https://SEU-SITE";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    if (!INFINITEPAY_HANDLE) {
      return new Response(JSON.stringify({ error: "INFINITEPAY_HANDLE não configurado nas secrets da função." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return new Response(JSON.stringify({ error: "orderId é obrigatório" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Pedido não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // Preço sempre em centavos (ex.: R$ 89,90 -> 8990).
    const linkBody = {
      handle: INFINITEPAY_HANDLE,
      redirect_url: `${SITE_URL}/pedido-confirmado.html?id=${order.id}`,
      webhook_url: `${SUPABASE_URL}/functions/v1/infinitepay-webhook`,
      order_nsu: order.id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone_number: order.customer_phone,
      },
      address: order.shipping_address
        ? {
            cep: order.shipping_address.cep,
            number: order.shipping_address.number,
            complement: order.shipping_address.complement || undefined,
          }
        : undefined,
      items: order.order_items.map((item: any) => ({
        quantity: item.quantity,
        price: Math.round(Number(item.unit_price) * 100),
        description: item.product_name,
      })),
    };

    console.log("Enviando para InfinitePay:", JSON.stringify(linkBody));

    const ipResponse = await fetch("https://api.checkout.infinitepay.io/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(linkBody),
    });

    const ipText = await ipResponse.text();
    console.log("Resposta da InfinitePay (status " + ipResponse.status + "):", ipText);

    let ipData: Record<string, any> = {};
    try {
      ipData = JSON.parse(ipText);
    } catch (_e) {
      ipData = { raw: ipText };
    }

    if (!ipResponse.ok || !ipData.url) {
      return new Response(
        JSON.stringify({ error: "Falha ao criar link de pagamento na InfinitePay", details: ipData }),
        { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    await supabase.from("orders").update({ ip_checkout_url: ipData.url }).eq("id", orderId);

    return new Response(JSON.stringify({ url: ipData.url }), {
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }
});

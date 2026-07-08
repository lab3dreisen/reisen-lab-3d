/**
 * Carrinho de compras — persistido em localStorage.
 * Estrutura: [{ id: 'p1', qty: 2 }, ...]
 */
const REISEN_CART_KEY = "reisen_cart_v1";

function reisenGetCart() {
  try {
    return JSON.parse(localStorage.getItem(REISEN_CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function reisenSaveCart(cart) {
  localStorage.setItem(REISEN_CART_KEY, JSON.stringify(cart));
  reisenUpdateCartBadge();
}

function reisenAddToCart(productId, qty) {
  qty = qty || 1;
  const cart = reisenGetCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  reisenSaveCart(cart);
}

function reisenUpdateQty(productId, qty) {
  let cart = reisenGetCart();
  qty = Math.max(1, parseInt(qty, 10) || 1);
  cart = cart.map((i) => (i.id === productId ? { ...i, qty: qty } : i));
  reisenSaveCart(cart);
}

function reisenRemoveFromCart(productId) {
  const cart = reisenGetCart().filter((i) => i.id !== productId);
  reisenSaveCart(cart);
}

function reisenClearCart() {
  localStorage.removeItem(REISEN_CART_KEY);
  reisenUpdateCartBadge();
}

function reisenCartItemsWithData() {
  return reisenGetCart()
    .map((item) => {
      const product = reisenGetProductById(item.id);
      if (!product) return null;
      return { ...item, product: product, subtotal: product.price * item.qty };
    })
    .filter(Boolean);
}

function reisenCartTotal() {
  return reisenCartItemsWithData().reduce((sum, i) => sum + i.subtotal, 0);
}

function reisenCartCount() {
  return reisenGetCart().reduce((sum, i) => sum + i.qty, 0);
}

function reisenUpdateCartBadge() {
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = reisenCartCount();
  });
}

document.addEventListener("DOMContentLoaded", reisenUpdateCartBadge);

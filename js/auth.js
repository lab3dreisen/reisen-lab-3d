/**
 * Autenticação de clientes via Supabase Auth (e-mail + senha).
 * Em modo demonstração (sem Supabase configurado), simula sessão
 * usando localStorage para o fluxo poder ser demonstrado sem backend.
 */
const REISEN_DEMO_SESSION_KEY = "reisen_demo_session_v1";

async function reisenGetSession() {
  if (window.REISEN_DEMO_MODE) {
    const raw = localStorage.getItem(REISEN_DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  const { data } = await window.reisenSupabase.auth.getSession();
  return data.session;
}

async function reisenSignUp({ name, email, phone, password }) {
  if (window.REISEN_DEMO_MODE) {
    const fakeSession = { user: { id: "demo-user", email, user_metadata: { full_name: name, phone } } };
    localStorage.setItem(REISEN_DEMO_SESSION_KEY, JSON.stringify(fakeSession));
    return { data: fakeSession, error: null };
  }
  const { data, error } = await window.reisenSupabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name, phone: phone } },
  });
  return { data, error };
}

async function reisenSignIn({ email, password }) {
  if (window.REISEN_DEMO_MODE) {
    const fakeSession = { user: { id: "demo-user", email, user_metadata: { full_name: "Cliente Demo" } } };
    localStorage.setItem(REISEN_DEMO_SESSION_KEY, JSON.stringify(fakeSession));
    return { data: fakeSession, error: null };
  }
  const { data, error } = await window.reisenSupabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function reisenSignOut() {
  if (window.REISEN_DEMO_MODE) {
    localStorage.removeItem(REISEN_DEMO_SESSION_KEY);
    return;
  }
  await window.reisenSupabase.auth.signOut();
}

/** Atualiza o botão "Conta" do header conforme sessão ativa. */
async function reisenReflectAuthInHeader() {
  const session = await reisenGetSession();
  const accountLink = document.querySelector("[data-account-link]");
  if (!accountLink) return;
  if (session && session.user) {
    accountLink.setAttribute("title", "Minha conta");
  }
}

document.addEventListener("DOMContentLoaded", reisenReflectAuthInHeader);

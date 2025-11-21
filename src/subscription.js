const STORAGE_KEY = 'lgames_subscription_expires_at';
const DEFAULT_DURATION_DAYS = 30;

export function saveSubscription(days = DEFAULT_DURATION_DAYS, startDate = new Date()) {
  try {
    const baseDate = startDate instanceof Date ? startDate : new Date(startDate);
    const expiresAt = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);
    localStorage.setItem(STORAGE_KEY, expiresAt.toISOString());
    return expiresAt;
  } catch (err) {
    console.warn('Não foi possível salvar a assinatura', err);
    return null;
  }
}

export function isExpired(expiresAt) {
  if (!expiresAt) return true;
  const expiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  return Number.isNaN(expiry.getTime()) || expiry.getTime() <= Date.now();
}

export function hasActiveSubscription() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    return !isExpired(stored);
  } catch (err) {
    console.warn('Não foi possível ler a assinatura', err);
    return false;
  }
}

export function requireSubscription({ gameId, redirectUrl = 'painel.html' } = {}) {
  if (hasActiveSubscription()) return true;
  if (typeof window === 'undefined') return false;

  const base = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  const url = new URL(redirectUrl, base);
  url.searchParams.set('expired', '1');
  if (gameId) url.searchParams.set('game', gameId);
  window.location.href = url.toString();
  return false;
}

// Expõe funções globalmente para ser usado por jogos ou pelo painel
if (typeof window !== 'undefined') {
  window.saveSubscription = saveSubscription;
  window.hasActiveSubscription = hasActiveSubscription;
  window.isExpired = isExpired;
  window.requireSubscription = requireSubscription;
  window.__SUBSCRIPTION_STORAGE_KEY = STORAGE_KEY;
}

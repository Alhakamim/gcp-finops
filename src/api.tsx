/// <reference types="vite/client" />

// ─── API Service ──────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_BASE || '';

let token: string | null = localStorage.getItem('token');

export function setToken(t: string | null) {
  token = t;
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
}

export function getToken(): string | null {
  return token;
}

export function isAuthenticated(): boolean {
  return !!token;
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/api${path}`, { ...options, headers });

  if (res.status === 401) {
    setToken(null);
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, name: string, password: string) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify({ email, name, password }) }),
  me: () => request('/auth/me'),
  users: () => request('/auth/users'),
};

// API Keys
export const apiKeys = {
  list: () => request('/keys'),
  create: (name: string) => request('/keys', { method: 'POST', body: JSON.stringify({ name }) }),
  delete: (id: string) => request(`/keys/${id}`, { method: 'DELETE' }),
};

// GCP Data
export const gcp = {
  billingAccounts: {
    list: () => request('/gcp/billing-accounts'),
    create: (name: string, account_id: string, provider?: string, description?: string) =>
      request('/gcp/billing-accounts', {
        method: 'POST',
        body: JSON.stringify({ name, account_id, provider, description }),
      }),
    setDefault: (id: string) =>
      request(`/gcp/billing-accounts/default/${id}`, { method: 'PUT' }),
    delete: (id: string) =>
      request(`/gcp/billing-accounts/${id}`, { method: 'DELETE' }),
  },
  costData: (accountId?: string, dateStart?: string, dateEnd?: string) =>
    request(`/gcp/cost-data?account=${accountId||''}&dateStart=${dateStart||''}&dateEnd=${dateEnd||''}`),
  budgets: (accountId?: string, dateStart?: string, dateEnd?: string) =>
    request(`/gcp/budgets?account=${accountId||''}&dateStart=${dateStart||''}&dateEnd=${dateEnd||''}`),
  auditLog: () => request('/gcp/audit-log'),
  projects: (accountId?: string, dateStart?: string, dateEnd?: string) =>
    request(`/gcp/projects?account=${accountId||''}&dateStart=${dateStart||''}&dateEnd=${dateEnd||''}`),
  updateCostData: (data: any, accountId?: string) =>
    request('/gcp/cost-data', { method: 'POST', body: JSON.stringify({ account: accountId, data }) }),
};

// Health
export const health = () => request('/health');

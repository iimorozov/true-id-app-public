import { toast } from 'react-toastify';

export async function fetchAPI<T>(url: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) throw new Error(`API request failed: ${response.status}`);

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) return response.json();

  return {} as T;
}

export async function loginByTrueIdApi(data: { token: string }, signal?: AbortSignal): Promise<void> {
  await fetchAPI('/api/auth/true-id-login', {
    method: 'POST',
    body: JSON.stringify(data),
    signal
  });

  toast('Successfully sign in', { type: 'success', theme: 'dark' });
}

export async function getOptions(signal?: AbortSignal): Promise<Record<string, any>> {
  return fetchAPI<Record<string, any>>('/api/portal/options', {
    method: 'GET',
    signal
  });
}

export async function logout(signal?: AbortSignal): Promise<Record<string, any>> {
  return fetchAPI<Record<string, any>>('/api/auth/logout', {
    method: 'POST',
    signal
  });
}

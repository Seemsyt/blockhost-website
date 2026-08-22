export const API_BASE_URL = 'http://52.63.135.144/api';

export const getAuthToken = () => localStorage.getItem('blockhost_token');
export const setAuthToken = (token: string) => localStorage.setItem('blockhost_token', token);
export const removeAuthToken = () => localStorage.removeItem('blockhost_token');

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, message: string, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = { detail: response.statusText };
    }
    const message = data.detail || 'API request failed';
    throw new ApiError(response.status, typeof message === 'string' ? message : JSON.stringify(message), data);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

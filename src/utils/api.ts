export const API_BASE_URL = 'http://52.63.135.144/api';

export const getAuthToken = () => localStorage.getItem('erex_token');
export const setAuthToken = (token: string) => localStorage.setItem('erex_token', token);
export const removeAuthToken = () => localStorage.removeItem('erex_token');

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
    let message = data.detail || 'API request failed';
    
    // Friendly error translation
    if (response.status === 402) {
      message = 'Payment Required: Your subscription has expired or a free trial ended. Please update your billing information to continue.';
    } else if (response.status === 503) {
      if (typeof message === 'string' && message.includes('StartLimitBurst')) {
        message = 'Crash Limit Reached: The server crashed too many times in a row. Please check your logs or mods before trying again.';
      } else {
        message = 'Server is currently unavailable or migrating. Please try again in a few moments.';
      }
    }

    throw new ApiError(response.status, typeof message === 'string' ? message : JSON.stringify(message), data);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

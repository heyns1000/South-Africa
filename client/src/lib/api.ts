import type { ApiResponse } from '@shared/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for session cookies
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async updateProfile(data: { name?: string; email?: string }) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Product endpoints
  async getProducts(params?: { category?: string; search?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());

    return this.request(`/api/products?${query.toString()}`);
  }

  async getProduct(id: number) {
    return this.request(`/api/products/${id}`);
  }

  // Order endpoints
  async getOrders() {
    return this.request('/api/orders');
  }

  async getOrder(id: number) {
    return this.request(`/api/orders/${id}`);
  }

  async createOrder(data: {
    items: { productId: number; quantity: number }[];
    shippingAddress: string;
    paymentMethod: 'paypal' | 'payfast';
  }) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(orderId: number, status: string, paymentId?: string) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, paymentId }),
    });
  }

  // Payment endpoints
  async createPayPalOrder(orderId: number) {
    return this.request('/api/payments/paypal/create', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async capturePayPalOrder(orderId: string, paypalOrderId: string) {
    return this.request('/api/payments/paypal/capture', {
      method: 'POST',
      body: JSON.stringify({ orderId, paypalOrderId }),
    });
  }

  async createPayFastPayment(orderId: number) {
    return this.request('/api/payments/payfast/create', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }
}

export const api = new ApiClient();

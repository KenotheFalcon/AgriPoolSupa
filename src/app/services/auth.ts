import axios, { AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'farmer';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

class AuthService {
  private static instance: AuthService;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async request<T>(endpoint: string, options: AxiosRequestConfig = {}): Promise<T> {
    try {
      const response = await axios({
        url: `${this.baseURL}${endpoint}`,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
      throw new Error(message);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      data: credentials,
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      data: credentials,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      data: { token, password },
    });
  }

  async verifyEmail(token: string): Promise<void> {
    return this.request('/auth/verify-email', {
      method: 'POST',
      data: { token },
    });
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }
}

export const authService = AuthService.getInstance();

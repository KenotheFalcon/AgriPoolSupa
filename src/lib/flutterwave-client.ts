// Flutterwave API client for AgriPool NG
// This would integrate with Flutterwave's API for payment processing

import axios from 'axios';

export interface FlutterwavePaymentParams {
  amount: number;
  currency: string;
  customer: {
    email: string;
    name?: string;
    phoneNumber?: string;
  };
  redirectUrl: string;
  meta: {
    groupId: string;
    buyerId: string;
    unitsPurchased: number;
  };
}

export interface FlutterwaveEscrowParams {
  amount: number;
  currency: string;
  beneficiaries: {
    id: string;
    amount: number;
    split_type: 'percentage' | 'flat';
  }[];
}

export interface FlutterwaveResponse {
  status: string;
  message: string;
  data?: any;
}

export class FlutterwaveClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.flutterwave.com/v3') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async initiatePayment(params: FlutterwavePaymentParams): Promise<FlutterwaveResponse> {
    const url = `${this.baseUrl}/payments`;
    const tx_ref = `agripool-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    try {
      const response = await axios.post(
        url,
        {
          ...params,
          // Include AgriPool specific configurations
          payment_options: 'card,banktransfer,ussd',
          payment_plan: null,
          tx_ref,
          public_key: this.apiKey,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return { ...response.data, tx_ref };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to initiate payment',
      };
    }
  }

  async createEscrow(params: FlutterwaveEscrowParams): Promise<FlutterwaveResponse> {
    const url = `${this.baseUrl}/escrow`;
    try {
      const response = await axios.post(
        url,
        {
          ...params,
          tx_ref: `agripool-escrow-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to create escrow',
      };
    }
  }

  async verifyTransaction(transactionId: string): Promise<FlutterwaveResponse> {
    const url = `${this.baseUrl}/transactions/${transactionId}/verify`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to verify transaction',
      };
    }
  }

  async releaseEscrow(escrowId: string): Promise<FlutterwaveResponse> {
    const url = `${this.baseUrl}/escrow/${escrowId}/release`;
    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to release escrow',
      };
    }
  }
}

// Export a singleton instance for use throughout the application
export const createFlutterwaveClient = (apiKey: string) => {
  return new FlutterwaveClient(apiKey);
};

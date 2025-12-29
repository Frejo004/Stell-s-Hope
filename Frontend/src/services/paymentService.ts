import api from './api';

export interface PaymentInitiateData {
    amount?: number;
    order_id?: number | string;
    currency?: string;
    customer_email?: string;
    customer_name?: string;
}

export interface PaymentResponse {
    checkout_url: string;
    payment_id: string;
    // Ajoutez d'autres champs retournés par Moneroo si nécessaire
}

export const paymentService = {
    initiatePayment: async (data: PaymentInitiateData): Promise<PaymentResponse> => {
        const response = await api.post<PaymentResponse>('/payment/initiate', data);
        return response.data;
    },
};

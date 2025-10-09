import api from './api';

export interface CreateTicketData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export const ticketService = {
  getTickets: async () => {
    const response = await api.get('/tickets');
    return response.data;
  },

  createTicket: async (data: CreateTicketData) => {
    const response = await api.post('/tickets', data);
    return response.data;
  },

  getTicket: async (id: number) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  }
};
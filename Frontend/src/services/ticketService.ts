import api from './api';

export interface TicketData {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export const ticketService = {
  async getTickets() {
    const response = await api.get('/tickets');
    return response.data;
  },

  async getTicket(id: number) {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  async createTicket(data: TicketData) {
    const response = await api.post('/tickets', data);
    return response.data;
  }
};
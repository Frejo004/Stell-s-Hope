export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export const errorService = {
  handleApiError: (error: any): ApiError => {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Erreur serveur',
        status: error.response.status,
        errors: error.response.data?.errors
      };
    }
    
    if (error.request) {
      return {
        message: 'Erreur de connexion au serveur',
        status: 0
      };
    }
    
    return {
      message: error.message || 'Erreur inconnue',
      status: 0
    };
  },

  getValidationErrors: (error: ApiError): Record<string, string> => {
    if (!error.errors) return {};
    
    const validationErrors: Record<string, string> = {};
    Object.entries(error.errors).forEach(([field, messages]) => {
      validationErrors[field] = messages[0];
    });
    
    return validationErrors;
  }
};
import { BUSINESS_CONSTANTS, REGEX_PATTERNS } from '../constants';

// Utilitaires de formatage
export const formatters = {
  // Formatage de prix
  price: (amount: number, currency = BUSINESS_CONSTANTS.CURRENCY_SYMBOL): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: BUSINESS_CONSTANTS.CURRENCY,
      minimumFractionDigits: 2
    }).format(amount);
  },

  // Formatage de date
  date: (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    }).format(dateObj);
  },

  // Formatage de date relative
  relativeDate: (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    
    return formatters.date(dateObj);
  },

  // Formatage de numéro de téléphone
  phone: (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  }
};

// Utilitaires de validation
export const validators = {
  email: (email: string): boolean => REGEX_PATTERNS.EMAIL.test(email),
  phone: (phone: string): boolean => REGEX_PATTERNS.PHONE.test(phone),
  postalCode: (code: string): boolean => REGEX_PATTERNS.POSTAL_CODE.test(code),
  password: (password: string): boolean => REGEX_PATTERNS.PASSWORD.test(password),
  
  required: (value: any): boolean => {
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== undefined;
  },

  minLength: (value: string, min: number): boolean => value.length >= min,
  maxLength: (value: string, max: number): boolean => value.length <= max,
  
  isPositiveNumber: (value: number): boolean => typeof value === 'number' && value > 0,
  isInRange: (value: number, min: number, max: number): boolean => value >= min && value <= max
};

// Utilitaires de manipulation de chaînes
export const stringUtils = {
  capitalize: (str: string): string => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),
  
  truncate: (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  },
  
  slugify: (str: string): string => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },
  
  removeAccents: (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },
  
  generateId: (prefix = ''): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${prefix}${timestamp}${random}`;
  }
};

// Utilitaires de manipulation d'arrays
export const arrayUtils = {
  unique: <T>(array: T[]): T[] => [...new Set(array)],
  
  groupBy: <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },
  
  sortBy: <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
    return [...array].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  },
  
  chunk: <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  shuffle: <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

// Utilitaires de localStorage sécurisé
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return defaultValue || null;
    }
  },
  
  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'écriture de ${key}:`, error);
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage:', error);
      return false;
    }
  }
};

// Utilitaires de debounce et throttle
export const timing = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Utilitaires de calcul e-commerce
export const commerce = {
  calculateDiscount: (originalPrice: number, discountPercent: number): number => {
    return originalPrice * (discountPercent / 100);
  },
  
  calculateDiscountedPrice: (originalPrice: number, discountPercent: number): number => {
    return originalPrice - commerce.calculateDiscount(originalPrice, discountPercent);
  },
  
  calculateTax: (price: number, taxRate = BUSINESS_CONSTANTS.VAT_RATE): number => {
    return price * taxRate;
  },
  
  calculatePriceWithTax: (price: number, taxRate = BUSINESS_CONSTANTS.VAT_RATE): number => {
    return price * (1 + taxRate);
  },
  
  calculateShipping: (total: number): number => {
    return total >= BUSINESS_CONSTANTS.FREE_SHIPPING_THRESHOLD ? 0 : BUSINESS_CONSTANTS.SHIPPING_COST;
  },
  
  calculateCartTotal: (items: Array<{ price: number; quantity: number }>): number => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
};

// Utilitaires de gestion d'erreurs
export const errorUtils = {
  getErrorMessage: (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return 'Une erreur inattendue s\'est produite';
  },
  
  isNetworkError: (error: any): boolean => {
    return !error.response && error.code !== 'ECONNABORTED';
  },
  
  isTimeoutError: (error: any): boolean => {
    return error.code === 'ECONNABORTED';
  }
};

// Export par défaut avec tous les utilitaires
export default {
  formatters,
  validators,
  stringUtils,
  arrayUtils,
  storage,
  timing,
  commerce,
  errorUtils
};
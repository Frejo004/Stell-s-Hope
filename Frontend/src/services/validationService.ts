export interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

export const validationService = {
  validateField: (value: any, rules: ValidationRule): string | null => {
    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Ce champ est requis';
    }

    if (value && rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email invalide';
    }

    if (value && rules.minLength && value.toString().length < rules.minLength) {
      return `Minimum ${rules.minLength} caractères`;
    }

    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      return `Maximum ${rules.maxLength} caractères`;
    }

    if (value && rules.pattern && !rules.pattern.test(value)) {
      return 'Format invalide';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  },

  validateForm: (data: Record<string, any>, schema: ValidationSchema): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.entries(schema).forEach(([field, rules]) => {
      const error = validationService.validateField(data[field], rules);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }
};
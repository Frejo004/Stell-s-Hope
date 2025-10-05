import { useState } from 'react';

// Validation utilities for forms
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || value.toString().trim() === '')) {
    return 'Ce champ est requis';
  }

  // Skip other validations if value is empty and not required
  if (!value || value.toString().trim() === '') {
    return null;
  }

  // Min length validation
  if (rules.minLength && value.toString().length < rules.minLength) {
    return `Minimum ${rules.minLength} caractères requis`;
  }

  // Max length validation
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    return `Maximum ${rules.maxLength} caractères autorisés`;
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    return 'Format invalide';
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
};

export const validateForm = (data: any, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach(field => {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Format d\'email invalide';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (value.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères';
      }
      if (!/(?=.*[a-z])/.test(value)) {
        return 'Le mot de passe doit contenir au moins une minuscule';
      }
      if (!/(?=.*[A-Z])/.test(value)) {
        return 'Le mot de passe doit contenir au moins une majuscule';
      }
      if (!/(?=.*\d)/.test(value)) {
        return 'Le mot de passe doit contenir au moins un chiffre';
      }
      return null;
    }
  },
  phone: {
    pattern: /^[0-9+\-\s()]+$/,
    custom: (value: string) => {
      if (value && !/^[0-9+\-\s()]+$/.test(value)) {
        return 'Format de téléphone invalide';
      }
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    custom: (value: string) => {
      if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(value)) {
        return 'Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets';
      }
      return null;
    }
  }
};

// Form validation hooks
export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValid, setIsValid] = useState(false);

  const validate = (data: any) => {
    const validationErrors = validateForm(data, rules);
    setErrors(validationErrors);
    setIsValid(Object.keys(validationErrors).length === 0);
    return validationErrors;
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  const getFieldError = (field: string) => errors[field] || null;

  return {
    errors,
    isValid,
    validate,
    clearErrors,
    getFieldError
  };
};


import { HistoricalFormData, FormErrors } from './types';

export const validateHistoricalForm = (formData: HistoricalFormData): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.propertyId) {
    errors.propertyId = 'Selecciona una propiedad';
  }
  
  if (!formData.description.trim()) {
    errors.description = 'La descripción es obligatoria';
  }
  
  if ((formData.type === 'income' || formData.type === 'expense') && formData.amount <= 0) {
    errors.amount = 'El importe debe ser mayor que 0';
  }

  return errors;
};

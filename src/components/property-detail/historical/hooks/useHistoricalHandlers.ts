
import { Property } from '@/types/property';
import { useHistoricalPayments } from './useHistoricalPayments';
import { useHistoricalInventory } from './useHistoricalInventory';
import { useHistoricalTasks } from './useHistoricalTasks';
import { useHistoricalDocuments } from './useHistoricalDocuments';

export const useHistoricalHandlers = (
  property: Property, 
  year: number,
  historicalProperty: Property | null,
  setHistoricalProperty: (property: Property) => void
) => {
  const {
    handleHistoricalPaymentUpdate,
    handleRentPaidChange
  } = useHistoricalPayments(property, year, historicalProperty, setHistoricalProperty);

  const {
    handleHistoricalInventoryAdd,
    handleHistoricalInventoryEdit,
    handleHistoricalInventoryDelete
  } = useHistoricalInventory(property, year, historicalProperty, setHistoricalProperty);

  const {
    handleHistoricalTaskAdd,
    handleHistoricalTaskToggle,
    handleHistoricalTaskDelete,
    handleHistoricalTaskUpdate
  } = useHistoricalTasks(property, year, historicalProperty, setHistoricalProperty);

  const {
    handleHistoricalDocumentAdd,
    handleHistoricalDocumentDelete,
    handleHistoricalExpenseDelete
  } = useHistoricalDocuments(property, year, historicalProperty, setHistoricalProperty);

  return {
    handleHistoricalPaymentUpdate,
    handleHistoricalInventoryAdd,
    handleHistoricalInventoryEdit,
    handleHistoricalInventoryDelete,
    handleHistoricalTaskAdd,
    handleHistoricalTaskToggle,
    handleHistoricalTaskDelete,
    handleHistoricalTaskUpdate,
    handleHistoricalDocumentAdd,
    handleHistoricalDocumentDelete,
    handleHistoricalExpenseDelete,
    handleRentPaidChange
  };
};

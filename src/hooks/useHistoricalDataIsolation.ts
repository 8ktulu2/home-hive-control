
import { useState } from 'react';
import { Property, InventoryItem, Task, Document } from '@/types/property';
import { toast } from 'sonner';

export interface HistoricalInventoryItem extends InventoryItem {
  year: number;
  isDeductible?: boolean;
}

export interface HistoricalTask extends Task {
  year: number;
}

export interface HistoricalDocument extends Document {
  year: number;
}

export const useHistoricalDataIsolation = () => {
  // Get historical inventory for a specific property and year
  const getHistoricalInventory = (propertyId: string, year: number): HistoricalInventoryItem[] => {
    try {
      const stored = localStorage.getItem(`historicalInventory_${propertyId}_${year}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading historical inventory:', error);
      return [];
    }
  };

  // Save historical inventory for a specific property and year
  const saveHistoricalInventory = (propertyId: string, year: number, items: HistoricalInventoryItem[]): boolean => {
    try {
      localStorage.setItem(`historicalInventory_${propertyId}_${year}`, JSON.stringify(items));
      return true;
    } catch (error) {
      console.error('Error saving historical inventory:', error);
      toast.error('Error al guardar el inventario histórico');
      return false;
    }
  };

  // Add inventory item to historical year
  const addHistoricalInventoryItem = (propertyId: string, year: number, item: Omit<InventoryItem, 'id'>): HistoricalInventoryItem => {
    const existingItems = getHistoricalInventory(propertyId, year);
    const newItem: HistoricalInventoryItem = {
      ...item,
      id: `hist-inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      year,
      isDeductible: true // Default to deductible
    };
    
    const updatedItems = [...existingItems, newItem];
    saveHistoricalInventory(propertyId, year, updatedItems);
    
    return newItem;
  };

  // Update historical inventory item
  const updateHistoricalInventoryItem = (propertyId: string, year: number, itemId: string, updates: Partial<HistoricalInventoryItem>): boolean => {
    const existingItems = getHistoricalInventory(propertyId, year);
    const updatedItems = existingItems.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    
    return saveHistoricalInventory(propertyId, year, updatedItems);
  };

  // Delete historical inventory item
  const deleteHistoricalInventoryItem = (propertyId: string, year: number, itemId: string): boolean => {
    const existingItems = getHistoricalInventory(propertyId, year);
    const updatedItems = existingItems.filter(item => item.id !== itemId);
    
    return saveHistoricalInventory(propertyId, year, updatedItems);
  };

  // Get historical tasks for a specific property and year
  const getHistoricalTasks = (propertyId: string, year: number): HistoricalTask[] => {
    try {
      const stored = localStorage.getItem(`historicalTasks_${propertyId}_${year}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading historical tasks:', error);
      return [];
    }
  };

  // Save historical tasks for a specific property and year
  const saveHistoricalTasks = (propertyId: string, year: number, tasks: HistoricalTask[]): boolean => {
    try {
      localStorage.setItem(`historicalTasks_${propertyId}_${year}`, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving historical tasks:', error);
      toast.error('Error al guardar las tareas históricas');
      return false;
    }
  };

  return {
    getHistoricalInventory,
    saveHistoricalInventory,
    addHistoricalInventoryItem,
    updateHistoricalInventoryItem,
    deleteHistoricalInventoryItem,
    getHistoricalTasks,
    saveHistoricalTasks
  };
};

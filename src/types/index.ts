// Student type matching database schema
export interface Student {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  start_date: string;
  created_at: string;
  updated_at: string;
  last_payment_amount: number | null;
  last_payment_date: string | null;
}

// Meal type enum
export type MealType = 'mini' | 'full' | 'special';

// Add-on type
export interface AddOn {
  name: string;
  quantity: number;
  price: number;
}

// Predefined add-ons
export const ADDON_OPTIONS = [
  { name: 'Extra Chapati', defaultPrice: 10 },
  { name: 'Extra Sabji', defaultPrice: 20 },
  { name: 'Extra Rice', defaultPrice: 15 },
];

// Meal record type
export interface Meal {
  id: string;
  student_id: string;
  meal_type: MealType;
  amount: number;
  meal_date: string;
  created_at: string;
  notes: string | null;
  addons: AddOn[];
}

// Meal pricing configuration
export const MEAL_PRICES: Record<MealType, number> = {
  mini: 80,
  full: 95,
  special: 110,
};

// Meal display names
export const MEAL_NAMES: Record<MealType, string> = {
  mini: 'Mini Meal',
  full: 'Full Meal',
  special: 'Special Meal',
};

// Billing summary type
export interface BillingSummary {
  student: Student;
  month: string;
  year: number;
  meals: Meal[];
  mealCounts: Record<MealType, number>;
  mealTotals: Record<MealType, number>;
  totalMeals: number;
  totalAmount: number;
  addonsTotal: number;
}

// Mess configuration - stored in localStorage
export interface MessConfig {
  name: string;
  contact: string;
  address: string;
  upiId: string;
}

export const DEFAULT_MESS_CONFIG: MessConfig = {
  name: 'TiffinTracker Mess',
  contact: '+91 98765 43210',
  address: '123 Food Street, City',
  upiId: 'tiffintracker@upi',
};

// Get mess config from localStorage or use default
export function getMessConfig(): MessConfig {
  const stored = localStorage.getItem('messConfig');
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_MESS_CONFIG;
}

// Save mess config to localStorage
export function saveMessConfig(config: MessConfig) {
  localStorage.setItem('messConfig', JSON.stringify(config));
}

// Legacy export for backwards compatibility
export const MESS_CONFIG = DEFAULT_MESS_CONFIG;

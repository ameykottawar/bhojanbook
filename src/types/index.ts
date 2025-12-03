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
}

// Meal type enum
export type MealType = 'mini' | 'full' | 'special';

// Meal record type
export interface Meal {
  id: string;
  student_id: string;
  meal_type: MealType;
  amount: number;
  meal_date: string;
  created_at: string;
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
}

// Mess configuration
export const MESS_CONFIG = {
  name: 'TiffinTracker Mess',
  contact: '+91 98765 43210',
  address: '123 Food Street, City',
  upiId: 'tiffintracker@upi',
};

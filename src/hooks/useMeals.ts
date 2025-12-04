import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meal, MealType, MEAL_PRICES, AddOn } from '@/types';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Helper to parse meal data from DB
const parseMeal = (data: any): Meal => ({
  ...data,
  addons: Array.isArray(data.addons) ? data.addons : [],
});

// Fetch meals for a student
export function useStudentMeals(studentId: string | undefined, month?: string, year?: number) {
  return useQuery({
    queryKey: ['meals', studentId, month, year],
    queryFn: async () => {
      if (!studentId) return [];
      
      let query = supabase
        .from('meals')
        .select('*')
        .eq('student_id', studentId);
      
      if (month && year) {
        const startDate = `${year}-${month.padStart(2, '0')}-01`;
        const endDate = new Date(year, parseInt(month), 0).toISOString().split('T')[0];
        query = query.gte('meal_date', startDate).lte('meal_date', endDate);
      }
      
      const { data, error } = await query.order('meal_date', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(parseMeal);
    },
    enabled: !!studentId,
  });
}

// Fetch meals for a student in a specific month (legacy)
export function useMonthlyMeals(studentId: string | undefined, year: number, month: number) {
  return useStudentMeals(studentId, month.toString().padStart(2, '0'), year);
}

// Create meal (punch meal)
export function useCreateMeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      student_id, 
      meal_type, 
      meal_date,
      notes,
      addons,
      amount: customAmount,
    }: { 
      student_id: string | null; 
      meal_type: MealType;
      meal_date?: string;
      notes?: string | null;
      addons?: AddOn[];
      amount?: number;
    }) => {
      const baseAmount = MEAL_PRICES[meal_type];
      const addonsTotal = (addons || []).reduce((sum, a) => sum + a.quantity * a.price, 0);
      const amount = customAmount ?? (baseAmount + addonsTotal);
      
      const insertData: any = {
        student_id,
        meal_type,
        amount,
        meal_date: meal_date || new Date().toISOString().split('T')[0],
        notes: notes || null,
        addons: (addons || []) as unknown as Json,
      };
      
      const { data, error } = await supabase
        .from('meals')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      toast.success('Meal punched successfully');
    },
    onError: (error) => {
      toast.error('Failed to punch meal: ' + error.message);
    },
  });
}

// Update meal
export function useUpdateMeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, meal_type, meal_date, notes, addons }: { 
      id: string;
      meal_type: MealType;
      meal_date: string;
      notes?: string | null;
      addons?: AddOn[];
    }) => {
      const baseAmount = MEAL_PRICES[meal_type];
      const addonsTotal = (addons || []).reduce((sum, a) => sum + a.quantity * a.price, 0);
      const amount = baseAmount + addonsTotal;
      
      const updateData: any = { 
        meal_type, 
        amount, 
        meal_date,
        notes: notes || null,
        addons: (addons || []) as unknown as Json,
      };
      
      const { data, error } = await supabase
        .from('meals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      toast.success('Meal updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update meal: ' + error.message);
    },
  });
}

// Delete meal
export function useDeleteMeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      toast.success('Meal deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete meal: ' + error.message);
    },
  });
}

// Get today's meals count
export function useTodayMeals() {
  const today = new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['meals', 'today', today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('meal_date', today);
      
      if (error) throw error;
      return (data || []).map(parseMeal);
    },
  });
}

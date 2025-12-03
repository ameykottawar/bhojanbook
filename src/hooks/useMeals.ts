import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meal, MealType, MEAL_PRICES } from '@/types';
import { toast } from 'sonner';

// Fetch meals for a student
export function useStudentMeals(studentId: string | undefined) {
  return useQuery({
    queryKey: ['meals', studentId],
    queryFn: async () => {
      if (!studentId) return [];
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('student_id', studentId)
        .order('meal_date', { ascending: false });
      
      if (error) throw error;
      return data as Meal[];
    },
    enabled: !!studentId,
  });
}

// Fetch meals for a student in a specific month
export function useMonthlyMeals(studentId: string | undefined, year: number, month: number) {
  return useQuery({
    queryKey: ['meals', studentId, year, month],
    queryFn: async () => {
      if (!studentId) return [];
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('student_id', studentId)
        .gte('meal_date', startDate.toISOString().split('T')[0])
        .lte('meal_date', endDate.toISOString().split('T')[0])
        .order('meal_date');
      
      if (error) throw error;
      return data as Meal[];
    },
    enabled: !!studentId,
  });
}

// Create meal (punch meal)
export function useCreateMeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ student_id, meal_type, meal_date }: { 
      student_id: string; 
      meal_type: MealType;
      meal_date?: string;
    }) => {
      const amount = MEAL_PRICES[meal_type];
      const { data, error } = await supabase
        .from('meals')
        .insert({
          student_id,
          meal_type,
          amount,
          meal_date: meal_date || new Date().toISOString().split('T')[0],
        })
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
    mutationFn: async ({ id, meal_type, meal_date }: { 
      id: string;
      meal_type: MealType;
      meal_date: string;
    }) => {
      const amount = MEAL_PRICES[meal_type];
      const { data, error } = await supabase
        .from('meals')
        .update({ meal_type, amount, meal_date })
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
      return data as Meal[];
    },
  });
}

import { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStudents } from '@/hooks/useStudents';
import { useMonthlyMeals } from '@/hooks/useMeals';
import { StudentSelector } from '@/components/meals/StudentSelector';
import { MonthSelector } from '@/components/billing/MonthSelector';
import { BillingSummaryCard } from '@/components/billing/BillingSummaryCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BillingSummary, MealType, MEAL_PRICES } from '@/types';
import { Receipt } from 'lucide-react';
import { format } from 'date-fns';

export default function BillingPage() {
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  
  const currentMonth = format(new Date(), 'yyyy-MM');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [year, month] = selectedMonth.split('-').map(Number);
  const { data: meals = [], isLoading: mealsLoading } = useMonthlyMeals(
    selectedStudentId ?? undefined,
    year,
    month
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Calculate billing summary
  const summary = useMemo<BillingSummary | null>(() => {
    if (!selectedStudent || meals.length === 0) return null;

    const mealCounts: Record<MealType, number> = { mini: 0, full: 0, special: 0 };
    const mealTotals: Record<MealType, number> = { mini: 0, full: 0, special: 0 };

    meals.forEach((meal) => {
      mealCounts[meal.meal_type]++;
      mealTotals[meal.meal_type] += meal.amount;
    });

    const addonsTotal = meals.reduce((sum, m) => {
      const addonsSum = (m.addons || []).reduce((a, addon) => a + addon.quantity * addon.price, 0);
      return sum + addonsSum;
    }, 0);

    return {
      student: selectedStudent,
      month: String(month).padStart(2, '0'),
      year,
      meals,
      mealCounts,
      mealTotals,
      totalMeals: meals.length,
      totalAmount: meals.reduce((sum, m) => sum + m.amount, 0),
      addonsTotal,
    };
  }, [selectedStudent, meals, month, year]);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Billing</h1>
          <p className="text-muted-foreground">Generate monthly invoices for students</p>
        </div>

        {/* Step 1: Select Student */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
              Select Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="h-40 bg-secondary/50 rounded-lg animate-pulse" />
            ) : students.length > 0 ? (
              <StudentSelector
                students={students}
                selectedId={selectedStudentId}
                onSelect={setSelectedStudentId}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No students registered yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Select Month */}
        {selectedStudentId && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Select Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
            </CardContent>
          </Card>
        )}

        {/* Step 3: View Summary */}
        {selectedStudentId && selectedMonth && (
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            {mealsLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="h-60 bg-secondary/50 rounded-lg animate-pulse" />
                </CardContent>
              </Card>
            ) : summary ? (
              <BillingSummaryCard summary={summary} />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No meals recorded for this month</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

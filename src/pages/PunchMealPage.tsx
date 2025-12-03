import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStudents } from '@/hooks/useStudents';
import { useCreateMeal } from '@/hooks/useMeals';
import { StudentSelector } from '@/components/meals/StudentSelector';
import { MealButtons } from '@/components/meals/MealButtons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MealType, MEAL_NAMES, MEAL_PRICES } from '@/types';
import { CheckCircle, UtensilsCrossed } from 'lucide-react';
import { format } from 'date-fns';

export default function PunchMealPage() {
  const { data: students = [], isLoading } = useStudents();
  const createMeal = useCreateMeal();
  
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  const handlePunchMeal = async () => {
    if (!selectedStudentId || !selectedMealType) return;
    
    await createMeal.mutateAsync({
      student_id: selectedStudentId,
      meal_type: selectedMealType,
      meal_date: mealDate,
    });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedMealType(null);
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Punch Meal</h1>
          <p className="text-muted-foreground">Record a meal for a student</p>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="text-center animate-scale-in">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success mb-4">
                <CheckCircle className="h-10 w-10 text-success-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Meal Punched!</h2>
              <p className="text-muted-foreground">
                {selectedStudent?.name} - {selectedMealType && MEAL_NAMES[selectedMealType]}
              </p>
            </div>
          </div>
        )}

        {/* Step 1: Select Student */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
              Select Student
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-40 bg-secondary/50 rounded-lg animate-pulse" />
            ) : students.length > 0 ? (
              <StudentSelector
                students={students}
                selectedId={selectedStudentId}
                onSelect={setSelectedStudentId}
              />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <UtensilsCrossed className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No students registered yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Select Meal & Date */}
        {selectedStudentId && (
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                Select Meal Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Student Info */}
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="font-medium text-foreground">{selectedStudent?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedStudent?.phone}</p>
              </div>

              {/* Date Selector */}
              <div className="space-y-2">
                <Label htmlFor="meal_date">Meal Date</Label>
                <Input
                  id="meal_date"
                  type="date"
                  value={mealDate}
                  onChange={(e) => setMealDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Meal Type Buttons */}
              <MealButtons
                onSelect={setSelectedMealType}
                selectedType={selectedMealType ?? undefined}
                disabled={createMeal.isPending}
              />

              {/* Punch Button */}
              {selectedMealType && (
                <div className="pt-4 animate-fade-in">
                  <div className="p-4 bg-primary/10 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">Selected:</span>
                      <span className="font-semibold text-primary">
                        {MEAL_NAMES[selectedMealType]} - ₹{MEAL_PRICES[selectedMealType]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-foreground">Date:</span>
                      <span className="text-muted-foreground">
                        {format(new Date(mealDate), 'dd MMM yyyy')}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handlePunchMeal}
                    disabled={createMeal.isPending}
                    size="xl"
                    className="w-full"
                  >
                    {createMeal.isPending ? 'Punching...' : 'Confirm & Punch Meal'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

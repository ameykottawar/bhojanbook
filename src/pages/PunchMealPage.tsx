import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useStudents } from '@/hooks/useStudents';
import { useCreateMeal } from '@/hooks/useMeals';
import { StudentSelector } from '@/components/meals/StudentSelector';
import { MealButtons } from '@/components/meals/MealButtons';
import { AddOnsSelector } from '@/components/meals/AddOnsSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MealType, MEAL_PRICES, AddOn } from '@/types';
import { CheckCircle, UtensilsCrossed, User, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PunchMealPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'normal' ? 'normal' : 'registered';
  
  const { data: students = [], isLoading } = useStudents();
  const createMeal = useCreateMeal();
  
  const [mode, setMode] = useState<'normal' | 'registered'>(initialMode);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [mealDate, setMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [addons, setAddons] = useState<AddOn[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Normal billing customer name
  const [customerName, setCustomerName] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  
  // Calculate totals
  const mealAmount = selectedMealType ? MEAL_PRICES[selectedMealType] : 0;
  const addonsTotal = addons.reduce((sum, a) => sum + a.quantity * a.price, 0);
  const totalAmount = mealAmount + addonsTotal;

  const handlePunchMeal = async () => {
    if (!selectedMealType) return;
    
    if (mode === 'registered' && !selectedStudentId) return;

    await createMeal.mutateAsync({
      student_id: mode === 'registered' ? selectedStudentId! : null,
      meal_type: selectedMealType,
      meal_date: mealDate,
      notes: notes || null,
      addons: addons.length > 0 ? addons : [],
      amount: totalAmount,
    });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedMealType(null);
      setNotes('');
      setAddons([]);
      if (mode === 'normal') {
        setCustomerName('');
      }
    }, 2000);
  };

  const resetForm = () => {
    setSelectedStudentId(null);
    setSelectedMealType(null);
    setNotes('');
    setAddons([]);
    setCustomerName('');
  };

  useEffect(() => {
    resetForm();
  }, [mode]);

  const canPunch = mode === 'registered' 
    ? selectedStudentId && selectedMealType 
    : selectedMealType;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('punch.title')}</h1>
          <p className="text-muted-foreground">{t('punch.subtitle')}</p>
        </div>

        {/* Success Overlay */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="text-center animate-scale-in">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success mb-4">
                <CheckCircle className="h-10 w-10 text-success-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{t('punch.success')}</h2>
              <p className="text-muted-foreground">
                {mode === 'registered' ? selectedStudent?.name : customerName || 'Customer'} - {selectedMealType && t(`meal.${selectedMealType}`)}
              </p>
              <p className="text-lg font-semibold text-primary mt-2">₹{totalAmount}</p>
            </div>
          </div>
        )}

        {/* Mode Tabs */}
        <Tabs value={mode} onValueChange={(v) => setMode(v as 'normal' | 'registered')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="normal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {t('home.normalBilling')}
            </TabsTrigger>
            <TabsTrigger value="registered" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('home.registeredStudents')}
            </TabsTrigger>
          </TabsList>

          {/* Normal Billing Tab */}
          <TabsContent value="normal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">1</span>
                  Customer Info (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    placeholder="Walk-in customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Meal Selection for Normal */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">2</span>
                  Select Meal & Add-ons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Selector */}
                <div className="space-y-2">
                  <Label htmlFor="meal_date_normal">Date</Label>
                  <Input
                    id="meal_date_normal"
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

                {/* Add-ons */}
                <AddOnsSelector selectedAddons={addons} onChange={setAddons} />

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes_normal">Notes (Optional)</Label>
                  <Textarea
                    id="notes_normal"
                    placeholder="e.g., less spicy, extra gravy, late delivery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Punch Button */}
                {selectedMealType && (
                  <div className="pt-4 animate-fade-in">
                    <div className="p-4 bg-primary/10 rounded-lg mb-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">Meal:</span>
                        <span className="font-semibold">
                          {t(`meal.${selectedMealType}`)} - ₹{MEAL_PRICES[selectedMealType]}
                        </span>
                      </div>
                      {addonsTotal > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Add-ons:</span>
                          <span className="font-semibold">₹{addonsTotal}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center border-t border-border pt-2">
                        <span className="text-foreground font-medium">Total:</span>
                        <span className="font-bold text-primary text-lg">₹{totalAmount}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handlePunchMeal}
                      disabled={createMeal.isPending}
                      size="xl"
                      className="w-full"
                    >
                      {createMeal.isPending ? 'Punching...' : `Confirm & Punch - ₹${totalAmount}`}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registered Student Tab */}
          <TabsContent value="registered" className="space-y-6">
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
                    {selectedStudent?.last_payment_date && (
                      <p className="text-xs text-success mt-1">
                        Last paid: ₹{selectedStudent.last_payment_amount} on {format(new Date(selectedStudent.last_payment_date), 'dd MMM yyyy')}
                      </p>
                    )}
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

                  {/* Add-ons */}
                  <AddOnsSelector selectedAddons={addons} onChange={setAddons} />

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="e.g., late, special request, no rice..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Punch Button */}
                  {selectedMealType && (
                    <div className="pt-4 animate-fade-in">
                      <div className="p-4 bg-primary/10 rounded-lg mb-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Meal:</span>
                          <span className="font-semibold">
                            {t(`meal.${selectedMealType}`)} - ₹{MEAL_PRICES[selectedMealType]}
                          </span>
                        </div>
                        {addonsTotal > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-foreground">Add-ons:</span>
                            <span className="font-semibold">₹{addonsTotal}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-foreground">Date:</span>
                          <span className="text-muted-foreground">
                            {format(new Date(mealDate), 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-border pt-2">
                          <span className="text-foreground font-medium">Total:</span>
                          <span className="font-bold text-primary text-lg">₹{totalAmount}</span>
                        </div>
                      </div>
                      <Button
                        onClick={handlePunchMeal}
                        disabled={createMeal.isPending}
                        size="xl"
                        className="w-full"
                      >
                        {createMeal.isPending ? 'Punching...' : `Confirm & Punch - ₹${totalAmount}`}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

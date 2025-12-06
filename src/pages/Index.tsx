import { AppLayout } from '@/components/layout/AppLayout';
import { useStudents } from '@/hooks/useStudents';
import { useTodayMeals } from '@/hooks/useMeals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, UtensilsCrossed, Receipt, TrendingUp, Plus, UserPlus, CreditCard } from 'lucide-react';
import { MEAL_NAMES, MEAL_PRICES } from '@/types';
import { format } from 'date-fns';

const Index = () => {
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: todayMeals = [], isLoading: mealsLoading } = useTodayMeals();

  // Calculate today's stats
  const todayTotal = todayMeals.reduce((sum, meal) => sum + meal.amount, 0);
  const todayMealCounts = {
    mini: todayMeals.filter((m) => m.meal_type === 'mini').length,
    full: todayMeals.filter((m) => m.meal_type === 'full').length,
    special: todayMeals.filter((m) => m.meal_type === 'special').length,
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <section className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Welcome to TiffinTracker</h1>
          <p className="text-muted-foreground mt-1">Manage your mess service effortlessly</p>
        </section>

        {/* Two Main Sections */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          {/* Normal Billing Section */}
          <Card className="border border-border hover:border-accent hover:shadow-medium transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-lg">
                  <CreditCard className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Normal Billing</h2>
                  <p className="text-sm font-normal text-muted-foreground">For one-time customers</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Quick billing for walk-in customers who pay daily. No registration required.
              </p>
              <Link to="/punch?mode=normal">
                <Button variant="secondary" className="w-full">
                  <UtensilsCrossed className="h-4 w-4 mr-2" />
                  Punch Normal Order
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Registered Students Section */}
          <Card className="border border-border hover:border-primary hover:shadow-medium transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2.5 bg-primary rounded-lg">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Registered Students</h2>
                  <p className="text-sm font-normal text-muted-foreground">Monthly billing customers</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Track meals and generate monthly invoices for registered students.
              </p>
              <div className="flex gap-2">
                <Link to="/punch" className="flex-1">
                  <Button className="w-full">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Punch Meal
                  </Button>
                </Link>
                <Link to="/students">
                  <Button variant="outline" size="icon">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary rounded-lg">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{students.length}</p>
                  <p className="text-sm text-muted-foreground">Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent rounded-lg">
                  <UtensilsCrossed className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{todayMeals.length}</p>
                  <p className="text-sm text-muted-foreground">Today's Meals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-success rounded-lg">
                  <TrendingUp className="h-5 w-5 text-success-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">₹{todayTotal}</p>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-warning rounded-lg">
                  <Receipt className="h-5 w-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{Object.values(todayMealCounts).reduce((a, b) => a + b, 0)}</p>
                  <p className="text-sm text-muted-foreground">Meals Punched</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Today's Meal Breakdown */}
        {todayMeals.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '150ms' }}>
            <h2 className="text-xl font-semibold text-foreground mb-4">Today's Breakdown</h2>
            <div className="grid grid-cols-3 gap-4">
              {(['mini', 'full', 'special'] as const).map((type) => (
                <Card key={type} className="text-center">
                  <CardContent className="p-4">
                    <p className="text-3xl font-bold text-foreground">{todayMealCounts[type]}</p>
                    <p className="text-sm text-muted-foreground">{MEAL_NAMES[type]}</p>
                    <p className="text-xs text-muted-foreground mt-1">₹{todayMealCounts[type] * MEAL_PRICES[type]}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/punch">
              <Button variant="default" size="xl" className="w-full">
                <UtensilsCrossed className="h-5 w-5 mr-2" />
                Punch Meal
              </Button>
            </Link>
            <Link to="/students">
              <Button variant="secondary" size="xl" className="w-full">
                <Plus className="h-5 w-5 mr-2" />
                Add Student
              </Button>
            </Link>
            <Link to="/billing">
              <Button variant="outline" size="xl" className="w-full">
                <Receipt className="h-5 w-5 mr-2" />
                Generate Bill
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Students with Last Payment Info */}
        {students.length > 0 && (
          <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Recent Students</h2>
              <Link to="/students" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.slice(0, 6).map((student) => (
                <Card key={student.id} className="hover:shadow-medium transition-shadow">
                  <CardContent className="p-4">
                    <p className="font-medium text-foreground">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.phone}</p>
                    {student.last_payment_date && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Last Payment</p>
                        <p className="text-sm font-medium text-success">
                          ₹{student.last_payment_amount} • {format(new Date(student.last_payment_date), 'dd MMM yyyy')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {students.length === 0 && !studentsLoading && (
          <section className="text-center py-12 animate-fade-in">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No students yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">Add your first student to get started</p>
            <Link to="/students">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </Link>
          </section>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;

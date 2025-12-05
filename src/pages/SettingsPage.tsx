import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessConfig, getMessConfig, saveMessConfig, DEFAULT_MESS_CONFIG, MEAL_NAMES, MealType } from '@/types';
import { toast } from 'sonner';
import { Settings, Store, Save, RotateCcw, IndianRupee } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState<MessConfig>(DEFAULT_MESS_CONFIG);

  useEffect(() => {
    setConfig(getMessConfig());
  }, []);

  const handleSave = () => {
    saveMessConfig(config);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setConfig(DEFAULT_MESS_CONFIG);
    saveMessConfig(DEFAULT_MESS_CONFIG);
    toast.success('Settings reset to defaults');
  };

  const handlePriceChange = (mealType: MealType, value: string) => {
    const price = parseInt(value) || 0;
    setConfig({
      ...config,
      mealPrices: {
        ...config.mealPrices,
        [mealType]: price,
      },
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </h1>
          <p className="text-muted-foreground">Configure your mess details and pricing</p>
        </div>

        {/* Mess Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Mess Details
            </CardTitle>
            <CardDescription>
              These details will appear on your PDF invoices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Mess Name</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="Your Mess Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="123 Food Street, City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={config.contact}
                onChange={(e) => setConfig({ ...config, contact: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID (for payment QR)</Label>
              <Input
                id="upiId"
                value={config.upiId}
                onChange={(e) => setConfig({ ...config, upiId: e.target.value })}
                placeholder="yourmess@upi"
              />
            </div>
          </CardContent>
        </Card>

        {/* Meal Pricing Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Meal Pricing
            </CardTitle>
            <CardDescription>
              Set custom prices for each meal type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['mini', 'full', 'special'] as MealType[]).map((mealType) => (
              <div key={mealType} className="flex items-center gap-4">
                <Label className="w-32 font-medium">{MEAL_NAMES[mealType]}</Label>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                  <Input
                    type="number"
                    min="0"
                    value={config.mealPrices[mealType]}
                    onChange={(e) => handlePriceChange(mealType, e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

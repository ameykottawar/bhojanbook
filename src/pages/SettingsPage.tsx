import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessConfig, getMessConfig, saveMessConfig, DEFAULT_MESS_CONFIG, MEAL_NAMES, MealType } from '@/types';
import { toast } from 'sonner';
import { Settings, Store, Save, RotateCcw, IndianRupee, Globe, LogOut, User } from 'lucide-react';
import { useLanguage, Language, LANGUAGE_NAMES } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<MessConfig>(DEFAULT_MESS_CONFIG);

  useEffect(() => {
    setConfig(getMessConfig());
  }, []);

  const handleSave = () => {
    saveMessConfig(config);
    toast.success(t('settings.saved'));
  };

  const handleReset = () => {
    setConfig(DEFAULT_MESS_CONFIG);
    saveMessConfig(DEFAULT_MESS_CONFIG);
    toast.success(t('settings.resetSuccess'));
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

  const handleLogout = async () => {
    await signOut();
    toast.success(t('auth.logoutSuccess'));
    navigate('/auth', { replace: true });
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="h-6 w-6" />
            {t('settings.title')}
          </h1>
          <p className="text-muted-foreground">{t('settings.subtitle')}</p>
        </div>

        {/* Language Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('settings.language')}
            </CardTitle>
            <CardDescription>
              {t('settings.languageDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {(['en', 'hi', 'mr'] as Language[]).map((lang) => (
                <Button
                  key={lang}
                  variant={language === lang ? 'default' : 'outline'}
                  onClick={() => setLanguage(lang)}
                  className="min-w-24"
                >
                  {LANGUAGE_NAMES[lang]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mess Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              {t('settings.messDetails')}
            </CardTitle>
            <CardDescription>
              {t('settings.messDetailsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.messName')}</Label>
              <Input
                id="name"
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="Your Mess Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('settings.address')}</Label>
              <Input
                id="address"
                value={config.address}
                onChange={(e) => setConfig({ ...config, address: e.target.value })}
                placeholder="123 Food Street, City"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">{t('settings.contact')}</Label>
              <Input
                id="contact"
                value={config.contact}
                onChange={(e) => setConfig({ ...config, contact: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upiId">{t('settings.upiId')}</Label>
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
              {t('settings.mealPricing')}
            </CardTitle>
            <CardDescription>
              {t('settings.mealPricingDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['mini', 'full', 'special'] as MealType[]).map((mealType) => (
              <div key={mealType} className="flex items-center gap-4">
                <Label className="w-32 font-medium">{t(`meal.${mealType}`)}</Label>
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

        {/* Account Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('settings.account')}
            </CardTitle>
            <CardDescription>
              {t('settings.accountDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t('auth.email')}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                {t('auth.logout')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {t('settings.save')}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('settings.reset')}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

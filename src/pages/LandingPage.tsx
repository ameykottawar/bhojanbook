import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UtensilsCrossed, Users, Receipt, Globe, Utensils, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <UtensilsCrossed className="h-10 w-10 animate-pulse text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Utensils,
      titleKey: 'landing.featureMealTitle',
      descKey: 'landing.featureMealDesc',
    },
    {
      icon: Users,
      titleKey: 'landing.featureStudentsTitle',
      descKey: 'landing.featureStudentsDesc',
    },
    {
      icon: Receipt,
      titleKey: 'landing.featureBillingTitle',
      descKey: 'landing.featureBillingDesc',
    },
    {
      icon: Globe,
      titleKey: 'landing.featureLanguageTitle',
      descKey: 'landing.featureLanguageDesc',
    },
  ];

  const benefits = [
    'landing.benefit1',
    'landing.benefit2',
    'landing.benefit3',
    'landing.benefit4',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-foreground">BhojanBook</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm">
                {t('auth.login')}
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">{t('auth.signup')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <UtensilsCrossed className="h-4 w-4" />
            {t('landing.tagline')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            {t('landing.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                {t('landing.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                {t('auth.signup')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">{t(key)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            {t('landing.featuresTitle')}
          </h2>
          <p className="text-muted-foreground">
            {t('landing.featuresSubtitle')}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.titleKey}
              className="border border-border hover:border-primary/50 hover:shadow-medium transition-all"
            >
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t(feature.descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16 md:pb-24">
        <div className="rounded-2xl bg-primary p-8 md:p-12 text-primary-foreground">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('landing.ctaTitle')}
            </h2>
            <p className="text-primary-foreground/90 mb-8">
              {t('landing.ctaSubtitle')}
            </p>
            <Link to="/auth">
              <Button variant="secondary" size="lg">
                {t('landing.startFree')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <span className="font-bold text-foreground">BhojanBook</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('landing.footer')}
          </p>
        </div>
      </footer>
    </div>
  );
}

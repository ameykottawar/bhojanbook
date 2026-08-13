import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Utensils, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const resetEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const newPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

export default function AuthPage() {
  const { t } = useLanguage();
  const { user, signIn, signUp, loading, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    // Check if coming back from password reset email
    if (searchParams.get('reset') === 'true' && user) {
      setMode('reset');
    } else if (user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate, searchParams]);

  const validateForm = () => {
    try {
      if (mode === 'forgot') {
        resetEmailSchema.parse({ email });
      } else if (mode === 'reset') {
        newPasswordSchema.parse({ password });
      } else {
        authSchema.parse({ email, password });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        err.errors.forEach((error) => {
          if (error.path[0] === 'email') fieldErrors.email = error.message;
          if (error.path[0] === 'password') fieldErrors.password = error.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t('auth.resetEmailSent'));
          setMode('login');
        }
      } else if (mode === 'reset') {
        const { error } = await updatePassword(password);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success(t('auth.passwordUpdated'));
          navigate('/dashboard', { replace: true });
        }
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error(t('auth.invalidCredentials'));
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(t('auth.loginSuccess'));
          navigate('/dashboard', { replace: true });
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(t('auth.alreadyRegistered'));
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(t('auth.signupSuccess'));
          navigate('/dashboard', { replace: true });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'forgot': return t('auth.forgotPassword');
      case 'reset': return t('auth.resetPassword');
      case 'signup': return t('auth.signup');
      default: return t('auth.login');
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'forgot': return t('auth.forgotSubtitle');
      case 'reset': return t('auth.resetSubtitle');
      case 'signup': return t('auth.signupSubtitle');
      default: return t('auth.loginSubtitle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Utensils className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{getTitle()}</CardTitle>
            <CardDescription>{getSubtitle()}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            )}
            
            {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
              <div className="space-y-2">
                <Label htmlFor="password">
                  {mode === 'reset' ? t('auth.newPassword') : t('auth.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {mode === 'forgot' ? t('auth.sendResetLink') : 
               mode === 'reset' ? t('auth.updatePassword') :
               mode === 'login' ? t('auth.login') : t('auth.signup')}
            </Button>
          </form>
          
          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          )}
          
          {(mode === 'forgot') && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sm text-muted-foreground hover:text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                {t('auth.backToLogin')}
              </button>
            </div>
          )}
          
          {(mode === 'login' || mode === 'signup') && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-primary hover:underline font-medium"
                >
                  {mode === 'login' ? t('auth.signup') : t('auth.login')}
                </button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

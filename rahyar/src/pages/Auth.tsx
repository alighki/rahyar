import { useState } from 'react';
import { supabase } from '@/integrations/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast({ title: 'ثبت‌نام موفق', description: 'لطفاً ایمیل خود را تأیید کنید.' });
      }
    } catch (err: any) {
      toast({ title: 'خطا', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">رَه‌یار</h1>
          <p className="text-muted-foreground">پلتفرم آموزشی هوشمند</p>
        </div>
        <div className="bg-card rounded-xl p-8 shadow-elevated border border-border">
          <h2 className="text-xl font-bold mb-6 text-center">
            {isLogin ? 'ورود به حساب' : 'ثبت‌نام'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="mt-1" />
              </div>
            )}
            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" dir="ltr" />
            </div>
            <div>
              <Label htmlFor="password">رمز عبور</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="mt-1" dir="ltr" />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={loading}>
              {loading ? '...' : isLogin ? 'ورود' : 'ثبت‌نام'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-primary hover:underline">
              {isLogin ? 'حساب ندارید؟ ثبت‌نام کنید' : 'حساب دارید؟ وارد شوید'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

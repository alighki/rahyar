import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState(7);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setFullName(data.full_name);
          setGrade(data.grade);
          setBio(data.bio || '');
        }
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ full_name: fullName, grade, bio }).eq('user_id', user.id);
    setSaving(false);
    if (error) toast({ title: 'خطا', description: error.message, variant: 'destructive' });
    else toast({ title: 'ذخیره شد', description: 'تنظیمات با موفقیت بروزرسانی شد.' });
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-primary" />
          تنظیمات
        </h1>
        <p className="text-muted-foreground mb-8">مدیریت پروفایل و ترجیحات</p>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-6">
          <div>
            <Label htmlFor="name">نام و نام خانوادگی</Label>
            <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="grade">پایه تحصیلی</Label>
            <select id="grade" value={grade} onChange={e => setGrade(+e.target.value)}
              className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm">
              {[7,8,9,10,11,12].map(g => <option key={g} value={g}>پایه {g}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="bio">درباره من</Label>
            <textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full mt-1 rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none" />
          </div>
          <Button onClick={save} disabled={saving} className="bg-gradient-primary text-primary-foreground">
            {saving ? 'ذخیره...' : 'ذخیره تنظیمات'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

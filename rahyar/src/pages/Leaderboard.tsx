import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import AppLayout from '@/components/AppLayout';
import { Trophy, Medal, Star } from 'lucide-react';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, full_name, total_xp, level, grade, avatar_url')
        .order('total_xp', { ascending: false })
        .limit(20);
      if (data) setLeaders(data);
    };
    load();
  }, []);

  const rankIcon = (i: number) => {
    if (i === 0) return <Trophy className="w-6 h-6 text-secondary" />;
    if (i === 1) return <Medal className="w-6 h-6 text-muted-foreground" />;
    if (i === 2) return <Star className="w-6 h-6 text-gold" />;
    return <span className="text-sm font-bold text-muted-foreground">{i + 1}</span>;
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">جدول رتبه‌بندی</h1>
        <p className="text-muted-foreground mb-8">برترین یادگیرندگان رَه‌یار</p>

        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          {leaders.map((l, i) => (
            <div key={l.user_id} className={`flex items-center gap-4 px-6 py-4 ${i < 3 ? 'bg-muted/30' : ''} ${i !== leaders.length -1 ? 'border-b border-border' : ''}`}>
              <div className="w-10 flex justify-center">{rankIcon(i)}</div>
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {l.full_name?.charAt(0) || '؟'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{l.full_name}</p>
                <p className="text-xs text-muted-foreground">پایه {l.grade} | سطح {l.level}</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-primary">{l.total_xp} XP</p>
              </div>
            </div>
          ))}
          {leaders.length === 0 && (
            <p className="text-center text-muted-foreground py-12">هنوز کاربری ثبت‌نام نکرده است.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Leaderboard;

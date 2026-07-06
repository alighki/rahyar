import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Award } from 'lucide-react';

const Honors = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<any[]>([]);
  const [allBadges, setAllBadges] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: all } = await supabase.from('badges').select('*').order('xp_required');
      if (all) setAllBadges(all);
      if (user) {
        const { data } = await supabase.from('user_badges').select('badge_id').eq('user_id', user.id);
        if (data) setBadges(data.map(b => b.badge_id));
      }
    };
    load();
  }, [user]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">افتخارات</h1>
        <p className="text-muted-foreground mb-8">مدال‌ها و دستاوردهای شما</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {allBadges.map(b => {
            const earned = badges.includes(b.id);
            return (
              <div key={b.id} className={`bg-card rounded-2xl p-6 shadow-card border border-border text-center transition-all ${earned ? 'hover:shadow-elevated' : 'opacity-40'}`}>
                <span className="text-4xl block mb-3">{b.icon}</span>
                <h3 className="font-bold text-sm mb-1">{b.name_fa}</h3>
                <p className="text-xs text-muted-foreground">{b.description_fa}</p>
                {earned && <span className="inline-block mt-2 text-xs text-emerald font-bold">کسب شده ✓</span>}
                {!earned && <span className="inline-block mt-2 text-xs text-muted-foreground">{b.xp_required} XP</span>}
              </div>
            );
          })}
        </div>
        {allBadges.length === 0 && (
          <div className="text-center py-12">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">هنوز مدالی تعریف نشده است.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Honors;

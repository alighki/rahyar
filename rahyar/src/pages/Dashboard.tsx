import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Trophy, Zap, Target, BookOpen, Award, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [pRes, aRes, bRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('quiz_attempts').select('*, quizzes(title_fa)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(5),
        supabase.from('user_badges').select('*, badges(*)').eq('user_id', user.id),
      ]);
      if (pRes.data) setProfile(pRes.data);
      if (aRes.data) setRecentAttempts(aRes.data);
      if (bRes.data) setBadges(bRes.data);
    };
    load();
  }, [user]);

  const xpForNextLevel = (profile?.level ?? 1) * 200;
  const xpProgress = profile ? Math.min((profile.total_xp % xpForNextLevel) / xpForNextLevel * 100, 100) : 0;

  const statCards = [
    { label: 'سطح فعلی', value: profile?.level ?? 1, icon: TrendingUp, color: 'bg-gradient-primary' },
    { label: 'امتیاز کل', value: profile?.total_xp ?? 0, icon: Zap, color: 'bg-gradient-gold' },
    { label: 'آزمون‌ها', value: recentAttempts.length, icon: Target, color: 'bg-gradient-accent' },
    { label: 'مدال‌ها', value: badges.length, icon: Award, color: 'bg-gradient-primary' },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto animate-slide-up">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">سلام {profile?.full_name ?? ''}! 👋</h1>
          <p className="text-muted-foreground mt-1">به رَه‌یار خوش آمدید</p>
        </div>

        {/* XP Progress */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">پیشرفت به سطح {(profile?.level ?? 1) + 1}</p>
                <p className="text-lg font-bold">{profile?.total_xp ?? 0} / {xpForNextLevel} XP</p>
              </div>
            </div>
            <div className="text-3xl font-black text-gradient-primary">Level {profile?.level ?? 1}</div>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <div key={i} className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              آزمون‌های اخیر
            </h3>
            {recentAttempts.length === 0 ? (
              <p className="text-muted-foreground text-sm">هنوز آزمونی انجام نداده‌اید.</p>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">{(a.quizzes as any)?.title_fa}</span>
                    <span className="text-sm font-bold text-primary">{a.score}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-gold" />
              مدال‌های کسب شده
            </h3>
            {badges.length === 0 ? (
              <p className="text-muted-foreground text-sm">هنوز مدالی کسب نکرده‌اید.</p>
            ) : (
              <div className="grid grid-cols-4 gap-3">
                {badges.map(b => (
                  <div key={b.id} className="text-center p-2 rounded-lg bg-muted/50">
                    <span className="text-2xl">{(b.badges as any)?.icon}</span>
                    <p className="text-xs mt-1">{(b.badges as any)?.name_fa}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Award, BookOpen, Target, Zap, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [p, b, a] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('user_badges').select('*, badges(*)').eq('user_id', user.id),
        supabase.from('quiz_attempts').select('*, quizzes(title_fa, category)').eq('user_id', user.id).order('completed_at', { ascending: false }),
      ]);
      if (p.data) setProfile(p.data);
      if (b.data) setBadges(b.data);
      if (a.data) setAttempts(a.data);
    };
    load();
  }, [user]);

  const skills = attempts.reduce((acc: Record<string, { total: number; correct: number }>, a: any) => {
    const analysis = a.skill_analysis as Record<string, any> | null;
    if (analysis && typeof analysis === 'object') {
      Object.entries(analysis).forEach(([skill, data]: [string, any]) => {
        if (!acc[skill]) acc[skill] = { total: 0, correct: 0 };
        acc[skill].total += data.total || 1;
        acc[skill].correct += data.correct || 0;
      });
    }
    return acc;
  }, {});

  const xpForNextLevel = (profile?.level ?? 1) * 200;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        {/* Hero Profile Card */}
        <div className="bg-gradient-hero rounded-3xl p-8 text-primary-foreground mb-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 20% 80%, white 0%, transparent 60%)' }} />
          <div className="relative flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-card/20 backdrop-blur flex items-center justify-center text-4xl font-bold">
              {profile?.full_name?.charAt(0) || '؟'}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{profile?.full_name}</h1>
              <p className="opacity-80 mt-1">پایه {profile?.grade} | سطح {profile?.level}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1"><Zap className="w-4 h-4" />{profile?.total_xp} XP</span>
                <span className="flex items-center gap-1"><Award className="w-4 h-4" />{badges.length} مدال</span>
                <span className="flex items-center gap-1"><Target className="w-4 h-4" />{attempts.length} آزمون</span>
              </div>
            </div>
          </div>
          <div className="mt-6 relative">
            <div className="flex justify-between text-sm mb-1">
              <span>پیشرفت سطح</span>
              <span>{profile?.total_xp % xpForNextLevel} / {xpForNextLevel}</span>
            </div>
            <div className="h-3 bg-card/20 rounded-full overflow-hidden">
              <div className="h-full bg-card/60 rounded-full transition-all" style={{ width: `${((profile?.total_xp ?? 0) % xpForNextLevel) / xpForNextLevel * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Skills Radar */}
        {Object.keys(skills).length > 0 && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              مهارت‌ها
            </h3>
            <div className="space-y-3">
              {Object.entries(skills).map(([skill, data]: [string, { total: number; correct: number }]) => {
                const pct = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={skill}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill}</span>
                      <span className="font-bold text-primary">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            مدال‌ها
          </h3>
          {badges.length === 0 ? (
            <p className="text-muted-foreground text-sm">هنوز مدالی کسب نکرده‌اید. آزمون‌ها را انجام دهید!</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {badges.map(b => (
                <div key={b.id} className="text-center p-4 rounded-xl bg-muted/50 hover:shadow-card transition-shadow">
                  <span className="text-3xl block mb-2">{(b.badges as any)?.icon}</span>
                  <p className="text-sm font-medium">{(b.badges as any)?.name_fa}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quiz History */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            سوابق آزمون
          </h3>
          {attempts.length === 0 ? (
            <p className="text-muted-foreground text-sm">هنوز آزمونی انجام نداده‌اید.</p>
          ) : (
            <div className="space-y-2">
              {attempts.slice(0, 10).map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{(a.quizzes as any)?.title_fa}</p>
                    <p className="text-xs text-muted-foreground">{new Date(a.completed_at).toLocaleDateString('fa-IR')}</p>
                  </div>
                  <div className="text-left">
                    <span className={`text-sm font-bold ${a.score >= 70 ? 'text-emerald' : a.score >= 40 ? 'text-secondary' : 'text-destructive'}`}>{a.score}%</span>
                    <p className="text-xs text-muted-foreground">{a.correct_answers}/{a.total_questions}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;

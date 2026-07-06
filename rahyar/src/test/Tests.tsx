import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Link } from 'react-router-dom';
import { FileText, Clock, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Tests = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<Record<string, any>>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('quizzes').select('*').eq('is_active', true).order('grade').order('created_at');
      if (data) setQuizzes(data);

      if (user) {
        const { data: att } = await supabase.from('quiz_attempts').select('quiz_id, score').eq('user_id', user.id);
        if (att) {
          const map: Record<string, any> = {};
          att.forEach(a => { if (!map[a.quiz_id] || a.score > map[a.quiz_id].score) map[a.quiz_id] = a; });
          setAttempts(map);
        }
      }
    };
    load();
  }, [user]);

  const difficultyColor = (d: string) => {
    switch(d) {
      case 'easy': return 'bg-emerald/10 text-emerald';
      case 'medium': return 'bg-secondary/10 text-secondary-foreground';
      case 'hard': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const difficultyLabel = (d: string) => {
    switch(d) { case 'easy': return 'آسان'; case 'medium': return 'متوسط'; case 'hard': return 'سخت'; default: return d; }
  };

  const grouped = quizzes.reduce<Record<number, any[]>>((acc, q) => {
    if (!acc[q.grade]) acc[q.grade] = [];
    acc[q.grade].push(q);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">آزمون‌ها</h1>
        <p className="text-muted-foreground mb-8">مهارت‌های خود را بسنجید و XP کسب کنید</p>

        {Object.entries(grouped).sort(([a],[b]) => +a - +b).map(([grade, qs]) => (
          <div key={grade} className="mb-8">
            <h2 className="text-xl font-bold mb-4">پایه {grade}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qs.map((q: any) => {
                const done = attempts[q.id];
                return (
                  <div key={q.id} className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{q.title_fa}</h3>
                          <p className="text-xs text-muted-foreground">{q.category}</p>
                        </div>
                      </div>
                      {done && <CheckCircle className="w-5 h-5 text-emerald" />}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{q.description_fa}</p>
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${difficultyColor(q.difficulty)}`}>{difficultyLabel(q.difficulty)}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" />{q.time_limit_minutes} دقیقه</span>
                      <span className="flex items-center gap-1 text-secondary"><Zap className="w-3 h-3" />{q.xp_reward} XP</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {done && <span className="text-xs font-bold text-primary">بهترین: {done.score}%</span>}
                      <Link to={`/quiz/${q.id}`} className="mr-auto">
                        <Button size="sm" className="bg-gradient-primary text-primary-foreground text-xs">
                          {done ? 'تکرار آزمون' : 'شروع آزمون'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <p className="text-center text-muted-foreground py-12">هنوز آزمونی ایجاد نشده است.</p>
        )}
      </div>
    </AppLayout>
  );
};

export default Tests;

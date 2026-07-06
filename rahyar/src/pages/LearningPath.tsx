import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Route, CheckCircle, Circle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const LearningPath = () => {
  const { user } = useAuth();
  const [paths, setPaths] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from('learning_paths').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPaths(data); });
  }, [user]);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">مسیر یادگیری</h1>
        <p className="text-muted-foreground mb-8">مسیر شخصی‌سازی شده بر اساس نتایج آزمون‌ها</p>

        {paths.length === 0 ? (
          <div className="bg-card rounded-2xl p-12 shadow-card border border-border text-center">
            <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">مسیری تعریف نشده</h3>
            <p className="text-muted-foreground text-sm">ابتدا چند آزمون انجام دهید تا مسیر یادگیری شخصی شما ایجاد شود.</p>
          </div>
        ) : (
          paths.map(path => {
            const weeks = (path.weeks as any[]) || [];
            return (
              <div key={path.id} className="bg-card rounded-2xl p-6 shadow-card border border-border mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{path.title_fa || 'مسیر یادگیری'}</h3>
                  <span className="text-sm font-bold text-primary">{path.progress_percent}%</span>
                </div>
                <Progress value={path.progress_percent} className="h-2 mb-6" />
                <div className="space-y-4">
                  {weeks.map((week: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${week.completed ? 'bg-emerald text-emerald-foreground' : 'bg-muted'}`}>
                        {week.completed ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{week.title || `هفته ${i + 1}`}</h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{week.duration || '۱ هفته'}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{week.description || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </AppLayout>
  );
};

export default LearningPath;

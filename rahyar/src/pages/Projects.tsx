import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { FolderOpen, Send, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const Projects = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from('resources').select('*').eq('type', 'project').eq('is_active', true).order('grade').order('sort_order')
      .then(({ data }) => { if (data) setResources(data); });

    if (user) {
      supabase.from('project_submissions').select('*').eq('user_id', user.id)
        .then(({ data }) => { if (data) setSubmissions(data); });
    }
  }, [user]);

  const getSubmission = (resourceId: string) => submissions.find(s => s.resource_id === resourceId);

  const handleSubmit = async () => {
    if (!user || !selectedProject || !description.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from('project_submissions').insert({
      user_id: user.id,
      resource_id: selectedProject.id,
      description: description.trim(),
      file_url: fileUrl.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: 'خطا', description: 'ارسال پروژه با مشکل مواجه شد', variant: 'destructive' });
    } else {
      toast({ title: 'موفق', description: 'پروژه شما با موفقیت ارسال شد' });
      setSelectedProject(null);
      setDescription('');
      setFileUrl('');
      // refresh submissions
      const { data } = await supabase.from('project_submissions').select('*').eq('user_id', user.id);
      if (data) setSubmissions(data);
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'submitted': return { text: 'ارسال شده', icon: Clock, color: 'bg-yellow-100 text-yellow-700' };
      case 'reviewed': return { text: 'بررسی شده', icon: CheckCircle2, color: 'bg-green-100 text-green-700' };
      default: return { text: status, icon: FileText, color: 'bg-muted text-muted-foreground' };
    }
  };

  // Group by grade
  const grades = [...new Set(resources.map(r => r.grade))].sort((a, b) => a - b);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">پروژه‌ها</h1>
        <p className="text-muted-foreground mb-8">پروژه‌های عملی برای تقویت مهارت‌ها — روی هر پروژه کلیک کنید</p>

        {resources.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">هنوز پروژه‌ای تعریف نشده است.</p>
          </div>
        ) : (
          grades.map(grade => (
            <div key={grade} className="mb-8">
              <h2 className="text-lg font-bold mb-3 text-primary">پایه {grade}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.filter(r => r.grade === grade).map(r => {
                  const sub = getSubmission(r.id);
                  const st = sub ? statusLabel(sub.status) : null;
                  return (
                    <button
                      key={r.id}
                      onClick={() => { setSelectedProject(r); setDescription(''); setFileUrl(''); }}
                      className="text-right bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated hover:border-primary/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FolderOpen className="w-5 h-5 text-gold-foreground" />
                        </div>
                        {st && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.text}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm mb-1">{r.title_fa}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{r.category}</p>
                      <p className="text-xs text-muted-foreground line-clamp-3">{r.description_fa}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title_fa}</DialogTitle>
            <DialogDescription>{selectedProject?.description_fa}</DialogDescription>
          </DialogHeader>

          {(() => {
            const sub = selectedProject ? getSubmission(selectedProject.id) : null;
            if (sub) {
              const st = statusLabel(sub.status);
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={st.color}>{st.text}</Badge>
                    {sub.score != null && <Badge>نمره: {sub.score}</Badge>}
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm font-medium mb-1">توضیحات شما:</p>
                    <p className="text-sm text-muted-foreground">{sub.description}</p>
                  </div>
                  {sub.file_url && (
                    <div>
                      <p className="text-sm font-medium mb-1">لینک فایل:</p>
                      <a href={sub.file_url} target="_blank" rel="noreferrer" className="text-sm text-primary underline">{sub.file_url}</a>
                    </div>
                  )}
                  {sub.feedback && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-sm font-medium mb-1 text-green-700">بازخورد:</p>
                      <p className="text-sm text-green-600">{sub.feedback}</p>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">توضیحات پروژه شما *</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="توضیح دهید چه کاری انجام داده‌اید..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">لینک فایل (اختیاری)</label>
                  <Input
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    dir="ltr"
                  />
                </div>
                <Button onClick={handleSubmit} disabled={submitting || !description.trim()} className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  {submitting ? 'در حال ارسال...' : 'ارسال پروژه'}
                </Button>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Projects;

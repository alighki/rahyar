import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import AppLayout from '@/components/AppLayout';
import { BookOpen, Video, FolderOpen, ExternalLink } from 'lucide-react';

const Resources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState(7);
  const [tab, setTab] = useState<'resources' | 'videos'>('resources');

  useEffect(() => {
    const load = async () => {
      const [r, v] = await Promise.all([
        supabase.from('resources').select('*').eq('grade', selectedGrade).eq('is_active', true).order('sort_order'),
        supabase.from('video_links').select('*').eq('grade', selectedGrade).order('sort_order'),
      ]);
      if (r.data) setResources(r.data);
      if (v.data) setVideos(v.data);
    };
    load();
  }, [selectedGrade]);

  const typeIcon = (t: string) => {
    switch(t) { case 'project': return FolderOpen; case 'video': return Video; default: return BookOpen; }
  };
  const typeLabel = (t: string) => {
    switch(t) { case 'lesson': return 'درس'; case 'exercise': return 'تمرین'; case 'project': return 'پروژه'; default: return t; }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-2">منابع آموزشی</h1>
        <p className="text-muted-foreground mb-6">مجموعه کاملی از منابع برای هر پایه تحصیلی</p>

        {/* Grade selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[7,8,9,10,11,12].map(g => (
            <button key={g} onClick={() => setSelectedGrade(g)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedGrade === g ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 'bg-card border border-border hover:border-primary/40'}`}>
              پایه {g}
            </button>
          ))}
        </div>

        {/* Tab */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('resources')} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === 'resources' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            منابع ({resources.length})
          </button>
          <button onClick={() => setTab('videos')} className={`px-4 py-2 rounded-lg text-sm transition-all ${tab === 'videos' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            ویدیوها ({videos.length})
          </button>
        </div>

        {tab === 'resources' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map(r => {
              const Icon = typeIcon(r.type);
              return (
                <div key={r.id} className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{r.title_fa}</h3>
                      <span className="text-xs text-muted-foreground">{typeLabel(r.type)} | {r.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{r.description_fa}</p>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> مشاهده منبع
                    </a>
                  )}
                </div>
              );
            })}
            {resources.length === 0 && <p className="text-muted-foreground col-span-3 text-center py-8">منبعی برای این پایه ثبت نشده است.</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map(v => (
              <a key={v.id} href={v.aparat_url} target="_blank" rel="noopener noreferrer" className="bg-card rounded-2xl p-5 shadow-card border border-border hover:shadow-elevated transition-all flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Video className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{v.title_fa}</h3>
                  <p className="text-xs text-muted-foreground">{v.category} | {v.duration_minutes} دقیقه</p>
                </div>
              </a>
            ))}
            {videos.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-8">ویدیویی برای این پایه ثبت نشده است.</p>}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Resources;

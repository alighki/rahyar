
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, Brain, Trophy, Target, ChevronDown, Sparkles, BookOpen, BarChart3 } from 'lucide-react';

type Lang = 'fa' | 'ar' | 'en';

const content: Record<Lang, {
  dir: 'rtl' | 'ltr';
  nav: { lang: string; login: string; signup: string };
  hero: { badge: string; title: string; subtitle: string; cta: string; secondary: string };
  mission: { title: string; paragraphs: string[] };
  features: { title: string; items: { icon: string; title: string; desc: string }[] };
  stats: { label: string; value: string }[];
  cta: { title: string; desc: string; button: string };
  footer: string;
}> = {
  fa: {
    dir: 'rtl',
    nav: { lang: 'فارسی', login: 'ورود', signup: 'ثبت‌نام رایگان' },
    hero: {
      badge: '🚀 پلتفرم آموزشی نسل جدید',
      title: 'رَه‌یار',
      subtitle: 'مسیر یادگیری هوشمند، شخصی‌سازی‌شده و علمی برای رشد واقعی مهارت‌های شما',
      cta: 'شروع رایگان',
      secondary: 'بیشتر بدانید',
    },
    mission: {
      title: 'مأموریت ما',
      paragraphs: [
        'رَه‌یار با هدف ایجاد تحولی بنیادین در آموزش طراحی شده است. ما معتقدیم هر دانش‌آموز استعداد منحصربه‌فردی دارد که با روش‌های سنتی کشف نمی‌شود. پلتفرم ما با بهره‌گیری از هوش مصنوعی و تحلیل داده، مسیر یادگیری اختصاصی هر فرد را شناسایی و هدایت می‌کند.',
        'آزمون‌های علمی رَه‌یار بر اساس استانداردهای بین‌المللی سنجش مهارت طراحی شده‌اند. هر سؤال با دقت توسط متخصصان حوزه آموزش تدوین شده و پاسخ‌ها با تحلیل چندبُعدی بررسی می‌شوند تا تصویری جامع از نقاط قوت و ضعف شما ارائه دهند.',
        'سیستم امتیازدهی XP و مدال‌های رَه‌یار، یادگیری را به تجربه‌ای هیجان‌انگیز و انگیزه‌بخش تبدیل می‌کند. با هر قدم پیشرفت، امتیاز کسب می‌کنید، سطح شما ارتقا می‌یابد و مدال‌های جدید به مجموعه افتخارات شما اضافه می‌شوند. رقابت سالم با دیگر دانش‌آموزان در تابلوی رتبه‌بندی هفتگی، انگیزه مضاعفی برای رشد ایجاد می‌کند.',
      ],
    },
    features: {
      title: 'ویژگی‌های کلیدی',
      items: [
        { icon: 'brain', title: 'هوش مصنوعی شخصی', desc: 'دستیار هوشمند AI که بر اساس نتایج آزمون‌ها و سطح مهارتی شما، راهنمایی‌های اختصاصی ارائه می‌دهد.' },
        { icon: 'target', title: 'مسیر یادگیری هوشمند', desc: 'مسیر سه‌هفته‌ای شخصی‌سازی‌شده بر اساس تحلیل علمی نقاط قوت و ضعف شما طراحی می‌شود.' },
        { icon: 'trophy', title: 'سیستم گیمیفیکیشن', desc: 'با کسب XP، ارتقای سطح و دریافت مدال‌ها، یادگیری را به ماجراجویی هیجان‌انگیز تبدیل کنید.' },
        { icon: 'book', title: 'منابع آموزشی جامع', desc: 'بیش از ۱۲۰ منبع آموزشی شامل ویدیو، تمرین و پروژه عملی برای هر پایه تحصیلی.' },
      ],
    },
    stats: [
      { label: 'آزمون علمی', value: '۲۰+' },
      { label: 'منبع آموزشی', value: '۱۲۰+' },
      { label: 'ویدیوی آموزشی', value: '۲۰+' },
      { label: 'مدال و نشان', value: '۱۰+' },
    ],
    cta: {
      title: 'آماده‌اید مسیر یادگیری خود را کشف کنید؟',
      desc: 'همین حالا ثبت‌نام کنید و اولین آزمون خود را شروع کنید. رَه‌یار در کنار شماست.',
      button: 'شروع رایگان',
    },
    footer: '© ۱۴۰۴ رَه‌یار — پلتفرم آموزشی هوشمند',
  },
  ar: {
    dir: 'rtl',
    nav: { lang: 'العربية', login: 'تسجيل الدخول', signup: 'التسجيل مجاناً' },
    hero: {
      badge: '🚀 منصة تعليمية من الجيل الجديد',
      title: 'رَه‌يار',
      subtitle: 'مسار تعليمي ذكي ومخصص وعلمي للنمو الحقيقي في مهاراتك',
      cta: 'ابدأ مجاناً',
      secondary: 'اعرف المزيد',
    },
    mission: {
      title: 'مهمتنا',
      paragraphs: [
        'صُمّم رَه‌يار بهدف إحداث تحوّل جذري في التعليم. نؤمن بأن لكل طالب موهبة فريدة لا تُكتشف بالطرق التقليدية. تعتمد منصتنا على الذكاء الاصطناعي وتحليل البيانات لتحديد مسار التعلم الخاص بكل فرد وتوجيهه.',
        'اختبارات رَه‌يار العلمية مصممة وفقاً لمعايير دولية لقياس المهارات. كل سؤال أُعدّ بعناية من قبل خبراء التعليم، وتُحلّل الإجابات تحليلاً متعدد الأبعاد لتقديم صورة شاملة عن نقاط قوتك وضعفك.',
        'نظام نقاط XP وأوسمة رَه‌يار يحوّل التعلم إلى تجربة مثيرة ومحفّزة. مع كل خطوة تقدّم، تكسب نقاطاً ويرتفع مستواك وتُضاف أوسمة جديدة إلى مجموعة إنجازاتك.',
      ],
    },
    features: {
      title: 'المميزات الرئيسية',
      items: [
        { icon: 'brain', title: 'ذكاء اصطناعي شخصي', desc: 'مساعد ذكي يقدم إرشادات مخصصة بناءً على نتائج اختباراتك ومستوى مهاراتك.' },
        { icon: 'target', title: 'مسار تعلم ذكي', desc: 'مسار مخصص لثلاثة أسابيع يُصمّم بناءً على التحليل العلمي لنقاط قوتك وضعفك.' },
        { icon: 'trophy', title: 'نظام التحفيز', desc: 'اكسب نقاط XP وارتقِ بمستواك واحصل على أوسمة لتحويل التعلم إلى مغامرة مثيرة.' },
        { icon: 'book', title: 'موارد تعليمية شاملة', desc: 'أكثر من ١٢٠ مورداً تعليمياً تشمل فيديوهات وتمارين ومشاريع عملية لكل مرحلة دراسية.' },
      ],
    },
    stats: [
      { label: 'اختبار علمي', value: '+٢٠' },
      { label: 'مورد تعليمي', value: '+١٢٠' },
      { label: 'فيديو تعليمي', value: '+٢٠' },
      { label: 'وسام وشارة', value: '+١٠' },
    ],
    cta: {
      title: 'هل أنت مستعد لاكتشاف مسار تعلمك؟',
      desc: 'سجّل الآن وابدأ أول اختبار لك. رَه‌يار بجانبك.',
      button: 'ابدأ مجاناً',
    },
    footer: '© ٢٠٢٥ رَه‌يار — منصة تعليمية ذكية',
  },
  en: {
    dir: 'ltr',
    nav: { lang: 'English', login: 'Login', signup: 'Sign Up Free' },
    hero: {
      badge: '🚀 Next-Generation Learning Platform',
      title: 'Rahyar',
      subtitle: 'A smart, personalized, and scientific learning journey for your real skill growth',
      cta: 'Start Free',
      secondary: 'Learn More',
    },
    mission: {
      title: 'Our Mission',
      paragraphs: [
        'Rahyar is designed to fundamentally transform education. We believe every student has a unique talent that traditional methods fail to discover. Our platform uses artificial intelligence and data analytics to identify and guide each individual\'s personalized learning path.',
        'Rahyar\'s scientific assessments are designed based on international skill measurement standards. Each question is carefully crafted by education experts, and answers are analyzed multi-dimensionally to provide a comprehensive picture of your strengths and weaknesses.',
        'Rahyar\'s XP scoring system and badges turn learning into an exciting and motivating experience. With every step of progress, you earn points, level up, and add new badges to your collection. Healthy competition with other students on the weekly leaderboard creates extra motivation for growth.',
      ],
    },
    features: {
      title: 'Key Features',
      items: [
        { icon: 'brain', title: 'Personal AI Assistant', desc: 'An intelligent AI assistant that provides personalized guidance based on your test results and skill level.' },
        { icon: 'target', title: 'Smart Learning Path', desc: 'A three-week personalized path designed based on scientific analysis of your strengths and weaknesses.' },
        { icon: 'trophy', title: 'Gamification System', desc: 'Earn XP, level up, and collect badges to turn learning into an exciting adventure.' },
        { icon: 'book', title: 'Comprehensive Resources', desc: 'Over 120 educational resources including videos, exercises, and practical projects for every grade.' },
      ],
    },
    stats: [
      { label: 'Scientific Tests', value: '20+' },
      { label: 'Learning Resources', value: '120+' },
      { label: 'Video Tutorials', value: '20+' },
      { label: 'Badges & Awards', value: '10+' },
    ],
    cta: {
      title: 'Ready to discover your learning path?',
      desc: 'Sign up now and start your first test. Rahyar is with you every step of the way.',
      button: 'Start Free',
    },
    footer: '© 2025 Rahyar — Smart Learning Platform',
  },
};

const iconMap: Record<string, React.ElementType> = {
  brain: Brain,
  target: Target,
  trophy: Trophy,
  book: BookOpen,
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' },
  }),
};

const Landing = () => {
  const [lang, setLang] = useState<Lang>('fa');
  const navigate = useNavigate();
  const t = content[lang];

  return (
    <div dir={t.dir} className="min-h-screen bg-background font-body overflow-x-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl text-foreground">{t.hero.title}</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-full p-0.5 gap-0.5">
              {(['fa', 'ar', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    lang === l
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {content[l].nav.lang}
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              {t.nav.login}
            </Button>
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-gradient-primary text-primary-foreground shadow-sm">
              {t.nav.signup}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 pb-20 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-accent/10 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }} />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mx-auto mb-8 w-[290px] h-[160px] rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden"
          >
            <div className="">
                            <img src="public/left.jpg" alt="" /></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-display font-black mb-6 text-gradient-primary leading-tight"
          >
            {t.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-primary text-primary-foreground text-base px-8 py-6 rounded-xl shadow-glow hover:shadow-elevated transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              {t.hero.cta}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-base px-8 py-6 rounded-xl"
            >
              <ChevronDown className="w-5 h-5" />
              {t.hero.secondary}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-muted/50 border-y border-border/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
          {t.stats.map((stat, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-display font-black text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section id="mission" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-bold text-center mb-10 text-foreground"
          >
            {t.mission.title}
          </motion.h2>
          <div className="space-y-6">
            {t.mission.paragraphs.map((p, i) => (
              <motion.p
                key={i}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-base md:text-lg text-muted-foreground leading-8"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            className="text-3xl md:text-4xl font-display font-bold text-center mb-14 text-foreground"
          >
            {t.features.title}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.features.items.map((item, i) => {
              const Icon = iconMap[item.icon] || Brain;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group relative p-6 rounded-2xl bg-card border border-border/50 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-7 text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
          variants={fadeUp}
          className="max-w-3xl mx-auto text-center p-10 rounded-3xl bg-gradient-primary relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 right-8 w-20 h-20 border-2 border-primary-foreground/30 rounded-full" />
            <div className="absolute bottom-6 left-12 w-14 h-14 border-2 border-primary-foreground/20 rounded-lg rotate-12" />
          </div>
          <div className="relative z-10">
            <BarChart3 className="w-10 h-10 text-primary-foreground/80 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
              {t.cta.title}
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto leading-7">
              {t.cta.desc}
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-primary-foreground text-primary font-bold px-10 py-6 rounded-xl hover:bg-primary-foreground/90 transition-all"
            >
              {t.cta.button}
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/50">
        {t.footer}
      </footer>
    </div>
  );
};

export default Landing;

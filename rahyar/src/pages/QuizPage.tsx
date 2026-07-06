import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [qRes, qqRes] = await Promise.all([
        supabase.from('quizzes').select('*').eq('id', id).single(),
        supabase.from('quiz_questions').select('*').eq('quiz_id', id).order('sort_order'),
      ]);
      if (qRes.data) setQuiz(qRes.data);
      if (qqRes.data) setQuestions(qqRes.data);
    };
    load();
  }, [id]);

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQ]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (!user || !quiz) return;
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let correct = 0;
    const skillMap: Record<string, { total: number; correct: number }> = {};
    const answerDetails: any[] = [];

    questions.forEach((q, i) => {
      const userAns = answers[i] ?? -1;
      const isCorrect = userAns === q.correct_answer;
      if (isCorrect) correct++;
      
      if (!skillMap[q.skill_tag]) skillMap[q.skill_tag] = { total: 0, correct: 0 };
      skillMap[q.skill_tag].total++;
      if (isCorrect) skillMap[q.skill_tag].correct++;

      answerDetails.push({
        question_id: q.id,
        selected: userAns,
        correct: q.correct_answer,
        is_correct: isCorrect,
      });
    });

    const score = Math.round((correct / questions.length) * 100);
    const res = { score, correct, total: questions.length, skills: skillMap, time: timeSpent };
    setResult(res);
    setShowResult(true);

    // Save attempt
    await supabase.from('quiz_attempts').insert({
      user_id: user.id,
      quiz_id: quiz.id,
      score,
      total_questions: questions.length,
      correct_answers: correct,
      answers: answerDetails,
      skill_analysis: skillMap,
      time_spent_seconds: timeSpent,
    });

    // Add XP
    const xpEarned = Math.round(quiz.xp_reward * (score / 100));
    if (xpEarned > 0) {
      await supabase.from('xp_transactions').insert({
        user_id: user.id,
        amount: xpEarned,
        reason: `آزمون: ${quiz.title_fa}`,
        source_type: 'quiz',
        source_id: quiz.id,
      });
      // Update profile XP
      const { data: profile } = await supabase.from('profiles').select('total_xp, level').eq('user_id', user.id).single();
      if (profile) {
        const newXp = profile.total_xp + xpEarned;
        const newLevel = Math.floor(newXp / 200) + 1;
        await supabase.from('profiles').update({ total_xp: newXp, level: newLevel }).eq('user_id', user.id);
      }
    }

    // Award badges based on new XP
    try {
      const { data: profileData } = await supabase.from('profiles').select('total_xp').eq('user_id', user.id).single();
      if (profileData) {
        const totalXp = profileData.total_xp;
        const { data: allBadges } = await supabase.from('badges').select('id, xp_required');
        const { data: earnedBadges } = await supabase.from('user_badges').select('badge_id').eq('user_id', user.id);
        const earnedIds = new Set(earnedBadges?.map(b => b.badge_id) || []);
        const newBadges = (allBadges || []).filter(b => b.xp_required <= totalXp && !earnedIds.has(b.id));
        if (newBadges.length > 0) {
          await supabase.from('user_badges').insert(newBadges.map(b => ({ user_id: user.id, badge_id: b.id })));
          toast({ title: '🏅 نشان جدید!', description: `${newBadges.length} نشان جدید کسب کردید!` });
        }
      }
    } catch (e) { /* badge awarding is best-effort */ }

    toast({ title: `نتیجه: ${score}%`, description: `${correct} پاسخ صحیح از ${questions.length} سؤال | ${xpEarned} XP کسب شد` });
  };

  if (!quiz || questions.length === 0) {
    return <AppLayout><div className="flex items-center justify-center h-64 text-muted-foreground">در حال بارگذاری...</div></AppLayout>;
  }

  if (showResult && result) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto animate-scale-in">
          <div className="bg-card rounded-3xl p-8 shadow-elevated border border-border text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${result.score >= 70 ? 'bg-emerald/10' : result.score >= 40 ? 'bg-secondary/10' : 'bg-destructive/10'}`}>
              <span className="text-3xl font-black">{result.score}%</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{quiz.title_fa}</h2>
            <p className="text-muted-foreground mb-6">{result.correct} پاسخ صحیح از {result.total} سؤال</p>

            {/* Skill Breakdown */}
            <div className="text-right mb-6">
              <h3 className="font-bold mb-3">تحلیل مهارت‌ها</h3>
              <div className="space-y-2">
                {Object.entries(result.skills).map(([skill, data]: [string, any]) => (
                  <div key={skill} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">{skill}</span>
                    <span className="text-sm font-bold text-primary">{Math.round((data.correct / data.total) * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review answers */}
            <div className="text-right mb-6">
              <h3 className="font-bold mb-3">مرور پاسخ‌ها</h3>
              <div className="space-y-3">
                {questions.map((q, i) => {
                  const userAns = answers[i] ?? -1;
                  const isCorrect = userAns === q.correct_answer;
                  const opts = (q.options as any[]) || [];
                  return (
                    <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'border-emerald/30 bg-emerald/5' : 'border-destructive/30 bg-destructive/5'}`}>
                      <div className="flex items-start gap-2 mb-2">
                        {isCorrect ? <CheckCircle className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />}
                        <p className="text-sm font-medium">{q.question_fa}</p>
                      </div>
                      {!isCorrect && (
                        <p className="text-xs text-muted-foreground mr-7">پاسخ صحیح: {opts[q.correct_answer]}</p>
                      )}
                      {q.explanation_fa && (
                        <p className="text-xs text-primary mr-7 mt-1">{q.explanation_fa}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/tests')} variant="outline">بازگشت به آزمون‌ها</Button>
              <Button onClick={() => { setShowResult(false); setAnswers({}); setCurrentQ(0); }} className="bg-gradient-primary text-primary-foreground">تکرار آزمون</Button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const q = questions[currentQ];
  const opts = (q.options as any[]) || [];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{quiz.title_fa}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            سؤال {currentQ + 1} از {questions.length}
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="bg-card rounded-2xl p-8 shadow-card border border-border">
          <p className="text-lg font-medium mb-6">{q.question_fa}</p>
          <div className="space-y-3">
            {opts.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all ${
                  answers[currentQ] === i
                    ? 'border-primary bg-primary/5 shadow-glow'
                    : 'border-border hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                <span className="text-sm">{opt}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setCurrentQ(c => c - 1)} disabled={currentQ === 0}>قبلی</Button>
            {currentQ < questions.length - 1 ? (
              <Button onClick={() => setCurrentQ(c => c + 1)} className="bg-gradient-primary text-primary-foreground" disabled={answers[currentQ] === undefined}>بعدی</Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-gradient-primary text-primary-foreground" disabled={Object.keys(answers).length < questions.length}>ثبت پاسخ‌ها</Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuizPage;

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, User } from 'lucide-react';
import { supabase } from '@/integrations/client';

type Msg = { role: 'user' | 'assistant'; content: string };

const ChatAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading || !user) return;
    const userMsg: Msg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Save user message
      await supabase.from('chat_history').insert({ user_id: user.id, role: 'user', content: userMsg.content });

      // Call AI
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!resp.ok || !resp.body) throw new Error('خطا در اتصال به دستیار');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantSoFar = '';
      let textBuffer = '';

      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { role: 'assistant', content: assistantSoFar }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let ni: number;
        while ((ni = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, ni);
          textBuffer = textBuffer.slice(ni + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const json = line.slice(6).trim();
          if (json === '[DONE]') break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {}
        }
      }

      // Save assistant message
      if (assistantSoFar) {
        await supabase.from('chat_history').insert({ user_id: user.id, role: 'assistant', content: assistantSoFar });
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'متأسفانه خطایی رخ داد. لطفاً دوباره تلاش کنید.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto animate-slide-up h-[calc(100vh-3rem)] flex flex-col">
        <h1 className="text-3xl font-bold mb-2">دستیار هوشمند</h1>
        <p className="text-muted-foreground mb-4">سؤالات آموزشی خود را بپرسید</p>

        <div className="flex-1 bg-card rounded-2xl shadow-card border border-border flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Bot className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm">سلام! من دستیار هوشمند رَه‌یار هستم. چطور می‌تونم کمکتون کنم؟</p>
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? '' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-primary/10' : 'bg-gradient-primary'}`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
                </div>
                <div className={`flex-1 p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-muted/50' : 'bg-primary/5'}`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="p-3 rounded-2xl bg-primary/5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <Input value={input} onChange={e => setInput(e.target.value)} placeholder="سؤال خود را بنویسید..."
              onKeyDown={e => e.key === 'Enter' && send()} disabled={loading} />
            <Button onClick={send} size="icon" className="bg-gradient-primary text-primary-foreground" disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ChatAssistant;

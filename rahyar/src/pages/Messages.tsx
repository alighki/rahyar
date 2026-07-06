import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';

const Messages = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('user_id, full_name').neq('user_id', user.id)
      .then(({ data }) => { if (data) setUsers(data); });
  }, [user]);

  useEffect(() => {
    if (!user || !selectedUser) return;
    const load = async () => {
      const { data } = await supabase.from('messages').select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${user.id})`)
        .order('created_at');
      if (data) setMessages(data);
    };
    load();
  }, [user, selectedUser]);

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMsg.trim()) return;
    await supabase.from('messages').insert({ sender_id: user.id, receiver_id: selectedUser, content: newMsg.trim() });
    setNewMsg('');
    // Reload
    const { data } = await supabase.from('messages').select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${user.id})`)
      .order('created_at');
    if (data) setMessages(data);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto animate-slide-up">
        <h1 className="text-3xl font-bold mb-6">پیام‌ها</h1>
        <div className="grid grid-cols-3 gap-4 h-[600px]">
          {/* Users list */}
          <div className="bg-card rounded-2xl shadow-card border border-border overflow-y-auto">
            {users.map(u => (
              <button key={u.user_id} onClick={() => setSelectedUser(u.user_id)}
                className={`w-full text-right p-4 border-b border-border hover:bg-muted/50 transition-colors ${selectedUser === u.user_id ? 'bg-primary/5' : ''}`}>
                <p className="font-medium text-sm">{u.full_name}</p>
              </button>
            ))}
            {users.length === 0 && <p className="text-center text-muted-foreground py-8 text-sm">کاربری یافت نشد</p>}
          </div>

          {/* Chat area */}
          <div className="col-span-2 bg-card rounded-2xl shadow-card border border-border flex flex-col">
            {selectedUser ? (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {messages.map(m => (
                    <div key={m.id} className={`flex ${m.sender_id === user?.id ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${m.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-border flex gap-2">
                  <Input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="پیام خود را بنویسید..."
                    onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <Button onClick={sendMessage} size="icon" className="bg-gradient-primary text-primary-foreground">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-sm">یک کاربر را انتخاب کنید</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Messages;

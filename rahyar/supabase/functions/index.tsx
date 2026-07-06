import { useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("");
  const [reply, setReply] = useState("");

  async function handleSend() {
    if (!msg) return;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "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" // ⚠️ مستقیم بذار
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: msg }]
      })
    });

    const data = await res.json();
    setReply(data.choices[0].message.content);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chat with AI</h1>
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        rows={5}
        cols={50}
      />
      <br />
      <button onClick={handleSend}>Send</button>
      <div style={{ marginTop: 20 }}>
        <b>Reply:</b> {reply}
      </div>
    </div>
  );
}
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    setLoading(true);
    const newMessages = [...messages, { type: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...newMessages, { type: 'bot', text: data.reply }]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f7f6] text-gray-800 p-6">
      <Head><title>Whisper Companion</title></Head>
      <h1 className="text-2xl mb-4 font-semibold">Whisper Companion</h1>
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 rounded ${msg.type === 'user' ? 'bg-white text-right' : 'bg-[#eee] text-left'}`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="italic text-gray-500">Responding...</div>}
      </div>
      <div className="flex">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border p-2 rounded-l" />
        <button onClick={sendMessage} className="bg-[#84746b] text-white px-4 rounded-r">Send</button>
      </div>
    </div>
  );
}
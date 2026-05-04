'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

/* ── Types ── */
type Role = 'user' | 'bot';
interface Message {
  id: number;
  role: Role;
  text: string;
  loading?: boolean;
}

/* ── Optimized Components ── */
const LoadingDots = React.memo(() => (
  <div style={{ display: 'flex', gap: 5, padding: '8px 0' }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#4ade80',
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
        }}
      />
    ))}
  </div>
));

const MessageBubble = React.memo(({ msg }: { msg: Message }) => {
  const isUser = msg.role === 'user';
  
  // Robust table parsing
  const tableData = useMemo(() => {
    const match = msg.text.match(/(\|[\s\S]+\|)/);
    if (!match) return null;
    
    const lines = match[1].trim().split('\n').filter(l => l.includes('|'));
    if (lines.length < 3) return null;

    const parseRow = (line: string) =>
      line.split('|').filter(c => c.trim() !== '').map(c => c.trim());

    try {
      return { 
        headers: parseRow(lines[0]), 
        rows: lines.slice(2).map(parseRow),
        fullMatch: match[0]
      };
    } catch { return null; }
  }, [msg.text]);

  const prose = tableData 
    ? msg.text.replace(tableData.fullMatch, '').replace(/^###\s+/, '')
    : msg.text.replace(/^###\s+/, '');

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', gap: 12, marginBottom: 24, position: 'relative', zIndex: 1 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
          🏏
        </div>
      )}
      <div style={{ maxWidth: isUser ? '75%' : '90%' }}>
        {msg.loading ? <LoadingDots /> : (
          <div style={{ 
            fontSize: 14, 
            lineHeight: 1.7, 
            whiteSpace: 'pre-wrap',
            background: isUser ? '#1a1a2e' : 'transparent',
            padding: isUser ? '12px 16px' : '0',
            borderRadius: isUser ? '18px 18px 4px 18px' : '0',
            color: isUser ? '#e8e6f0' : '#d1d5db',
            border: isUser ? '1px solid rgba(255,255,255,0.05)' : 'none'
          }}>
            {prose.trim()}
          </div>
        )}
        
        {tableData && !msg.loading && (
          <div style={{ overflowX: 'auto', marginTop: 12, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, background: 'rgba(255,255,255,0.02)' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
              <thead style={{ background: 'rgba(74, 222, 128, 0.08)' }}>
                <tr>
                  {tableData.headers.map((h, i) => (
                    <th key={i} style={{ padding: '12px', textAlign: 'left', color: '#4ade80', fontWeight: 600, borderBottom: '1px solid rgba(74,222,128,0.2)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '10px 12px', color: ci === 0 ? '#fff' : '#9ca3af' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
});

export default function CricketChat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: "Hi! I'm your cricket stats assistant 🏏\n\nAsk me anything about players or matches." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  
  const sessionId = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);

    const fetchHistory = async () => {
      try {
        const res = await fetch('https://cricketbackend-ashen.vercel.app/api/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const history = data.flatMap((item: any, i: number) => [
            { id: i * 2 + 1, role: 'user', text: item.question },
            { id: i * 2 + 2, role: 'bot', text: item.answer }
          ]);
          setMessages(prev => [...prev, ...history]);
        }
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async (customText?: string) => {
    const text = (customText || input).trim();
    const token = localStorage.getItem('token');
    if (!text || loading || !token) return;

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }, { id: Date.now() + 1, role: 'bot', text: '', loading: true }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://cricketbackend-ashen.vercel.app/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ question: text, sessionId: sessionId.current }),
      });

      if (res.status === 401) {
        setIsLoggedIn(false);
        return;
      }

      const data = await res.json();
      sessionId.current = data.sessionId || null;
      setMessages(prev => [...prev.slice(0, -1), { id: Date.now() + 2, role: 'bot', text: data.response || 'No results found.' }]);
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { id: Date.now() + 2, role: 'bot', text: 'Connection error.' }]);
    } finally { setLoading(false); }
  }, [input, loading]);

  // Auth Guard View
  if (isLoggedIn === false) {
    return (
      <div style={{ height: '100vh', background: '#0d0d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <style>{styles}</style>
        <div className="orb" style={{ width: 400, height: 400, background: '#ef4444', top: '20%', left: '30%', opacity: 0.1 }} />
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '40px 30px',
          textAlign: 'center',
          backdropFilter: 'blur(20px)',
          maxWidth: 400,
          zIndex: 1
        }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Access Restricted</h2>
          <p style={{ color: '#9ca3af', fontSize: 14, lineHeight: 1.6, marginBottom: 30 }}>
            Please login to your account to use the Cricket Stats Agent and access advanced player analytics.
          </p>
          <Link href="/auth" style={{
            display: 'block',
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            background: '#4ade80',
            color: '#0d0d1a',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(74, 222, 128, 0.3)'
          }}>
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (isLoggedIn === null) return <div style={{ background: '#0d0d1a', height: '100vh' }} />;

  return (
    <div className="container">
      <style>{styles}</style>
      <div className="orb" style={{ width: 500, height: 500, background: '#16a34a', top: -200, left: -200, opacity: 0.15 }} />
      
      <div className="header">
        <div style={{ fontSize: 24 }}>🏏</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 16 }}>Cricket Stats Agent</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Powered by Real-time Data</div>
        </div>
      </div>

      <div className="chat-box">
        {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
        <div ref={bottomRef} />
      </div>
      
      <div className="input-area">
        <div className="input-container">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about Babar Azam, Kohli, or match results..."
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .container { height: 100vh; display: flex; flex-direction: column; background: #0d0d1a; color: #fff; max-width: 900px; margin: 0 auto; position: relative; overflow: hidden; }
  .orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .header { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 12px; background: rgba(13,13,26,0.8); backdrop-filter: blur(10px); z-index: 10; }
  .chat-box { flex: 1; overflow-y: auto; padding: 24px; scrollbar-width: thin; scrollbar-color: #333 transparent; }
  .input-area { padding: 20px; background: rgba(13,13,26,0.8); backdrop-filter: blur(10px); z-index: 10; }
  .input-container { display: flex; gap: 10px; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); }
  input { flex: 1; background: transparent; border: none; color: #fff; padding: 10px 14px; outline: none; font-size: 14px; }
  button { background: #4ade80; color: #0d0d1a; border: none; padding: 0 20px; border-radius: 10px; cursor: pointer; font-weight: 600; transition: opacity 0.2s; }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
`;
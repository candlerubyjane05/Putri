
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiAssistant } from '../services/geminiService';
import { 
  Send, 
  Bot, 
  User as UserIcon, 
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

const AiAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'bot', text: 'Halo! Saya asisten cerdas DigiLib FH UNDANA. Ada yang bisa saya bantu terkait riset hukum atau koleksi perpustakaan Anda hari ini?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const botText = await getGeminiAssistant(input);
    const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: botText || 'Maaf, terjadi kesalahan.' };
    
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-bold flex items-center">
              <span>Smart Librarian</span>
              <Sparkles size={14} className="ml-2 text-blue-400" />
            </h3>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Powered by Gemini AI</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ id: 1, role: 'bot', text: 'Sesi baru dimulai. Apa yang ingin Anda tanyakan?' }])}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] space-x-3 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
              }`}>
                {m.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] space-x-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input 
            type="text" 
            placeholder="Tanyakan tentang referensi hukum pidana, tata negara, dll..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-widest font-bold">
          Asisten AI dapat memberikan informasi yang tidak akurat. Selalu verifikasi sumber hukum Anda.
        </p>
      </div>
    </div>
  );
};

export default AiAssistant;

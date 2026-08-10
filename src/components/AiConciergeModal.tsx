import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { apiService } from '../services/api';
import { Sparkles, X, Send, Bot, User, Compass, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiConciergeModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Good day. I am LuxeWay AI Concierge. How may I assist with your travel arrangements, villa bookings, or bespoke charters today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isConciergeOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await apiService.aiChat(query, messages);
      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'ai',
        text: res.reply || 'I am looking into that right away.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `a-err-${Date.now()}`,
          sender: 'ai',
          text: 'I apologize, I experienced a brief connection lapse. Please let me know how I can assist with St. Barts, Amalfi Coast, or Zermatt stays.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'Private yacht in Amalfi Coast for 6 guests',
    'Recommend clifftop villas in St. Barts',
    'Ski chalet in Zermatt with Matterhorn view',
    'How do I book a private jet transfer?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full sm:w-[440px] h-[600px] bg-[#141a32] text-[#fbf9f9] rounded-2xl shadow-2xl border border-[#2d3866] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-[#1c2445] border-b border-[#2d3866] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-[#ffdea5] text-[#141a32] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#141a32]" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-sm text-white flex items-center gap-2">
                <span>Luxe AI Concierge</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2e3a6e] text-[#ffdea5] font-sans font-bold uppercase">
                  Powered by Gemini
                </span>
              </h3>
              <p className="text-[10px] text-[#9a9fa0]">24/7 Private Travel Advisor</p>
            </div>
          </div>
          <button
            onClick={() => setIsConciergeOpen(false)}
            className="p-1.5 rounded-full hover:bg-[#2d3866] text-[#b3b9d1] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#ffdea5] text-[#141a32] flex items-center justify-center shrink-0 font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl p-3 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#ffdea5] text-[#141a32] font-medium rounded-br-none'
                    : 'bg-[#1c2445] text-[#e0e4f2] border border-[#2d3866] rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                <span className={`text-[9px] block mt-1 ${m.sender === 'user' ? 'text-[#5e4b1c]' : 'text-[#7a84a6]'}`}>
                  {m.time}
                </span>
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#364273] text-white flex items-center justify-center shrink-0 font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5 items-center text-[#ffdea5]">
              <div className="w-7 h-7 rounded-full bg-[#ffdea5] text-[#141a32] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#1c2445] p-3 rounded-xl border border-[#2d3866] text-xs text-[#b3b9d1] flex items-center gap-2">
                <span>Curating bespoke response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-[#171f3f] border-t border-[#2d3866] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="px-2.5 py-1 rounded-full bg-[#232d54] text-[#c4cbdc] hover:bg-[#ffdea5] hover:text-[#141a32] text-[10px] transition-all cursor-pointer shrink-0 border border-[#2d3866]"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#1c2445] border-t border-[#2d3866]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about private villas, yacht charters, dining..."
              className="flex-1 px-3.5 py-2.5 bg-[#141a32] text-xs text-white placeholder-[#687299] rounded-xl border border-[#2d3866] focus:outline-none focus:border-[#ffdea5]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 rounded-xl bg-[#ffdea5] text-[#141a32] hover:bg-[#ffe7be] disabled:opacity-50 transition-colors cursor-pointer font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#7a84a6]">
            <span>Need full planning?</span>
            <Link
              to="/trip-planner"
              onClick={() => setIsConciergeOpen(false)}
              className="text-[#ffdea5] flex items-center gap-1 hover:underline"
            >
              <span>Open AI Trip Planner</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

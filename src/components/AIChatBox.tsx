import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Sparkles, HelpCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { api } from '../services/api';


interface Message {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AIChatBox: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your EduManage Support Assistant. Select a quick question below or ask me about attendance, fees, messaging, grades, or study materials.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultQA = [
    {
      question: '📅 How to check attendance?',
      keywords: ['attendance', 'calendar', 'present', 'absent', 'may'],
      answer: "You can view the Attendance Calendar card on the Parent Dashboard, or under the 'Attendance Calendar' tab on the Student Dashboard. Present days are green, absent days (May 8 and May 20) are red, and weekends are grey.",
    },
    {
      question: '💳 How to pay tuition fees?',
      keywords: ['fee', 'pay', 'billing', 'card', 'remit', 'dues', 'invoice'],
      answer: "Navigate to the Tuition Billing Ledger on the Parent Dashboard. Click the 'Pay Now' button next to any pending/overdue item, enter your card details in the secure payment gateway modal, and confirm the transaction.",
    },
    {
      question: '💬 How to contact my tutor?',
      keywords: ['teacher', 'tutor', 'message', 'chat', 'contact', 'communication'],
      answer: "Use the 'Messaging Station' on the Student Dashboard or the 'Direct Messages' tab on the Parent Dashboard. You can select your tutor from the dropdown menu and type a message to receive immediate simulated responses.",
    },
    {
      question: '📚 Where are study resources?',
      keywords: ['resource', 'material', 'pdf', 'book', 'syllabus', 'mechanics', 'practice'],
      answer: "Academic materials and PDFs matching your registered courses are available under the 'Student Hub Academic Resources' section at the bottom of the Student Dashboard.",
    },
    {
      question: '📝 How to view exam results?',
      keywords: ['grade', 'exam', 'result', 'score', 'mark', 'assessment'],
      answer: "Go to the Student Dashboard. Under the selector menu, check the 'Exams Timeline' tab for upcoming assessments, the 'Assessments Log' tab for instructor notes and marks, or 'Term Results' to download your final PDF report.",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleResponse = async (userText: string, updatedHistory: Message[]) => {
    setIsTyping(true);
    try {
      // Map history to sender and text format expected by backend API
      const apiHistory = updatedHistory.map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      }));

      const response = await api.chatWithAI(userText, apiHistory);
      const botResponse: Message = {
        sender: 'bot',
        text: response.text || "No response received.",
        time: response.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("AI Chat error, falling back to offline QA:", error);
      const lowercaseInput = userText.toLowerCase();

      // Check for keyword matches
      const matchedQA = defaultQA.find((item) =>
        item.keywords.some((keyword) => lowercaseInput.includes(keyword))
      );

      const botResponse: Message = {
        sender: 'bot',
        text: matchedQA
          ? matchedQA.answer
          : "I am having trouble connecting to my service, and am operating in offline mode. Please click one of the quick questions below, or try searching for keywords like 'attendance', 'fees', 'message', 'materials', or 'results'.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      sender: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    const currentInput = input;
    setInput('');
    handleResponse(currentInput, updatedHistory);
  };

  const handleQuestionClick = (questionText: string) => {
    const userMessage: Message = {
      sender: 'user',
      text: questionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    handleResponse(questionText, updatedHistory);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[340px] sm:w-[380px] h-[485px] bg-slate-900/95 border border-slate-800 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <Bot className="h-4.5 w-4.5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    {t('EduManage AI Support')} <Sparkles className="h-3 w-3 text-indigo-400 animate-pulse" />
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[9px] text-emerald-400 font-semibold uppercase block tracking-wider">{t('Online Assistant')}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer transition"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] leading-relaxed text-xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-950 text-slate-350 rounded-tl-none border border-slate-850'
                    }`}
                  >
                    {t(msg.text)}
                  </div>
                  <span className="text-[8px] text-slate-500 mt-1 font-mono pr-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold bg-slate-950/40 p-2.5 rounded-xl border border-slate-850/40 w-max">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1 h-1 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  <span>{t('AI Assistant is thinking...')}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Grid */}
            <div className="px-4 py-2 border-t border-slate-850/60 bg-slate-950/30">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <HelpCircle className="h-3 w-3" /> {t('Quick Questions')}
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {defaultQA.map((qa, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(qa.question)}
                    className="text-[10px] bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-850 hover:border-slate-750 px-2 py-1 rounded-lg font-medium transition cursor-pointer"
                  >
                    {t(qa.question)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-850 bg-slate-950/80 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('Ask about attendance, fees, messaging...')}
                className="bg-slate-900 border border-slate-800 text-xs p-2.5 rounded-xl flex-1 outline-none focus:border-indigo-500 text-slate-200"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-2.5 rounded-xl transition shrink-0 cursor-pointer flex items-center justify-center ${
                  input.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg text-white hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="h-6 w-6" />
      </motion.button>
    </div>
  );
};

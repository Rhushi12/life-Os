import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import { Message, ResearchContext, UserProfile } from '../types';
import { runInterviewer } from '../services/geminiService';
import { cn } from '../lib/utils';

interface ChatInterfaceProps {
    onComplete: (context: ResearchContext) => void;
    userProfile?: UserProfile | null;
}

export function ChatInterface({ onComplete, userProfile }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize personalized greeting
        const greeting = userProfile
            ? `Hi ${userProfile.displayName}! I see you're a ${userProfile.occupation}. What big objective do you want to achieve?`
            : "Hi! I'm your AI Goal Analyst. Tell me, what big objective do you want to achieve?";

        setMessages([{ role: 'assistant', content: greeting }]);
    }, [userProfile]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // Pass history excluding the latest user message (it's added in the UI but service takes history + current)
            // Actually service takes history array. Let's pass the NEW history including the user message?
            // The service signature is `runInterviewer(history: Message[], currentInput: string)`
            // So we pass the *previous* history and the *current* input.

            const response = await runInterviewer(messages, userMsg.content, userProfile);

            if (response.isComplete && response.context) {
                setMessages(prev => [...prev, { role: 'assistant', content: "Great! I have everything I need. Starting deep research now..." }]);
                setTimeout(() => {
                    onComplete(response.context!);
                }, 1500);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: response.message }]);
            }

        } catch (error) {
            console.error("Interview Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col h-[600px] bg-zinc-950/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5100fd]/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#5100fd]" />
                </div>
                <div>
                    <h3 className="text-white font-medium text-sm">Goal Interview</h3>
                    <p className="text-xs text-zinc-500">Clarifying your objectives</p>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div key={idx} className={cn(
                        "flex gap-4 max-w-[85%]",
                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            msg.role === 'user' ? "bg-zinc-800" : "bg-[#5100fd]"
                        )}>
                            {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-white" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed",
                            msg.role === 'user'
                                ? "bg-zinc-800 text-zinc-200 rounded-tr-none"
                                : "bg-zinc-900/80 border border-zinc-800 text-zinc-300 rounded-tl-none"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 max-w-[85%]">
                        <div className="w-8 h-8 rounded-full bg-[#5100fd] flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
                <div className="relative flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your answer..."
                        className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5100fd] transition-colors"
                        disabled={isLoading}
                        autoFocus
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-3 bg-[#5100fd] hover:bg-[#6610ff] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

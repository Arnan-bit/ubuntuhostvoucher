'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Code, 
    Send, 
    Minimize2, 
    Maximize2, 
    X, 
    Bot, 
    User, 
    Copy, 
    Check,
    Sparkles,
    Terminal,
    FileCode,
    Zap
} from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    codeBlocks?: Array<{
        language: string;
        code: string;
    }>;
}

interface AICodingAssistantProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    zIndex?: number;
}

export const AICodingAssistant: React.FC<AICodingAssistantProps> = ({ 
    position = 'top-right',
    zIndex = 9999 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'assistant',
            content: '👋 Hi! I\'m your AI Coding Assistant. I can help you with:\n\n• React/Next.js development\n• TypeScript issues\n• CSS/Tailwind styling\n• Database queries\n• Performance optimization\n• Bug fixes\n\nWhat would you like to work on?',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI response (replace with actual AI API call)
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: generateAIResponse(inputValue),
                timestamp: new Date(),
                codeBlocks: extractCodeBlocks(inputValue)
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (input: string): string => {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('error') || lowerInput.includes('bug')) {
            return '🔧 I can help you debug that! Here are some common solutions:\n\n1. Check your imports and exports\n2. Verify component props and types\n3. Look for missing dependencies\n4. Check console for detailed error messages\n\nCould you share the specific error message?';
        }
        
        if (lowerInput.includes('performance') || lowerInput.includes('slow')) {
            return '⚡ Performance optimization tips:\n\n• Use React.memo() for expensive components\n• Implement lazy loading with React.lazy()\n• Optimize images with Next.js Image component\n• Use useMemo() and useCallback() hooks\n• Consider code splitting\n\nWhat specific performance issue are you facing?';
        }
        
        if (lowerInput.includes('css') || lowerInput.includes('style')) {
            return '🎨 CSS/Styling help:\n\n• Use Tailwind utility classes for consistency\n• Implement dark mode with CSS variables\n• Use Flexbox/Grid for layouts\n• Consider CSS-in-JS solutions\n\nWhat styling challenge can I help with?';
        }
        
        return '💡 I\'m here to help! Could you provide more details about what you\'re working on? The more specific you are, the better I can assist you with:\n\n• Code examples\n• Error messages\n• Expected vs actual behavior\n• Technology stack details';
    };

    const extractCodeBlocks = (input: string): Array<{language: string, code: string}> => {
        // Simple code block extraction (enhance as needed)
        if (input.includes('function') || input.includes('const') || input.includes('import')) {
            return [{
                language: 'typescript',
                code: `// Example solution based on your query
const optimizedComponent = React.memo(() => {
    // Your optimized code here
    return <div>Optimized Component</div>;
});`
            }];
        }
        return [];
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedCode(text);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left': return 'top-4 left-4';
            case 'bottom-left': return 'bottom-4 left-4';
            case 'bottom-right': return 'bottom-4 right-4';
            default: return 'top-4 right-4';
        }
    };

    return (
        <div 
            className={`fixed ${getPositionClasses()} z-[${zIndex}]`}
            style={{ zIndex }}
        >
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Bot size={24} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
                            isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
                        }`}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles size={20} />
                                <span className="font-semibold">AI Coding Assistant</span>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1 hover:bg-white/20 rounded"
                                >
                                    {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[480px]">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-2xl ${
                                                    message.type === 'user'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {message.type === 'assistant' && <Bot size={16} className="mt-1 flex-shrink-0" />}
                                                    {message.type === 'user' && <User size={16} className="mt-1 flex-shrink-0" />}
                                                    <div className="flex-1">
                                                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                                                        {message.codeBlocks?.map((block, index) => (
                                                            <div key={index} className="mt-2 bg-gray-900 rounded-lg overflow-hidden">
                                                                <div className="flex items-center justify-between bg-gray-800 px-3 py-2">
                                                                    <span className="text-xs text-gray-400">{block.language}</span>
                                                                    <button
                                                                        onClick={() => copyToClipboard(block.code)}
                                                                        className="text-gray-400 hover:text-white"
                                                                    >
                                                                        {copiedCode === block.code ? <Check size={14} /> : <Copy size={14} />}
                                                                    </button>
                                                                </div>
                                                                <pre className="p-3 text-sm text-green-400 overflow-x-auto">
                                                                    <code>{block.code}</code>
                                                                </pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl">
                                                <div className="flex items-center gap-2">
                                                    <Bot size={16} />
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Ask me anything about coding..."
                                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!inputValue.trim() || isTyping}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

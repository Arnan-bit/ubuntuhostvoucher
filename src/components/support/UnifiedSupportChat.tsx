'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageCircle, 
    X, 
    Send, 
    Bot, 
    Code, 
    Phone,
    User,
    Sparkles,
    Wand2,
    Headphones,
    Clock,
    CheckCircle
} from 'lucide-react';

interface UnifiedSupportChatProps {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    zIndex?: number;
}

type ChatMode = 'selection' | 'hostvoucher-ai' | 'coding-assistant' | 'whatsapp-support';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export const UnifiedSupportChat: React.FC<UnifiedSupportChatProps> = ({
    position = 'bottom-right',
    zIndex = 9999
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [chatMode, setChatMode] = useState<ChatMode>('selection');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getPositionClasses = () => {
        switch (position) {
            case 'top-left': return 'top-4 left-4';
            case 'bottom-left': return 'bottom-4 left-4';
            case 'top-right': return 'top-4 right-4';
            default: return 'bottom-4 right-4';
        }
    };

    const handleModeSelect = (mode: ChatMode) => {
        setChatMode(mode);
        setMessages([]);
        
        // Initialize with welcome message based on mode
        const welcomeMessages = {
            'hostvoucher-ai': {
                id: '1',
                type: 'assistant' as const,
                content: '🎯 Hello! I\'m HostVoucher AI Assistant. I can help you with:\n\n• Finding the best deals\n• Hosting and domain information\n• Voucher usage guides\n• Service recommendations\n• Website optimization tips\n\nHow can I assist you today?',
                timestamp: new Date()
            },
            'coding-assistant': {
                id: '1',
                type: 'assistant' as const,
                content: '💻 Hi! I\'m your AI Coding Assistant. I can help you with:\n\n• Code debugging and optimization\n• Frontend/Backend development\n• Database queries and design\n• API integration\n• Performance improvements\n• Best practices\n\nWhat coding challenge can I help you solve?',
                timestamp: new Date()
            },
            'whatsapp-support': {
                id: '1',
                type: 'assistant' as const,
                content: '📱 Hello! This is HostVoucher WhatsApp Support service.\n\n⚠️ **IMPORTANT**: Admin responds slowly. For faster response, use English or local language.\n\n📞 **Admin WhatsApp**: +62 887-5023-2020\n\n🕐 **Operating Hours**: 09:00 - 18:00 GMT+7\n\nType your message and it will be forwarded to admin via WhatsApp.',
                timestamp: new Date()
            }
        };

        if (mode !== 'selection') {
            setMessages([welcomeMessages[mode]]);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const messageText = inputValue;
        setInputValue('');

        if (chatMode === 'whatsapp-support') {
            // Send to WhatsApp
            const encodedMessage = encodeURIComponent(
                `Hello HostVoucher Admin! 👋\n\n${messageText}\n\n---\nSent from HostVoucher website\nTime: ${new Date().toLocaleString('en-US')}`
            );
            
            const whatsappUrl = `https://wa.me/6288750232020?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            
            // Add confirmation message
            setTimeout(() => {
                const confirmMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: '✅ Your message has been forwarded to WhatsApp admin!\n\n📱 Please continue the conversation on WhatsApp or wait for admin reply.\n\n⏰ **Reminder**: Admin responds faster with English or local language.',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, confirmMessage]);
            }, 1000);
            return;
        }

        // Handle AI responses
        setIsTyping(true);
        setTimeout(() => {
            const aiResponse = generateAIResponse(messageText, chatMode);
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (input: string, mode: ChatMode): Message => {
        const lowerInput = input.toLowerCase();
        
        if (mode === 'hostvoucher-ai') {
            if (lowerInput.includes('hosting') || lowerInput.includes('domain')) {
                return {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: '🌐 For hosting and domains, we have the best deals!\n\n**Hosting Recommendations:**\n• Shared Hosting: Starting from $2.99/month\n• VPS Hosting: High performance $9.99/month\n• Cloud Hosting: Scalable $14.99/month\n\n**Free Domain** with annual hosting packages!\n\n🎫 Use code: HOSTVOUCHER for 20% discount',
                    timestamp: new Date()
                };
            }
            
            if (lowerInput.includes('voucher') || lowerInput.includes('kupon')) {
                return {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: '🎫 How to use HostVoucher vouchers:\n\n1. **Choose the service** you want\n2. **Copy voucher code** from deals page\n3. **Paste at checkout** on provider site\n4. **Enjoy discounts** up to 80%!\n\n💡 **Tips**: Check expiration date and terms & conditions for each voucher.',
                    timestamp: new Date()
                };
            }
        }
        
        if (mode === 'coding-assistant') {
            if (lowerInput.includes('error') || lowerInput.includes('bug')) {
                return {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: '🐛 I can help you debug that error!\n\n**Common debugging steps:**\n1. Check browser console for detailed errors\n2. Verify all imports and dependencies\n3. Clear cache and restart dev server\n4. Check network requests in DevTools\n\n**For ChunkLoadError specifically:**\n• Clear browser cache\n• Check if all chunks are properly built\n• Verify publicPath in next.config.js\n\nCan you share the specific error message?',
                    timestamp: new Date()
                };
            }
            
            if (lowerInput.includes('deploy') || lowerInput.includes('hosting')) {
                return {
                    id: (Date.now() + 1).toString(),
                    type: 'assistant',
                    content: '🚀 **Deployment Guide:**\n\n**1. Build your app:**\n```bash\nnpm run build\n```\n\n**2. Upload files:**\n• Upload `.next/` folder\n• Upload `public/` folder\n• Upload `package.json`\n\n**3. Configure hosting:**\n• Set Node.js version\n• Configure environment variables\n• Set start command: `npm start`\n\nNeed help with specific hosting platform?',
                    timestamp: new Date()
                };
            }
        }
        
        return {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: mode === 'hostvoucher-ai' 
                ? '🤔 Sorry, I don\'t quite understand your question. Could you provide more details? I\'m ready to help with hosting, domains, vouchers, or other HostVoucher services!'
                : '🤔 I need more context to help you better. Could you provide more details about what you\'re trying to achieve?',
            timestamp: new Date()
        };
    };

    const supportOptions = [
        {
            id: 'hostvoucher-ai',
            title: 'HostVoucher AI',
            description: 'AI untuk deals, hosting, domain',
            icon: Sparkles,
            color: 'from-purple-500 to-pink-500',
            textColor: 'text-purple-600'
        },
        {
            id: 'coding-assistant',
            title: 'AI Coding Assistant',
            description: 'Help with code & development',
            icon: Code,
            color: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-600'
        },
        {
            id: 'whatsapp-support',
            title: 'WhatsApp Admin',
            description: 'Direct admin contact',
            icon: Phone,
            color: 'from-green-500 to-emerald-500',
            textColor: 'text-green-600'
        }
    ];

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
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    >
                        <MessageCircle size={24} />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        
                        {/* Floating animation */}
                        <motion.div
                            animate={{
                                y: [0, -2, 0],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 opacity-30"
                        >
                            <Sparkles className="w-full h-full" />
                        </motion.div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-96 h-[600px] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageCircle size={20} />
                                <span className="font-semibold">
                                    {chatMode === 'selection' ? 'Support Center' : 
                                     chatMode === 'hostvoucher-ai' ? 'HostVoucher AI' :
                                     chatMode === 'coding-assistant' ? 'Coding Assistant' : 'WhatsApp Support'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {chatMode !== 'selection' && (
                                    <button
                                        onClick={() => {
                                            setChatMode('selection');
                                            setMessages([]);
                                        }}
                                        className="p-1 hover:bg-white/20 rounded text-xs"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/20 rounded"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 h-[520px]">
                            {chatMode === 'selection' ? (
                                <div className="p-6 space-y-4">
                                    <div className="text-center mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Choose Support Type
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            We're ready to help you in various ways
                                        </p>
                                    </div>
                                    
                                    {supportOptions.map((option) => {
                                        const IconComponent = option.icon;
                                        return (
                                            <motion.button
                                                key={option.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleModeSelect(option.id as ChatMode)}
                                                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${option.color}`}>
                                                        <IconComponent size={20} className="text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-semibold ${option.textColor} dark:text-white`}>
                                                            {option.title}
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {option.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <>
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                                        message.type === 'user'
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-2">
                                                        {message.type === 'assistant' && (
                                                            <Bot size={16} className="mt-1 flex-shrink-0" />
                                                        )}
                                                        {message.type === 'user' && (
                                                            <User size={16} className="mt-1 flex-shrink-0" />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="whitespace-pre-wrap text-sm">
                                                                {message.content}
                                                            </div>
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
                                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder={
                                                    chatMode === 'whatsapp-support'
                                                        ? 'Type message for admin...'
                                                        : chatMode === 'hostvoucher-ai'
                                                            ? 'Ask about hosting, domains, vouchers...'
                                                            : 'Ask about code, deployment, bugs...'
                                                }
                                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!inputValue.trim() || isTyping}
                                                className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

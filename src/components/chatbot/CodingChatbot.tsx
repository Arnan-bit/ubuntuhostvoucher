'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageCircle, 
    Send, 
    Code, 
    Eye, 
    Copy, 
    Download, 
    Sparkles,
    X,
    Minimize2,
    Maximize2,
    RefreshCw,
    Terminal,
    FileCode,
    Zap
} from 'lucide-react';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    code?: string;
    language?: string;
    timestamp: Date;
}

interface CodingChatbotProps {
    isOpen?: boolean;
    onToggle?: () => void;
    onClose?: () => void;
}

export const CodingChatbot: React.FC<CodingChatbotProps> = ({
    isOpen = false,
    onToggle,
    onClose
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'assistant',
            content: "Hi! I'm your AI coding assistant. I can help you create websites, write HTML/CSS/JavaScript, and provide live previews. What would you like to build today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewCode, setPreviewCode] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    const generateCodeResponse = (userMessage: string): { content: string; code?: string; language?: string } => {
        const lowerMessage = userMessage.toLowerCase();
        
        if (lowerMessage.includes('landing page') || lowerMessage.includes('homepage')) {
            return {
                content: "I'll create a modern landing page for you with a hero section, features, and call-to-action. Here's the complete HTML with embedded CSS:",
                code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0; text-align: center; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; margin-bottom: 2rem; }
        .btn { display: inline-block; background: #ff6b6b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background 0.3s; }
        .btn:hover { background: #ff5252; }
        .features { padding: 80px 0; background: #f8f9fa; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin-top: 50px; }
        .feature { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); text-align: center; }
        .feature h3 { color: #667eea; margin-bottom: 15px; }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>Welcome to Our Amazing Product</h1>
            <p>Transform your business with our innovative solutions</p>
            <a href="#" class="btn">Get Started Today</a>
        </div>
    </section>
    
    <section class="features">
        <div class="container">
            <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 20px;">Why Choose Us?</h2>
            <div class="features-grid">
                <div class="feature">
                    <h3>Fast & Reliable</h3>
                    <p>Lightning-fast performance with 99.9% uptime guarantee</p>
                </div>
                <div class="feature">
                    <h3>Easy to Use</h3>
                    <p>Intuitive interface designed for users of all skill levels</p>
                </div>
                <div class="feature">
                    <h3>24/7 Support</h3>
                    <p>Round-the-clock customer support whenever you need help</p>
                </div>
            </div>
        </div>
    </section>
</body>
</html>`,
                language: 'html'
            };
        }
        
        if (lowerMessage.includes('contact form') || lowerMessage.includes('form')) {
            return {
                content: "Here's a beautiful contact form with validation and modern styling:",
                code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact Form</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 50px 20px; }
        .form-container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; color: #333; }
        input, textarea { width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 5px; font-size: 16px; transition: border-color 0.3s; }
        input:focus, textarea:focus { outline: none; border-color: #4CAF50; }
        button { background: #4CAF50; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; width: 100%; transition: background 0.3s; }
        button:hover { background: #45a049; }
        .success { color: #4CAF50; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2 style="text-align: center; color: #333; margin-bottom: 30px;">Contact Us</h2>
        <form id="contactForm">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="subject">Subject</label>
                <input type="text" id="subject" name="subject" required>
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit">Send Message</button>
        </form>
        <div id="successMessage" class="success" style="display: none;">
            Thank you! Your message has been sent successfully.
        </div>
    </div>
    
    <script>
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('successMessage').style.display = 'block';
            this.reset();
        });
    </script>
</body>
</html>`,
                language: 'html'
            };
        }

        if (lowerMessage.includes('navbar') || lowerMessage.includes('navigation')) {
            return {
                content: "Here's a responsive navigation bar with mobile menu:",
                code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Navbar</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        nav { background: #333; padding: 1rem 0; position: sticky; top: 0; z-index: 100; }
        .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
        .logo { color: white; font-size: 1.5rem; font-weight: bold; }
        .nav-menu { display: flex; list-style: none; gap: 2rem; }
        .nav-link { color: white; text-decoration: none; transition: color 0.3s; }
        .nav-link:hover { color: #4CAF50; }
        .hamburger { display: none; flex-direction: column; cursor: pointer; }
        .bar { width: 25px; height: 3px; background: white; margin: 3px 0; transition: 0.3s; }
        @media (max-width: 768px) {
            .nav-menu { position: fixed; left: -100%; top: 70px; flex-direction: column; background: #333; width: 100%; text-align: center; transition: 0.3s; padding: 2rem 0; }
            .nav-menu.active { left: 0; }
            .hamburger { display: flex; }
        }
    </style>
</head>
<body>
    <nav>
        <div class="nav-container">
            <div class="logo">YourLogo</div>
            <ul class="nav-menu">
                <li><a href="#" class="nav-link">Home</a></li>
                <li><a href="#" class="nav-link">About</a></li>
                <li><a href="#" class="nav-link">Services</a></li>
                <li><a href="#" class="nav-link">Contact</a></li>
            </ul>
            <div class="hamburger">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
        </div>
    </nav>
    
    <div style="height: 200vh; padding: 50px; background: linear-gradient(45deg, #f0f0f0, #e0e0e0);">
        <h1>Scroll to see sticky navbar effect</h1>
        <p>This navbar will stay at the top when you scroll.</p>
    </div>
    
    <script>
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    </script>
</body>
</html>`,
                language: 'html'
            };
        }

        // Default response
        return {
            content: "I can help you create various web components! Try asking me to create:\n\n• Landing pages\n• Contact forms\n• Navigation bars\n• Cards and layouts\n• Interactive elements\n• Responsive designs\n\nWhat specific component would you like me to build for you?"
        };
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI thinking time
        setTimeout(() => {
            const response = generateCodeResponse(inputValue);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.content,
                code: response.code,
                language: response.language,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);

            if (response.code) {
                setPreviewCode(response.code);
            }
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        // You could add a toast notification here
    };

    const downloadCode = (code: string, filename: string = 'code.html') => {
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
            >
                <div className="flex items-center gap-2">
                    <Code size={24} />
                    <span className="hidden group-hover:block text-sm font-medium">
                        AI Coding Assistant
                    </span>
                </div>
            </button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 ${
                isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
            } transition-all duration-300`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Terminal size={20} />
                    <span className="font-semibold">AI Coding Assistant</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">FREE</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${
                                        message.type === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                    }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    
                                    {message.code && (
                                        <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden">
                                            <div className="flex items-center justify-between p-2 bg-gray-800 text-gray-300 text-xs">
                                                <span className="flex items-center gap-1">
                                                    <FileCode size={14} />
                                                    {message.language || 'code'}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => copyCode(message.code!)}
                                                        className="hover:text-white transition-colors"
                                                        title="Copy code"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setPreviewCode(message.code!);
                                                            setShowPreview(true);
                                                        }}
                                                        className="hover:text-white transition-colors"
                                                        title="Preview"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => downloadCode(message.code!, `${message.language || 'code'}.html`)}
                                                        className="hover:text-white transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <pre className="p-3 text-xs text-gray-300 overflow-x-auto">
                                                <code>{message.code}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <RefreshCw size={16} className="animate-spin" />
                                        <span className="text-sm">AI is coding...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me to create a landing page, form, navbar..."
                                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Preview Modal */}
            {showPreview && previewCode && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">Live Preview</h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1">
                            <iframe
                                srcDoc={previewCode}
                                className="w-full h-full border-0"
                                title="Code Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CodingChatbot;

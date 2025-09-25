'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isWhatsAppPrompt?: boolean;
  leadScore?: number;
}

interface SmartChatbotProps {
  translations?: any;
}

interface LeadData {
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  budget?: string;
  timeline?: string;
  interests: string[];
  score: number;
  qualified: boolean;
}

const SmartChatbot: React.FC<SmartChatbotProps> = ({ translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWhatsAppPrompt, setShowWhatsAppPrompt] = useState(false);
  const [leadData, setLeadData] = useState<LeadData>({
    interests: [],
    score: 0,
    qualified: false
  });
  const [conversationStage, setConversationStage] = useState<'greeting' | 'qualifying' | 'qualified' | 'closing'>('greeting');
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced knowledge base with lead qualification
  const knowledgeBase = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    hosting: {
      keywords: ['hosting', 'server', 'domain', 'website', 'cpanel', 'ssl', 'bandwidth', 'wordpress'],
      response: "🚀 Excellent choice! We offer premium hosting solutions with 99.9% uptime, free SSL certificates, and 24/7 support. Our hosting plans start from just $2.99/month with unlimited bandwidth, free domain, and one-click WordPress installation. Are you looking to host a new website or migrate an existing one?",
      leadScore: 15
    },
    vpn: {
      keywords: ['vpn', 'privacy', 'security', 'anonymous', 'protection'],
      response: "🛡️ Great! Our VPN services provide military-grade encryption, no-logs policy, and servers in 50+ countries. Get complete online privacy and security starting from $3.99/month with unlimited bandwidth and 24/7 support. What's your main reason for needing a VPN?",
      leadScore: 10
    },
    deals: {
      keywords: ['deal', 'discount', 'offer', 'coupon', 'sale', 'promo'],
      response: "💰 You're in luck! We have amazing deals updated daily! Currently featuring up to 80% off on hosting plans, VPN services, and domain registrations. What type of service are you most interested in?",
      leadScore: 12
    },
    business: {
      keywords: ['business', 'company', 'startup', 'entrepreneur', 'ecommerce', 'online store'],
      response: "🏢 Perfect! We specialize in helping businesses succeed online. Whether you're a startup or established company, we have solutions for e-commerce, corporate websites, and business applications. What type of business are you running?",
      leadScore: 20
    },
    support: {
      keywords: ['help', 'support', 'contact', 'problem', 'issue'],
      response: "🤝 Our support team is available 24/7 to help you! You can contact us through live chat, email, or our support ticket system. We typically respond within 15 minutes during business hours. What kind of help do you need?",
      leadScore: 5
    },
    pricing: {
      keywords: ['price', 'cost', 'how much', 'expensive', 'cheap', 'budget'],
      response: "💵 I understand budget is important! Our prices are very competitive - hosting starts from $2.99/month, VPN from $3.99/month, and domains from $8.99/year. We also offer bundle deals and seasonal discounts. What's your approximate monthly budget?",
      leadScore: 8
    },
    urgent: {
      keywords: ['urgent', 'asap', 'immediately', 'now', 'quick', 'fast', 'emergency'],
      response: "⚡ I can help you right away! For urgent needs, I recommend connecting with our sales specialist who can provide immediate assistance and custom solutions. Would you like me to connect you via WhatsApp?",
      leadScore: 25
    },
    features: {
      keywords: ['feature', 'include', 'what do i get', 'benefits'],
      response: "✨ Our services include: Free SSL certificates, 24/7 customer support, 99.9% uptime guarantee, free website migration, one-click app installs, unlimited email accounts, and much more! What specific features are most important to you?",
      leadScore: 8
    }
  };

  // Lead qualification questions
  const qualificationQuestions = [
    "What type of website or business are you planning to host?",
    "What's your approximate monthly budget for hosting services?",
    "When are you looking to get started?",
    "Do you currently have a website that needs migration?",
    "What's most important to you: price, performance, or support?"
  ];

  const quickSuggestions = [
    "What hosting plans do you offer?",
    "Tell me about your VPN services",
    "What are your current deals?",
    "How can I contact support?",
    "What's included in your hosting?"
  ];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: "👋 Hi! I'm your HostVoucher AI assistant. I can help you find the best hosting deals, VPN services, and answer any questions about our offerings. How can I help you today?",
        timestamp: new Date(),
        suggestions: quickSuggestions.slice(0, 3)
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Lead qualification logic
  const updateLeadScore = (score: number, interests: string[]) => {
    setLeadData(prev => ({
      ...prev,
      score: prev.score + score,
      interests: [...new Set([...prev.interests, ...interests])],
      qualified: prev.score + score >= 50
    }));
  };

  const generateResponse = (userInput: string): { response: string; showWhatsApp?: boolean } => {
    const input = userInput.toLowerCase();
    setMessageCount(prev => prev + 1);

    // Check for greetings
    if (knowledgeBase.greetings.some(greeting => input.includes(greeting))) {
      if (conversationStage === 'greeting') {
        setConversationStage('qualifying');
      }
      return {
        response: "Hello! 👋 Welcome to HostVoucher! I'm your AI assistant and I'm here to help you find the perfect hosting solutions, VPN services, domains, and exclusive deals. What brings you here today?"
      };
    }

    // Check knowledge base categories with lead scoring
    for (const [category, data] of Object.entries(knowledgeBase)) {
      if (category === 'greetings') continue;

      const categoryData = data as { keywords: string[]; response: string; leadScore?: number };
      if (categoryData.keywords.some(keyword => input.includes(keyword))) {
        // Update lead score
        if (categoryData.leadScore) {
          updateLeadScore(categoryData.leadScore, [category]);
        }

        // Check if should show WhatsApp after high-value interaction
        const shouldShowWhatsApp = leadData.score + (categoryData.leadScore || 0) >= 40 ||
                                  messageCount >= 5 ||
                                  category === 'urgent' ||
                                  input.includes('buy') ||
                                  input.includes('purchase') ||
                                  input.includes('need help') ||
                                  input.includes('sales');

        return {
          response: categoryData.response,
          showWhatsApp: shouldShowWhatsApp
        };
      }
    }

    // Handle qualification responses
    if (conversationStage === 'qualifying') {
      let response = "That's great information! ";
      let score = 5;

      // Analyze user input for qualification signals
      if (input.includes('business') || input.includes('company') || input.includes('startup')) {
        response += "I can see you're looking for business solutions. ";
        score += 15;
        updateLeadScore(score, ['business']);
      }

      if (input.includes('urgent') || input.includes('asap') || input.includes('now')) {
        response += "I understand this is urgent. ";
        score += 20;
        updateLeadScore(score, ['urgent']);
      }

      if (input.includes('budget') || input.match(/\$\d+/) || input.includes('price')) {
        response += "Budget is definitely important. ";
        score += 10;
        updateLeadScore(score, ['budget']);
      }

      response += "Let me connect you with our specialist who can provide personalized recommendations and exclusive deals. Would you like to chat with them on WhatsApp for immediate assistance?";

      return {
        response,
        showWhatsApp: true
      };
    }

    // Default response with qualification attempt
    const responses = [
      "I'd be happy to help you with that! Our main services include web hosting, VPN services, domain registration, and digital tools. What specific solution are you looking for?",
      "Great question! We specialize in helping businesses and individuals with their online needs. Are you looking to start a new website or improve an existing one?",
      "I can definitely assist you with that! We have solutions for every budget and requirement. What's your main goal with your online presence?"
    ];

    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      showWhatsApp: messageCount >= 4
    };
  };

  // WhatsApp redirect function
  const handleWhatsAppRedirect = () => {
    const phoneNumber = "08875023202";
    const message = `Hello! I was chatting with your AI assistant and I'm interested in your hosting services.

My interests: ${leadData.interests.join(', ')}
Lead Score: ${leadData.score}

Can you help me find the best solution for my needs?`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Track the conversion
    const leadInfo = {
      timestamp: new Date().toISOString(),
      interests: leadData.interests,
      score: leadData.score,
      qualified: leadData.qualified,
      messageCount: messageCount,
      conversationStage: conversationStage
    };

    // Save lead data to localStorage for admin tracking
    const existingLeads = JSON.parse(localStorage.getItem('chatbot_leads') || '[]');
    existingLeads.push(leadInfo);
    localStorage.setItem('chatbot_leads', JSON.stringify(existingLeads));

    setShowWhatsAppPrompt(false);
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
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const responseData = generateResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseData.response,
        timestamp: new Date(),
        suggestions: Math.random() > 0.5 ? quickSuggestions.slice(0, 2) : undefined,
        isWhatsAppPrompt: responseData.showWhatsApp
      };

      setMessages(prev => [...prev, botMessage]);

      // Show WhatsApp prompt if qualified lead
      if (responseData.showWhatsApp) {
        setTimeout(() => {
          setShowWhatsAppPrompt(true);
        }, 1500);
      }

      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        
        {/* Notification dot */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 z-40 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">HostVoucher AI</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot size={16} className="mt-1 text-blue-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-2 space-y-1">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="block w-full text-left text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Bot size={16} className="text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              
              {/* Quick actions */}
              <div className="flex flex-wrap gap-1 mt-2">
                <button
                  onClick={() => handleSuggestionClick("Show me your best deals")}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🔥 Best Deals
                </button>
                <button
                  onClick={() => handleSuggestionClick("I need hosting help")}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🏠 Hosting
                </button>
                <button
                  onClick={() => handleSuggestionClick("Tell me about VPN")}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  🔒 VPN
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Prompt Modal */}
      <AnimatePresence>
        {showWhatsAppPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  🎯 Ready for Personalized Help?
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Based on our conversation, I think you'd benefit from speaking directly with our sales specialist. They can provide:
                </p>

                <div className="text-left bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Personalized recommendations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Exclusive deals & discounts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Immediate setup assistance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Custom solutions for your needs</span>
                    </div>
                  </div>
                </div>

                {leadData.qualified && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <span className="text-lg">🏆</span>
                      <span className="text-sm font-medium">
                        You qualify for our VIP treatment! Get priority support and exclusive pricing.
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    Chat on WhatsApp
                  </button>
                  <button
                    onClick={() => setShowWhatsAppPrompt(false)}
                    className="px-4 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Maybe Later
                  </button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  💬 Response time: Usually within 2 minutes
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartChatbot;

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon,
  PaperAirplaneIcon,
  WifiIcon,
  SparklesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { sendChatMessage } from '../services/api';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "👋 Hey there! I'm Aqeel's AI assistant. Ask me anything about my skills, projects, experience, or education — I'm here to help!", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickReplies = [
    { text: "💻 What skills does he have?", message: "What skills does Muhammad Aqeel have?" },
    { text: "🚀 What projects has he built?", message: "What projects has he worked on?" },
    { text: "🎓 What is his education?", message: "What is his educational background?" },
    { text: "💼 Any work experience?", message: "Does he have any work experience?" },
    { text: "📧 How to contact him?", message: "How can I contact Muhammad Aqeel?" },
    { text: "📄 Download CV", message: "How can I download his CV?" },
  ];

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet connected! You can now chat with the assistant.', {
        duration: 3000,
        icon: '🌐'
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection. Please check your connection and try again.', {
        duration: 4000,
        icon: '⚠️'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      toast.error('No internet connection. Please connect to the internet to use the chatbot.', {
        duration: 5000,
        icon: '⚠️'
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText = null) => {
    const userMessage = messageText || inputMessage.trim();
    if (!userMessage) return;

    if (!isOnline) {
      toast.error('No internet connection. Please connect to the internet to send messages.', {
        duration: 4000,
        icon: '⚠️'
      });
      return;
    }

    if (!messageText) {
      setInputMessage('');
    }
    
    const userMsg = {
      id: messages.length + 1,
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(userMessage);
      
      const botMsg = {
        id: messages.length + 2,
        text: response.reply,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);

      if (!response.success) {
        toast.error('Could not get response. Please try again.');
      }
    } catch (error) {
      const errorMsg = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please check your internet and try again. 🌐",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
      toast.error('Connection error. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button - ONLY SHOWS WHEN CHAT IS CLOSED */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, duration: 0.5 }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-75"></div>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow">
              <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className={`absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ${
              isOnline ? 'bg-green-500' : 'bg-red-500'
            } border-2 border-white shadow-sm`} />
          </div>
        </motion.button>
      )}

      {/* Chat Window - Responsive */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[500px] sm:h-[600px] max-h-[calc(100vh-100px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col"
            style={{ top: '70px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-3 sm:p-4 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-lg">Aqeel's AI Assistant</h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs opacity-90">
                      <WifiIcon className={`h-2 w-2 sm:h-3 sm:w-3 ${!isOnline ? 'text-red-300' : ''}`} />
                      <span className="truncate">
                        {isOnline 
                          ? 'Online • Ready to chat' 
                          : 'Offline • Check connection'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>

            {/* Internet Warning Banner */}
            {!isOnline && (
              <div className="bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 flex items-center gap-2 border-b border-red-200 dark:border-red-800">
                <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                <p className="text-[10px] sm:text-xs text-red-700 dark:text-red-300 flex-1">
                  No internet connection. Please reconnect to continue chatting.
                </p>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-2 sm:p-3 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-md'
                    }`}
                  >
                    <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1 ${
                      msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      <span className="text-[8px] sm:text-[10px]">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 sm:p-3 rounded-bl-sm shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Suggestions */}
            {isOnline && messages.length < 3 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">💡 Suggested questions:</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {quickReplies.slice(0, 4).map((reply, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      onClick={() => handleSendMessage(reply.message)}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors"
                    >
                      {reply.text}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Offline Message */}
            {!isOnline && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800/50">
                <p className="text-[10px] sm:text-xs text-red-500 dark:text-red-400 text-center">
                  ⚠️ Chat is unavailable offline. Please connect to the internet.
                </p>
              </div>
            )}

            {/* Input Area — fixed alignment */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-white dark:bg-gray-900">
              {/* items-end so button anchors to textarea bottom when text wraps */}
              <div className="flex gap-2 items-end">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isOnline ? "Ask me anything..." : "No internet connection..."}
                  className="flex-1 px-3 py-2.5 sm:px-4 sm:py-2.5 text-xs sm:text-sm border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-none transition-all leading-relaxed"
                  rows={1}
                  disabled={!isOnline}
                  style={{ maxHeight: '80px' }}
                />
                {/* Button uses same vertical padding as textarea so heights match */}
                <motion.button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping || !isOnline}
                  className="flex-shrink-0 px-3 py-2.5 sm:px-3.5 sm:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <PaperAirplaneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
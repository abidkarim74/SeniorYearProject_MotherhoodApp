import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Mic, Smile, MoreVertical, Bot, User, Menu } from "lucide-react";

interface ChatAreaProps {
  selectedChat?: number | null;
  isMobile?: boolean;
  onOpenSidebar?: () => void;  // Make sure this is included
}

const ChatArea = ({ selectedChat, isMobile, onOpenSidebar }: ChatAreaProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! 👋 I\'m your Nurtura AI assistant. How can I help you today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: <Bot className="w-5 h-5 text-white" />
    },
    {
      id: 2,
      type: 'user',
      content: 'I need help with my baby\'s feeding schedule',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: <User className="w-5 h-5 text-white" />
    },
    {
      id: 3,
      type: 'bot',
      content: 'Of course! I\'d be happy to help with feeding schedules. How old is your baby?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: <Bot className="w-5 h-5 text-white" />
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load messages based on selected chat
  useEffect(() => {
    if (selectedChat) {
      // In a real app, you would fetch messages for the selected chat
      console.log('Loading messages for chat:', selectedChat);
      // For demo, we'll just keep the same messages
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user' as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: <User className="w-5 h-5 text-white" />
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot' as const,
        content: getBotResponse(message),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: <Bot className="w-5 h-5 text-white" />
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple bot response generator (replace with actual AI logic)
  const getBotResponse = (userMessage: string) => {
    const responses = [
      "That's a great question! Based on your baby's age, I'd recommend feeding every 2-3 hours. 👶",
      "I understand your concern. Here's what you can do to help with sleep training... 🌙",
      "Many parents ask about this. The general recommendation is to consult with your pediatrician first. 👩‍⚕️",
      "Let me help you with that! According to pediatric guidelines, most babies start solids around 6 months. 🥣",
      "I'd be happy to provide some tips for that situation! Would you like me to share some gentle techniques? ✨"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          {isMobile && onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-1"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-gray-800 text-sm md:text-base truncate">
              {selectedChat ? 'Chat continued' : 'AI Assistant'}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500 truncate">Online • Ready to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button className="p-1.5 md:p-2 text-gray-500 hover:text-[#e5989b] hover:bg-[#fceaea] rounded-lg transition-all duration-200">
            <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Rest of your ChatArea component remains the same... */}
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] md:max-w-[70%] ${
              msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {/* Avatar */}
              <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                  : 'bg-gradient-to-r from-[#e5989b] to-[#d88a8d]'
              }`}>
                <div className="w-3 h-3 md:w-4 md:h-4">
                  {msg.avatar}
                </div>
              </div>
              
              {/* Message Content */}
              <div>
                <div className={`rounded-2xl px-3 py-2 md:px-4 md:py-2 ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <p className="text-xs md:text-sm">{msg.content}</p>
                </div>
                <div className={`flex items-center space-x-2 mt-1 text-xs text-gray-400 ${
                  msg.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span>{msg.timestamp}</span>
                  {msg.type === 'user' && (
                    <>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-[#e5989b] text-xs">✓✓</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 md:px-4 md:py-3">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            {/* Attachment button */}
            <button className="absolute left-2 md:left-3 bottom-2.5 md:bottom-3 text-gray-400 hover:text-[#e5989b] transition-colors group">
              <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Attach file
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rotate-45"></div>
              </div>
            </button>
            
            {/* Text input */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className="w-full pl-8 md:pl-12 pr-16 md:pr-20 py-2 md:py-3 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b] focus:bg-white resize-none transition-all text-xs md:text-sm"
              style={{ maxHeight: '100px' }}
            />
            
            {/* Right side buttons */}
            <div className="absolute right-2 md:right-3 bottom-2.5 md:bottom-3 flex items-center space-x-1 md:space-x-2">
              <button className="text-gray-400 hover:text-[#e5989b] transition-colors group relative">
                <Smile className="w-4 h-4 md:w-5 md:h-5" />
                <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Add emoji
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rotate-45"></div>
                </div>
              </button>
              <button className="text-gray-400 hover:text-[#e5989b] transition-colors group relative">
                <Mic className="w-4 h-4 md:w-5 md:h-5" />
                <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Voice input
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rotate-45"></div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-2 md:p-3 rounded-xl transition-all duration-200 group relative flex-shrink-0 ${
              message.trim()
                ? 'bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white hover:shadow-lg hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
            {message.trim() && (
              <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Send message
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rotate-45"></div>
              </div>
            )}
          </button>
        </div>
        
        {/* Suggestions - Hide on very small screens if needed */}
        <div className="hidden sm:flex items-center space-x-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-xs text-gray-400 whitespace-nowrap">Quick suggestions:</span>
          {[
            { text: 'Feeding', icon: '🍼' },
            { text: 'Sleep', icon: '😴' },
            { text: 'Vaccines', icon: '💉' },
            { text: 'Milestones', icon: '🎯' },
            { text: 'Teething', icon: '🦷' }
          ].map((suggestion) => (
            <button
              key={suggestion.text}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="flex items-center space-x-1 text-xs bg-gray-100 hover:bg-[#fceaea] text-gray-600 hover:text-[#e5989b] px-2 py-1 md:px-3 md:py-1.5 rounded-full whitespace-nowrap transition-all duration-200 hover:scale-105"
            >
              <span>{suggestion.icon}</span>
              <span className="hidden md:inline">{suggestion.text}</span>
            </button>
          ))}
        </div>

        {/* Mobile quick actions */}
        <div className="flex sm:hidden items-center justify-center mt-2 space-x-4">
          {[
            { icon: '🍼', action: 'feeding' },
            { icon: '😴', action: 'sleep' },
            { icon: '💉', action: 'vaccines' },
            { icon: '🦷', action: 'teething' }
          ].map((item) => (
            <button
              key={item.action}
              onClick={() => handleSuggestionClick(item.action)}
              className="text-lg bg-gray-100 hover:bg-[#fceaea] w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              {item.icon}
            </button>
          ))}
        </div>

        {/* Privacy note */}
        <div className="mt-2 text-center px-2">
          <p className="text-xs text-gray-400">
            AI responses are for informational purposes only. Consult healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
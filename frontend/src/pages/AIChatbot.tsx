import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User,  
  ArrowLeft,
  Sparkles,
  Trash2,
  AlertCircle,
  Search,
  Zap,
  Award,
  Users,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";
import { postRequest } from "../api/requests";
import { useAuth } from "../context/authContext";


interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const AIChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const create_chatbot = async () => {

      
    }

  }, []);

  useEffect(() => {
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  // Sample welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          content: "Hello! I'm your parenting assistant. I can help with questions about newborn care, breastfeeding, sleep training, nutrition, child development, health & safety, and more. I'm here to provide supportive, evidence-based information to help you on your parenting journey.",
          role: "assistant",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      const response = await postRequest("/ai-chatbot/chat", {
        message: inputMessage,
        conversation_id: conversationId
      });

      // Handle different possible response formats
      let assistantResponse = "";
      
      if (typeof response === 'string') {
        assistantResponse = response;
      } else if (response.reply) {
        assistantResponse = response.reply;
      } else if (response.message) {
        assistantResponse = response.message;
      } else if (response.response) {
        assistantResponse = response.response;
      } else if (response.answer) {
        assistantResponse = response.answer;
      } else if (response.content) {
        assistantResponse = response.content;
      } else {
        assistantResponse = JSON.stringify(response) || "I'm here to help! Please feel free to ask me any parenting-related questions.";
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: assistantResponse,
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to the AI service right now. Please check your internet connection and try again in a moment.",
        role: "assistant",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setError("Connection failed. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const newConversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setConversationId(newConversationId);
    
    setMessages([
      {
        id: "1",
        content: "Hello! I'm your parenting assistant. I can help with questions about newborn care, breastfeeding, sleep training, nutrition, child development, health & safety, and more. I'm here to provide supportive, evidence-based information to help you on your parenting journey.",
        role: "assistant",
        timestamp: new Date()
      }
    ]);
    setError("");
  };

  // Suggested questions organized by category
  const suggestedQuestions = {
    "Newborn Care": [
      "How to soothe a crying baby?",
      "Safe sleep practices?",
      "Tips for managing colic?"
    ],
    "Feeding": [
      "Breastfeeding positions",
      "When to introduce solids?",
      "Dealing with picky eaters"
    ],
    "Sleep": [
      "Sleep training methods",
      "Bedtime routines",
      "Sleep regression"
    ],
    "Development": [
      "Milestones for 3-month-old",
      "Encouraging crawling",
      "When do babies start talking?"
    ]
  };

  // Chat bubble component
  const ChatBubble = ({ message }: { message: Message }) => (
    <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center ${
        message.role === "user" 
          ? "bg-gradient-to-r from-[#e5989b] to-[#d88a8d]" 
          : "bg-gradient-to-r from-blue-500 to-blue-600"
      }`}>
        {message.role === "user" ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      
      <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[70%]`}>
        <div className={`rounded-2xl px-4 py-3 ${
          message.role === "user"
            ? "bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-br-none shadow-lg"
            : "bg-white text-gray-900 rounded-bl-none border border-gray-200 shadow-lg"
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-6">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link 
              to="/community" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 rounded-2xl hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Community</span>
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-2xl shadow-lg border border-gray-100">
                <Bot className="w-5 h-5 text-[#e5989b]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Parenting <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">Assistant</span>
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  AI Support • Always available
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] w-64 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
              />
            </div>
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Main Content - 80% height */}
        <div className="grid grid-cols-4 gap-6" style={{ height: '80vh' }}>
          {/* Left Sidebar - Suggested Questions */}
          <div className="col-span-1 flex flex-col space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-[#e5989b]" />
                Chat Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-600">Messages</span>
                  <span className="font-bold text-gray-900 text-sm">{messages.length}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-600">Status</span>
                  <span className="flex items-center gap-1 text-green-600 font-medium text-xs">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex-1 overflow-hidden">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Sparkles className="w-4 h-4 text-[#e5989b]" />
                Quick Questions
              </h3>
              <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '200px' }}>
                {Object.entries(suggestedQuestions).map(([category, questions]) => (
                  <div key={category} className="space-y-1">
                    <h4 className="font-semibold text-gray-900 text-xs">{category}</h4>
                    <div className="space-y-1">
                      {questions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setInputMessage(question);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="w-full text-left text-xs text-gray-600 p-2 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 leading-relaxed"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-4">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                <Award className="w-4 h-4" />
                Tips
              </h3>
              <ul className="space-y-1 text-xs text-blue-800">
                <li className="flex items-start space-x-2">
                  <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Ask specific questions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>Consult doctors for medical concerns</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="col-span-3 flex flex-col bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Messages Container - Scrollable */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100"
            >
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <ChatBubble key={message.id} message={message} />
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white text-gray-900 rounded-2xl rounded-bl-none border border-gray-200 shadow-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Sticky Bottom */}
            <div className="border-t border-gray-200 bg-white p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about parenting, child care, development, health, or share your concerns..."
                      className="w-full border border-gray-300 rounded-2xl px-4 py-3 pr-12 focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] resize-none transition-all duration-200 bg-white text-sm"
                      rows={1}
                      style={{ minHeight: '50px', maxHeight: '100px' }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="absolute right-2 bottom-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white p-2 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center w-10 h-10"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Press Enter to send • Shift + Enter for new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;

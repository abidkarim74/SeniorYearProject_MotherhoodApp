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
  Clock,
  Plus,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { postRequest, getRequest, deleteRequest } from "../api/requests";
import { useAuth } from "../context/authContext";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  message_type: "human" | "ai" | "system";
}

interface Conversation {
  id: string;
  topic: string;
  created_at: string;
  last_messages?: string[];
  summary?: string;
  messages?: Message[];
}

interface ChatBot {
  id: string;
  name: string;
  description: string;
  user_id: string;
}

// Mock data for conversations since we don't have conversation endpoints
const mockConversations: Conversation[] = [
  {
    id: "1",
    topic: "Sleep Training Advice",
    created_at: new Date().toISOString(),
    summary: "Questions about baby sleep patterns",
    messages: [
      {
        id: "1",
        content: "Hello! I'm your parenting assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
        message_type: "ai"
      }
    ]
  },
  {
    id: "2", 
    topic: "Nutrition for Toddlers",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    summary: "Healthy eating habits for 2-year-old",
    messages: [
      {
        id: "1",
        content: "Hello! I'm your parenting assistant. How can I help you today?",
        role: "assistant", 
        timestamp: new Date(),
        message_type: "ai"
      }
    ]
  }
];

const AIChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [chatBot, setChatBot] = useState<ChatBot | null>(null);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  // Initialize chatbot for user
  useEffect(() => {
    const initializeChatBot = async () => {
      if (!user?.id) return;

      try {
        setIsInitializing(true);
        setError("");
        
        // Since we don't have a get-bot endpoint, we'll create one if needed
        let userBot = chatBot;
        
        if (!userBot) {
          try {
            userBot = await postRequest("/ai-chatbot/create-bot", {
              name: "Parenting Assistant",
              description: "AI assistant for parenting advice and child care guidance",
            });
            setChatBot(userBot);
          } catch (error) {
            console.error("Error creating chatbot:", error);
            // If creation fails, use a mock bot for demo
            userBot = {
              id: "demo-bot-id",
              name: "Parenting Assistant",
              description: "AI assistant for parenting advice",
              user_id: user.id
            };
            setChatBot(userBot);
          }
        }

        // For demo purposes, we'll use mock conversations
        // In a real app, you'd fetch these from your API
        setConversations(mockConversations);
        
      } catch (error) {
        console.error("Error initializing chatbot:", error);
        setError("Failed to initialize chatbot");
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChatBot();
  }, [user?.id]);

  // Create new conversation (mock implementation)
  const createNewConversation = async () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      topic: "New Parenting Conversation",
      created_at: new Date().toISOString(),
      summary: "New conversation about parenting",
      messages: [
        {
          id: "welcome",
          content: "Hello! I'm your parenting assistant. I can help with questions about newborn care, breastfeeding, sleep training, nutrition, child development, health & safety, and more. I'm here to provide supportive, evidence-based information to help you on your parenting journey.",
          role: "assistant",
          timestamp: new Date(),
          message_type: "ai",
        },
      ]
    };

    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
    setMessages(newConversation.messages || []);
  };

  // Load conversation messages
  const loadConversation = async (conversation: Conversation) => {
    setCurrentConversation(conversation);
    setMessages(conversation.messages || []);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentConversation || !chatBot) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
      message_type: "human",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setError("");

    try {
      // Use the chat endpoint to get AI response
      const response = await postRequest("/ai-chatbot/chat", {
        message: inputMessage,
        conversation_id: currentConversation.id,
      });

      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.response,
        role: "assistant",
        timestamp: new Date(),
        message_type: "ai",
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Update conversation in the list with new summary
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversation.id
            ? {
                ...conv,
                summary: inputMessage.length > 30 ? inputMessage.substring(0, 30) + "..." : inputMessage,
                messages: [...(conv.messages || []), userMessage, assistantMessage]
              }
            : conv
        )
      );

    } catch (error: any) {
      console.error("Error sending message:", error);
      
      let errorMessage = "I'm having trouble connecting right now. Please try again.";
      if (error?.status === 500) {
        errorMessage = "The AI service is temporarily unavailable. Please try again later.";
      }

      const errorResponse: Message = {
        id: `error-${Date.now()}`,
        content: errorMessage,
        role: "assistant",
        timestamp: new Date(),
        message_type: "ai",
      };

      setMessages((prev) => [...prev, errorResponse]);
      setError("Failed to send message. Please try again.");
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

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Since we don't have a delete endpoint, we'll handle it locally
      setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      setError("Failed to delete conversation");
    }
  };

  // Chat bubble component
  const ChatBubble = ({ message }: { message: Message }) => (
    <div
      className={`flex gap-3 ${
        message.role === "user" ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center ${
          message.role === "user"
            ? "bg-gradient-to-r from-[#e5989b] to-[#d88a8d]"
            : "bg-gradient-to-r from-blue-500 to-blue-600"
        }`}
      >
        {message.role === "user" ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      <div
        className={`flex flex-col ${
          message.role === "user" ? "items-end" : "items-start"
        } max-w-[70%]`}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            message.role === "user"
              ? "bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-br-none shadow-lg"
              : "bg-white text-gray-900 rounded-bl-none border border-gray-200 shadow-lg"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-500 mt-1 px-1">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );

  // Conversation item component
  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <div
      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${
        currentConversation?.id === conversation.id
          ? "bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white shadow-lg"
          : "bg-white hover:bg-gray-50 border border-gray-200"
      }`}
      onClick={() => loadConversation(conversation)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle
              className={`w-4 h-4 ${
                currentConversation?.id === conversation.id
                  ? "text-white"
                  : "text-[#e5989b]"
              }`}
            />
            <h3
              className={`font-semibold text-sm truncate ${
                currentConversation?.id === conversation.id
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {conversation.topic}
            </h3>
          </div>
          <p
            className={`text-xs truncate ${
              currentConversation?.id === conversation.id
                ? "text-white/80"
                : "text-gray-600"
            }`}
          >
            {conversation.summary || "New conversation"}
          </p>
          <p
            className={`text-xs mt-1 ${
              currentConversation?.id === conversation.id
                ? "text-white/60"
                : "text-gray-400"
            }`}
          >
            {new Date(conversation.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={(e) => deleteConversation(conversation.id, e)}
          className={`opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all duration-200 ${
            currentConversation?.id === conversation.id
              ? "hover:bg-white/20 text-white"
              : "hover:bg-gray-200 text-gray-500"
          }`}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e5989b] mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing AI Chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff6f6] to-[#fceaea] py-6">
      <div className="max-w-7xl mx-auto px-6">
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
                  Parenting{" "}
                  <span className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] bg-clip-text text-transparent">
                    Assistant
                  </span>
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
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#e5989b] focus:border-[#e5989b] w-64 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm"
              />
            </div>
            <button
              onClick={createNewConversation}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-4 py-2 rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>
        </div>

        {/* Main Content - 80% height */}
        <div className="grid grid-cols-4 gap-6" style={{ height: "80vh" }}>
          {/* Left Sidebar - Conversations */}
          <div className="col-span-1 flex flex-col space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-[#e5989b]" />
                Chat Info
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-600">Conversations</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {conversations.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-600">Messages</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {messages.length}
                  </span>
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

            {/* Conversations List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex-1 overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm">
                  <MessageCircle className="w-4 h-4 text-[#e5989b]" />
                  Conversations
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {filteredConversations.length}
                </span>
              </div>

              <div
                className="space-y-2 overflow-y-auto"
                style={{ maxHeight: "400px" }}
              >
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                    <button
                      onClick={createNewConversation}
                      className="text-[#e5989b] text-xs hover:underline mt-1"
                    >
                      Start a new chat
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                    />
                  ))
                )}
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
              className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100"
            >
              {currentConversation ? (
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
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            Thinking...
                          </span>
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
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">
                      No conversation selected
                    </p>
                    <p className="text-sm mb-4">
                      Choose a conversation from the sidebar or start a new one
                    </p>
                    <button
                      onClick={createNewConversation}
                      className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-2 rounded-2xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                      Start New Chat
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Sticky Bottom */}
            {currentConversation && (
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
                        style={{ minHeight: "50px", maxHeight: "100px" }}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatBot;
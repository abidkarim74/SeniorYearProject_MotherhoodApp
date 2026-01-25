import { useState, useEffect, useRef } from 'react';
import { putRequest, postRequest, getRequest } from '../../../api/requests';
import type { AiConversation, AIMessage } from '../../../interfaces/AIBotInterfaces';
import { useAuth } from '../../../context/authContext';

interface ChatAreaProps {
  currentConversation: AiConversation | null;
  isLoading: boolean;
  isChatPage: boolean;
  onBackToAllChats: () => void;
  onToggleSidebar?: () => void;
  onCopyLink: () => void;
  onNewChat: () => void;
  showMobileSidebarToggle?: boolean;
  conversations: AiConversation[];
  setConversations: React.Dispatch<React.SetStateAction<AiConversation[]>>;
  onConversationUpdate?: (conversation: AiConversation) => void;
}

// Interface matching your Pydantic schemas
interface AIMessageResponse {
  id: string;
  conversation_id: string;
  user_id: string;
  message_type: 'human' | 'ai';
  content: string;
  created_at: string;
}

// Updated to match AIChatMessage schema
interface AIChatMessageRequest {
  message: string;
  user_fullname: string;
  conversation_id: string;
}

const ChatArea = ({
  currentConversation,
  isLoading,
  onToggleSidebar,
  onNewChat,
  showMobileSidebarToggle = false,
  conversations,
  setConversations,
  onConversationUpdate
}: ChatAreaProps) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation?.id) {
      fetchConversationMessages(currentConversation.id);
    } else {
      setMessages([]);
    }
  }, [currentConversation?.id]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  const fetchConversationMessages = async (conversationId: string) => {
    setIsFetchingMessages(true);
    try {
      const response: AIMessageResponse[] = await getRequest(
        `/ai-chatbot/messages/${conversationId}`
      );
      
      // Transform the API response to match AIMessage interface
      const transformedMessages: AIMessage[] = response.map((msg) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        user_id: msg.user_id,
        sender: msg.message_type === 'ai' ? 'ai' : 'user', // Convert 'human' to 'user'
        text: msg.content,
        created_at: msg.created_at,
        timestamp: formatTimestamp(msg.created_at)
      }));
      
      // Sort messages by creation time
      transformedMessages.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsFetchingMessages(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendChatMessage = async (messageData: AIChatMessageRequest): Promise<AIMessageResponse> => {
    const response = await postRequest('/ai-chatbot/chat', messageData);
    return response;
  };

  const handleSendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText || !currentConversation || isSending || !user?.id) return;

    setIsSending(true);

    try {
      // First, update conversation topic with user's message
      const update_data = {
        message: messageText,
        conversation_id: currentConversation.id
      };

      const updatedTopic = await putRequest(
        "/ai-chatbot/update-conversation",
        update_data
      );

      // Create user message (this will be saved by the API)
      const chatRequestData: AIChatMessageRequest = {
        message: messageText,
        user_fullname: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User',
        conversation_id: currentConversation.id
      };

      // Send message to AI and get response
      const response = await sendChatMessage(chatRequestData);

      // Refresh messages to get the complete conversation
      await fetchConversationMessages(currentConversation.id);

      // Clear input
      setInputText("");

      // Update conversations list with new topic
      const updatedConversation: AiConversation = {
        ...currentConversation,
        topic: updatedTopic || currentConversation.topic,
        updated_at: new Date().toISOString()
      };

      // Update the conversations list
      setConversations(prev => {
        const existingIndex = prev.findIndex(
          conv => conv.id === currentConversation.id
        );

        if (existingIndex >= 0) {
          const newList = [...prev];
          newList[existingIndex] = updatedConversation;
          return newList.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
        }

        return [updatedConversation, ...prev];
      });

      // Notify parent component
      onConversationUpdate?.(updatedConversation);

    } catch (err: any) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Summarize conversation when it's loaded
  useEffect(() => {
    if (!currentConversation?.id) return;

    const summarizeConversation = async () => {
      try {
        await putRequest(
          `/ai-chatbot/summarize-conversation/${currentConversation.id}`,
          {}
        );
      } catch (error) {
        console.error("Failed to summarize conversation:", error);
      }
    };

    summarizeConversation();
  }, [currentConversation?.id]);

  // Optimistic update - show user message immediately while waiting for AI response
  const optimisticSendMessage = async () => {
    const messageText = inputText.trim();
    if (!messageText || !currentConversation || isSending || !user?.id) return;

    setIsSending(true);

    // Create optimistic user message
    const optimisticUserMessage: AIMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: currentConversation.id,
      user_id: user.id,
      sender: 'user',
      text: messageText,
      created_at: new Date().toISOString(),
      timestamp: formatTimestamp(new Date().toISOString())
    };

    // Add optimistic message immediately
    setMessages(prev => [...prev, optimisticUserMessage]);
    setInputText("");

    try {
      // Update conversation topic with user's message
      const update_data = {
        message: messageText,
        conversation_id: currentConversation.id
      };

      const updatedTopic = await putRequest(
        "/ai-chatbot/update-conversation",
        update_data
      );

      // Create user message (this will be saved by the API)
      const chatRequestData: AIChatMessageRequest = {
        message: messageText,
        user_fullname: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User',
        conversation_id: currentConversation.id
      };

      // Send message to AI and get response
      await sendChatMessage(chatRequestData);

      // Refresh messages to get the complete conversation (including AI response)
      await fetchConversationMessages(currentConversation.id);

      // Update conversations list with new topic
      const updatedConversation: AiConversation = {
        ...currentConversation,
        topic: updatedTopic || currentConversation.topic,
        updated_at: new Date().toISOString()
      };

      // Update the conversations list
      setConversations(prev => {
        const existingIndex = prev.findIndex(
          conv => conv.id === currentConversation.id
        );

        if (existingIndex >= 0) {
          const newList = [...prev];
          newList[existingIndex] = updatedConversation;
          return newList.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
          );
        }

        return [updatedConversation, ...prev];
      });

      // Notify parent component
      onConversationUpdate?.(updatedConversation);

    } catch (err: any) {
      console.error("Error sending message:", err);
      // Remove optimistic message if error occurs
      setMessages(prev => prev.filter(msg => msg.id !== optimisticUserMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  // Replace handleSendMessage with optimistic version
  const handleSendMessageOptimistic = optimisticSendMessage;

  if (isLoading || isFetchingMessages) {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e5989b] mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">
              {isFetchingMessages ? 'Loading messages...' : 'Loading conversation...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentConversation) {
    return (
      <div className="flex flex-1 flex-col h-full">
        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-white to-gray-50/30 custom-scrollbar"
        >
          <div className="max-w-2xl mx-auto w-full pt-4 pb-20 px-4">
            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`group w-full ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div className={`inline-block max-w-[85%] ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                      <div className="flex gap-2.5">
                        {/* Avatar - Only show for AI messages */}
                        {message.sender === 'ai' && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-[#e5989b] to-[#d88a8d] flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                        )}

                        {/* Message Content */}
                        <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'order-first' : 'order-last'}`}>
                          {/* Sender and timestamp */}
                          <div className={`flex items-center gap-1.5 mb-0.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs font-medium ${message.sender === 'user' ? 'text-blue-600' : 'text-[#d88a8d]'}`}>
                              {message.sender === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            {message.timestamp && (
                              <span className="text-[10px] text-gray-400">
                                {message.timestamp}
                              </span>
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div className={`relative ${message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-sm'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm'
                            } px-3.5 py-2.5`}>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {message.text}
                            </div>

                            {message.sender === 'user' && (
                              <div className="absolute -right-1.5 bottom-0 w-3 h-3 bg-blue-500 rounded-br-lg transform rotate-45"></div>
                            )}
                          </div>

                          {/* Actions - Hover only on desktop */}
                          <div className={`flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <button 
                              onClick={() => navigator.clipboard.writeText(message.text)}
                              className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy message"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                            </button>
                            <button className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Avatar for user messages */}
                        {message.sender === 'user' && (
                          <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mt-0.5">
                            <span className="text-[10px] font-medium text-white">U</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
                <div className="text-center py-8">
                  <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-br from-[#e5989b]/10 to-[#d88a8d]/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#e5989b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1.5">Start a conversation</h3>
                  <p className="text-gray-500 text-xs max-w-xs mx-auto">
                    This is a brand new conversation. Type your first message below.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 bg-gradient-to-t from-white via-white to-transparent pt-4 pb-3 px-4 border-t border-gray-100">
          <div className="max-w-2xl mx-auto w-full">
            <div className="relative">
              <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-[#e5989b] focus-within:ring-1 focus-within:ring-[#e5989b]/20 focus-within:shadow-md">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#e5989b]/0 via-[#e5989b]/0 to-[#e5989b]/0 rounded-2xl group-focus-within:from-[#e5989b]/10 group-focus-within:via-[#d88a8d]/10 group-focus-within:to-[#e5989b]/10 transition-all duration-300 pointer-events-none"></div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Message AI Assistant..."
                  className="relative flex-1 p-2.5 pr-10 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-none min-h-[44px] max-h-[120px] placeholder-gray-400 z-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessageOptimistic();
                    }
                  }}
                  rows={1}
                  disabled={isSending}
                  style={{
                    overflow: 'hidden',
                    overflowWrap: 'break-word'
                  }}
                />

                <button
                  onClick={handleSendMessageOptimistic}
                  disabled={!inputText.trim() || isSending}
                  className="absolute right-1.5 z-20 p-1.5 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-xl hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isSending ? (
                    <div className="w-3.5 h-3.5 flex items-center justify-center">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Enter</kbd> to send • <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Shift</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[9px]">Enter</kbd> for new line
              </p>

              <div className="flex items-center justify-center flex-wrap gap-1.5 mt-2">
                <button
                  onClick={() => setInputText("Can you suggest a bedtime routine for my 2-year-old?")}
                  disabled={isSending}
                  className="px-2 py-1 text-[10px] bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200/50 shadow-sm disabled:opacity-50"
                >
                  Bedtime routine
                </button>
                <button
                  onClick={() => setInputText("What are some healthy meal ideas for toddlers?")}
                  disabled={isSending}
                  className="px-2 py-1 text-[10px] bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200/50 shadow-sm disabled:opacity-50"
                >
                  Toddler meals
                </button>
                <button
                  onClick={() => setInputText("What developmental milestones should I expect at 18 months?")}
                  disabled={isSending}
                  className="px-2 py-1 text-[10px] bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200/50 shadow-sm disabled:opacity-50"
                >
                  Milestones
                </button>
                <button
                  onClick={() => setInputText("How can I help my child with a fever?")}
                  disabled={isSending}
                  className="px-2 py-1 text-[10px] bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200/50 shadow-sm disabled:opacity-50"
                >
                  Health tips
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default state when no chat is selected
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50/30">
        <div className="w-14 h-14 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-full flex items-center justify-center mb-3 shadow-md">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-1.5 text-center">
          AI Assistant
        </h1>
        <p className="text-gray-600 text-center text-xs sm:text-sm max-w-xs mb-4">
          Your intelligent assistant for parenting questions and expert advice.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mb-4 w-full px-4">
          {[
            { title: "Parenting Tips", desc: "Age-appropriate advice" },
            { title: "Development", desc: "Track milestones" },
            { title: "Health & Safety", desc: "Medical guidance" }
          ].map((item, index) => (
            <div key={index} className="p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm">
              <h3 className="font-medium text-gray-900 mb-0.5 text-xs">{item.title}</h3>
              <p className="text-[10px] text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onNewChat}
            className="px-4 py-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-lg font-medium hover:shadow-md transition-all text-xs sm:text-sm shadow-sm"
          >
            Start New Chat
          </button>
          {showMobileSidebarToggle && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-xs sm:text-sm"
            >
              Browse Conversations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
import { useState, useEffect, useRef } from 'react';
import { putRequest, postRequest, getRequest } from '../../../api/requests';
import type { AiConversation, AIMessage } from '../../../interfaces/AIBotInterfaces';
import { useAuth } from '../../../context/authContext';
import type { JSX } from 'react';


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

// Topic selection interface
interface TopicOption {
  id: string;
  label: string;
  description: string;
  icon: JSX.Element;
  suggestions: string[];
}

const ChatArea = ({
  currentConversation,
  isLoading,
  onToggleSidebar,
  onNewChat,
  onBackToAllChats,
  showMobileSidebarToggle = false,
  conversations,
  setConversations,
  onConversationUpdate
}: ChatAreaProps) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [showTopicSelector, setShowTopicSelector] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Define available topics
  const topics: TopicOption[] = [
    {
      id: 'general',
      label: 'General Parenting',
      description: 'Everyday parenting questions and advice',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      suggestions: [
        "How can I improve my child's sleep schedule?",
        "What are some positive discipline techniques?",
        "How do I handle temper tantrums?",
        "Activities for quality family time"
      ]
    },
    {
      id: 'vaccines',
      label: 'Child Vaccines',
      description: 'Vaccination schedules, safety, and information',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      suggestions: [
        "What vaccines does my 2-month-old need?",
        "Tell me about the MMR vaccine schedule",
        "Are there any side effects I should watch for?",
        "When should my child get the flu shot?"
      ]
    },
    {
      id: 'medical',
      label: 'Child Medical',
      description: 'General medical concerns and symptoms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      suggestions: [
        "When should I take my child to the doctor for a fever?",
        "How to treat common cold symptoms at home",
        "What to do if my child has an earache?",
        "Signs of dehydration in toddlers"
      ]
    },
    {
      id: 'allergies',
      label: 'Child Allergies',
      description: 'Allergy management and prevention',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      suggestions: [
        "How to introduce common allergens to babies",
        "Signs of allergic reaction in children",
        "Managing seasonal allergies in kids",
        "Food allergy testing for toddlers"
      ]
    },
    {
      id: 'feeding',
      label: 'Child Feeding',
      description: 'Nutrition, feeding schedules, and meal ideas',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      suggestions: [
        "Healthy lunch ideas for picky eaters",
        "When to start solid foods?",
        "Iron-rich foods for toddlers",
        "Managing food refusal in 2-year-olds"
      ]
    }
  ];

  // When component mounts or when there's no conversation, show topic selector
  useEffect(() => {
    if (!currentConversation && !isLoading) {
      setShowTopicSelector(true);
    } else if (currentConversation?.id) {
      setShowTopicSelector(false);
    }
  }, [currentConversation, isLoading]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation?.id) {
      fetchConversationMessages(currentConversation.id);
    } else {
      setMessages([]);
      setSelectedTopic(null);
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
        sender: msg.message_type === 'ai' ? 'ai' : 'user',
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

  const handleNewChatClick = () => {
    setShowTopicSelector(true);
    setSelectedTopic(null);
    setInputText('');
    onNewChat();
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    // Set a default message based on the topic
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
      setInputText(topic.suggestions[0]);
    }
  };

  const handleStartConversation = async () => {
    if (!selectedTopic || !user?.id) return;

    // Create a new conversation through the parent component
    onNewChat();
    
    // Small delay to ensure conversation is created
    setTimeout(() => {
      if (currentConversation) {
        handleSendMessageOptimistic();
        setShowTopicSelector(false); // Hide topic selector after starting conversation
      }
    }, 100);
  };

  const handleBackToTopics = () => {
    onBackToAllChats(); // This will deselect the current conversation
    setShowTopicSelector(true);
    setSelectedTopic(null);
  };

  const handleSendMessageOptimistic = async () => {
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

      // Create user message
      const chatRequestData: AIChatMessageRequest = {
        message: messageText,
        user_fullname: `${user.firstname || ''} ${user.lastname || ''}`.trim() || 'User',
        conversation_id: currentConversation.id
      };

      // Send message to AI and get response
      await sendChatMessage(chatRequestData);

      // Refresh messages to get the complete conversation
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessageOptimistic();
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

  if (isLoading || isFetchingMessages) {
    return (
      <div className="flex flex-1 flex-col bg-white">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">
              {isFetchingMessages ? 'Loading messages...' : 'Loading conversation...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show topic selector when no conversation is selected
  if (!currentConversation) {
    return (
      <div className="flex flex-1 flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-b from-white to-gray-50/30 overflow-y-auto">
          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-900 mb-1 text-center">
            AI Assistant
          </h1>
          <p className="text-gray-600 text-center text-xs sm:text-sm max-w-xs mb-6">
            Select a topic to start your conversation
          </p>

          {/* Topic Selection Grid */}
          <div className="w-full max-w-3xl mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`p-4 bg-white rounded-xl border-2 transition-all text-left hover:shadow-md ${
                    selectedTopic === topic.id
                      ? 'border-yellow-400 shadow-md bg-yellow-50'
                      : 'border-gray-200 hover:border-yellow-400'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${
                    selectedTopic === topic.id
                      ? 'bg-yellow-400 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {topic.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-0.5">{topic.label}</h3>
                  <p className="text-xs text-gray-500">{topic.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Start Conversation Button */}
          {selectedTopic && (
            <div className="w-full max-w-md mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 mb-3">
                  You selected: <span className="font-medium text-yellow-600">
                    {topics.find(t => t.id === selectedTopic)?.label}
                  </span>
                </p>
                <button
                  onClick={handleStartConversation}
                  className="w-full px-4 py-2 bg-yellow-400 text-white rounded-lg font-medium hover:bg-yellow-500 transition-all text-sm"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
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
  }

  // Show chat interface when a conversation is selected
  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Back to Topics Button - Only visible on large screens */}
      <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between">
          <button
            onClick={handleBackToTopics}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors text-xs font-medium border border-yellow-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Topics
          </button>
          
          {/* Mobile Sidebar Toggle - Only visible on mobile */}
          {showMobileSidebarToggle && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-xs font-medium border border-gray-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Conversations
            </button>
          )}
        </div>
      </div>

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
                        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-yellow-400 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      )}

                      {/* Message Content */}
                      <div className={`flex-1 min-w-0 ${message.sender === 'user' ? 'order-first' : 'order-last'}`}>
                        {/* Sender and timestamp */}
                        <div className={`flex items-center gap-1.5 mb-0.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <span className={`text-xs font-medium ${message.sender === 'user' ? 'text-gray-700' : 'text-yellow-600'}`}>
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
                          ? 'bg-yellow-400 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm'
                          } px-3.5 py-2.5`}>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.text}
                          </div>

                          {message.sender === 'user' && (
                            <div className="absolute -right-1.5 bottom-0 w-3 h-3 bg-yellow-400 rounded-br-lg transform rotate-45"></div>
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
                        </div>
                      </div>

                      {/* Avatar for user messages */}
                      {message.sender === 'user' && (
                        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gray-200 flex items-center justify-center mt-0.5">
                          <span className="text-[10px] font-medium text-gray-600">U</span>
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
                <div className="w-10 h-10 mx-auto mb-3 bg-yellow-50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400/20 focus-within:shadow-md">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400/0 to-yellow-400/0 rounded-2xl group-focus-within:from-yellow-400/10 group-focus-within:via-yellow-400/10 group-focus-within:to-yellow-400/10 transition-all duration-300 pointer-events-none"></div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message AI Assistant..."
                className="relative flex-1 p-2.5 pr-10 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 resize-none min-h-[44px] max-h-[120px] placeholder-gray-400 z-10"
                onKeyDown={handleKeyDown}
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
                className="absolute right-1.5 z-20 p-1.5 bg-yellow-400 text-white rounded-xl hover:bg-yellow-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-yellow-400"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
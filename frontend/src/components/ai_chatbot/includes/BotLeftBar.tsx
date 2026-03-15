import { useEffect, useState } from "react";
import { getRequest } from "../../../api/requests";
import type { AIBot } from "../../../interfaces/AIBotInterfaces";
import type { AiConversation } from "../../../interfaces/AIBotInterfaces";

interface BotLeftBarProps {
  onSelectConversation?: (conversationId: string) => void;
  currentChatId?: string;
  conversations: AiConversation[];
  setConversations: (conversations: AiConversation[]) => void;
  loading: boolean;
  error: string | null;
}

const BotLeftBar = ({
  conversations,
  setConversations,
  onSelectConversation,
  currentChatId,
  loading: parentLoading,
  error: parentError
}: BotLeftBarProps) => {
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [bot, setBot] = useState<AIBot | null>(null);
  const [showContent, setShowContent] = useState<boolean>(false);

  const fetchConversations = async () => {
    try {
      setLocalLoading(true);
      const response = await getRequest('/ai-chatbot/all-conversations');
      setConversations(response);
      setLocalError(null);
    } catch (err: any) {
      setLocalError("Failed to load conversations");
      setConversations([]);
    }
  };

  const fetchChatBot = async () => {
    try {
      const response = await getRequest('/ai-chatbot/detail');
      setBot(response);
    } catch (err: any) {
      console.error('Error fetching bot:', err);
      setLocalError(prev => prev || "Failed to load bot");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLocalLoading(true);
      setShowContent(false);
      
      try {
        await Promise.all([fetchConversations(), fetchChatBot()]);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setLocalLoading(false);
          setShowContent(true);
        }, 300);
      }
    };

    loadData();
  }, []);

  const handleConversationClick = (e: React.MouseEvent<HTMLButtonElement>, conversationId: string): void => {
    e.stopPropagation();
    e.preventDefault();
    onSelectConversation?.(conversationId);
  };

  const formatTime = (dateString: string): string => {
    if (!dateString) return 'Recently';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';

      const adjustedDate = new Date(
        date.getTime() + 5 * 60 * 60 * 1000
      );

      const now = new Date();
      const diffMs = now.getTime() - adjustedDate.getTime();

      if (diffMs < 0) return 'Just now';

      const diffInMinutes = Math.floor(diffMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInMinutes < 1) {
        return 'Just now';
      }

      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
      }

      if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      }

      if (diffInDays < 7) {
        return `${diffInDays}d ago`;
      }

      return adjustedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  const hasError = localError || parentError;
  const isLoading = localLoading || (parentLoading && !showContent);

  return (
    <section className="h-full flex flex-col bg-white relative">
      {/* Loading Overlay with Blur Effect */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Spinner */}
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#e5989b]/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-[#e5989b] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
            
            {/* Loading Text */}
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-900">Loading AI Assistant</p>
              <p className="text-xs text-gray-500">Fetching conversations...</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Blurred when loading */}
      <div className={`h-full flex flex-col transition-all duration-300 ${isLoading ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100 blur-0'}`}>
        {/* Header - Simplified without new chat button */}
        <div className="flex-shrink-0 px-3 py-2.5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">AI Assistant</h2>
              <p className="text-xs text-gray-500 truncate">
                {localLoading ? 'Loading...' : `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e5989b] focus:border-[#e5989b] bg-white"
              aria-label="Search conversations"
              disabled={localLoading}
            />
            <svg className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
          <div className="px-2 py-1">
            {!showContent ? (
              // Loading skeletons
              <div className="space-y-0.5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="p-2 border border-gray-200 rounded-lg animate-pulse">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gray-200"></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="h-2 bg-gray-100 rounded w-1/2 mt-2"></div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-2 pl-2 border-l border-gray-200">
                        <div className="h-2 bg-gray-100 rounded w-12"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasError ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-sm text-red-500">{hasError}</div>
              </div>
            ) : !conversations || conversations.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">No conversations yet</p>
                <p className="text-xs text-gray-500 mt-1">Click "Start New Chat" in the main area to begin</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {conversations.map((conversation: AiConversation) => {
                  if (!conversation || !conversation.id) {
                    console.warn('Invalid conversation object:', conversation);
                    return null;
                  }

                  return (
                    <button
                      key={conversation.id}
                      onClick={(e) => handleConversationClick(e, conversation.id)}
                      disabled={parentLoading}
                      className={`w-full text-left rounded-lg transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-[#e5989b] focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${currentChatId === conversation.id
                        ? 'bg-[#fceaea] border border-[#e5989b]/30'
                        : 'hover:bg-[#fceaea] border border-transparent hover:border-[#e5989b]/20'
                        }`}
                      aria-label={`Select conversation: ${conversation.topic || 'Untitled'}`}
                      aria-current={currentChatId === conversation.id ? 'page' : undefined}
                    >
                      <div className="p-2">
                        <div className="flex items-start justify-between w-full">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${currentChatId === conversation.id
                              ? 'bg-[#fff1f1]'
                              : 'bg-gray-100 group-hover:bg-[#fff1f1]'
                              }`}>
                              <svg className={`w-3 h-3 ${currentChatId === conversation.id
                                ? 'text-[#e5989b]'
                                : 'text-gray-600 group-hover:text-[#e5989b]'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`text-xs font-medium truncate ${currentChatId === conversation.id
                                  ? 'text-[#e5989b]'
                                  : 'text-gray-900 group-hover:text-[#e5989b]'
                                  }`}>
                                  {conversation.topic || 'Untitled Conversation'}
                                </h3>
                              </div>
                              <p className="text-[11px] text-gray-600 truncate mt-0.5">
                                Created: {formatTime(conversation.created_at)}
                              </p>
                            </div>
                          </div>
                          <span className="flex-shrink-0 text-[10px] text-gray-500 whitespace-nowrap ml-2 pl-2 border-l border-gray-200">
                            Updated: {formatTime(conversation.updated_at)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-3 py-2 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                P
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
            </div>
            <div className="ml-2 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {bot && bot.name ? bot.name : "Parent User"}
              </p>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                <span className="truncate">AI Assistant Active</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BotLeftBar;
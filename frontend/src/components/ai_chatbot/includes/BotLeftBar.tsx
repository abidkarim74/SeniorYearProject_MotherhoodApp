import { useEffect, useState } from "react";
import { getRequest } from "../../../api/requests";
import type { AIBot } from "../../../interfaces/AIBotInterfaces";
import type { AiConversation } from "../../../interfaces/AIBotInterfaces";

interface BotLeftBarProps {
  onSelectConversation?: (conversationId: string) => void;
  onNewChat?: () => void;
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
  onNewChat, 
  currentChatId,
  loading: parentLoading,
  error: parentError
}: BotLeftBarProps) => {
  const [localLoading, setLocalLoading] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [bot, setBot] = useState<AIBot | null>(null);
  const [newChatLoading, setNewChatLoading] = useState<boolean>(false);

  const fetchConversations = async () => {
    try {
      setLocalLoading(true);
      const response = await getRequest('/ai-chatbot/all-conversations');
      console.log('Conversations API response:', response);
      
      // Handle case where response might not be an array or is null/undefined
      if (!response) {
        console.warn('No response from conversations API');
        setConversations([]);
        return;
      }
      
      // Ensure response is an array
      const conversationsArray = Array.isArray(response) ? response : [];
      
      const transformedConversations: AiConversation[] = conversationsArray.map((conv: any) => ({
        id: conv?.id?.toString() || `temp-${Date.now()}-${Math.random()}`,
        topic: conv?.topic || 'Untitled Conversation',
        user_id: conv?.user_id || '',
        created_at: conv?.created_at || new Date().toISOString(),
        updated_at: conv?.updated_at || new Date().toISOString()
      })).filter(conv => conv.id); // Filter out any items without id
      
      // Sort conversations: most recent first (by updated_at, fallback to created_at)
      const sortedConversations = transformedConversations.sort((a, b) => {
        const dateA = new Date(a.updated_at || a.created_at).getTime();
        const dateB = new Date(b.updated_at || b.created_at).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
      
      setConversations(sortedConversations);
      setLocalError(null);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setLocalError("Failed to load conversations");
      setConversations([]);
    } finally {
      setLocalLoading(false);
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
    fetchConversations();
    fetchChatBot();
  }, []);

  // Sort conversations whenever they change (for when new conversations are added)
  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at).getTime();
    const dateB = new Date(b.updated_at || b.created_at).getTime();
    return dateB - dateA; // Descending order (newest first)
  });

  const handleNewChatClick = async (): Promise<void> => {
    if (onNewChat) {
      setNewChatLoading(true);
      try {
        await onNewChat();
        // Refresh conversations after new chat is created
        await fetchConversations();
      } catch (error) {
        console.error('Error creating new chat:', error);
      } finally {
        setNewChatLoading(false);
      }
    } else {
      const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      onSelectConversation?.(newId);
    }
  };

  const handleConversationClick = (e: React.MouseEvent<HTMLButtonElement>, conversationId: string): void => {
    e.stopPropagation();
    e.preventDefault();
    onSelectConversation?.(conversationId);
  };

  // Helper function to format time
  const formatTime = (dateString: string): string => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
      } else if (diffInHours < 168) {
        return `${Math.floor(diffInHours / 24)}d ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Recently';
    }
  };

  // Show loading indicator for new chat creation
  const isLoading = localLoading || parentLoading || newChatLoading;
  const hasError = localError || parentError;

  return (
    <section className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2.5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">AI Assistant</h2>
              <p className="text-xs text-gray-500 truncate">
                {localLoading ? 'Loading...' : `${sortedConversations.length} conversation${sortedConversations.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleNewChatClick}
            disabled={parentLoading || newChatLoading}
            className="flex-shrink-0 p-1.5 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-lg hover:shadow-sm transition-shadow duration-150 hover:shadow-[#e5989b]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            title="New Chat"
            aria-label="Start new chat"
          >
            {parentLoading || newChatLoading ? (
              <div className="w-3.5 h-3.5 flex items-center justify-center">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
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
          {localLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-sm text-gray-500">Loading conversations...</div>
            </div>
          ) : hasError ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-sm text-red-500">{hasError}</div>
            </div>
          ) : !sortedConversations || sortedConversations.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">No conversations yet</p>
              <p className="text-xs text-gray-500 mt-1">Start a new chat with the AI Assistant</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {/* Show loading spinner when creating new chat */}
              {(parentLoading || newChatLoading) && (
                <div className="p-2 border border-[#e5989b]/20 rounded-lg bg-[#fceaea] animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-[#fff1f1] flex items-center justify-center">
                      <div className="w-3 h-3 border border-[#e5989b] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-medium text-[#e5989b] truncate">
                          Creating new chat...
                        </h3>
                      </div>
                      <p className="text-[11px] text-gray-600 truncate mt-0.5">
                        Just a moment
                      </p>
                    </div>
                    <span className="flex-shrink-0 text-[10px] text-gray-500 whitespace-nowrap ml-2 pl-2 border-l border-gray-200">
                      Just now
                    </span>
                  </div>
                </div>
              )}
              
              {/* Existing conversations - sorted by most recent first */}
              {sortedConversations.map((conversation: AiConversation) => {
                // Safety check for conversation object
                if (!conversation || !conversation.id) {
                  console.warn('Invalid conversation object:', conversation);
                  return null;
                }
                
                return (
                  <button
                    key={conversation.id}
                    onClick={(e) => handleConversationClick(e, conversation.id)}
                    disabled={parentLoading || newChatLoading}
                    className={`w-full text-left rounded-lg transition-all duration-150 group focus:outline-none focus:ring-2 focus:ring-[#e5989b] focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                      currentChatId === conversation.id
                        ? 'bg-[#fceaea] border border-[#e5989b]/30'
                        : 'hover:bg-[#fceaea] border border-transparent hover:border-[#e5989b]/20'
                    }`}
                    aria-label={`Select conversation: ${conversation.topic || 'Untitled'}`}
                    aria-current={currentChatId === conversation.id ? 'page' : undefined}
                  >
                    <div className="p-2">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${
                            currentChatId === conversation.id
                              ? 'bg-[#fff1f1]'
                              : 'bg-gray-100 group-hover:bg-[#fff1f1]'
                          }`}>
                            <svg className={`w-3 h-3 ${
                              currentChatId === conversation.id
                                ? 'text-[#e5989b]'
                                : 'text-gray-600 group-hover:text-[#e5989b]'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-xs font-medium truncate ${
                                currentChatId === conversation.id
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
    </section>
  );
};

export default BotLeftBar;
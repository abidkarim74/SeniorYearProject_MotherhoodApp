import { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import BotLeftBar from "../components/ai_chatbot/includes/BotLeftBar";
import ChatArea from "../components/ai_chatbot/includes/ChatArea";
import { Menu, X, ChevronLeft } from 'lucide-react';

import { type AiConversation } from '../interfaces/AIBotInterfaces';
import { postRequest, getRequest } from '../api/requests';

const ConversationAIChatbot = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentConversation, setCurrentConversation] = useState<AiConversation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<AiConversation[]>([]);

  // Fetch conversation details when ID changes
  useEffect(() => {
    const fetchConversationDetails = async () => {
      if (!id) {
        setCurrentConversation(null);
        return;
      }

      setIsLoading(true);
      try {
        // First, try to find conversation in local state
        const existingConversation = conversations.find(conv => conv.id === id);
        
        if (existingConversation) {
          setCurrentConversation(existingConversation);
        } else {
          // If not found locally, fetch it from the server
          // Note: You might need an endpoint like `/ai-chatbot/conversation/{id}`
          // For now, let's use the conversations list we already have
          console.log('Conversation not found locally, fetching all conversations again...');
          await fetchAllConversations();
        }
      } catch (err: any) {
        console.error('Error fetching conversation details:', err);
        setError('Failed to load conversation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversationDetails();
  }, [id, conversations]);

  // Fetch all conversations
  const fetchAllConversations = async () => {
    try {
      setLoading(true);
      const response = await getRequest('/ai-chatbot/all-conversations');
      setConversations(response || []);
      
      // If there's an ID in the URL, find and set the current conversation
      if (id) {
        const foundConversation = response?.find((conv: AiConversation) => conv.id === id);
        setCurrentConversation(foundConversation || null);
      }
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new conversation
  const createNewConversation = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await postRequest('/ai-chatbot/create-conversation', {});

      // Add to conversations list
      setConversations(prev => [response, ...prev]);
      
      // Set as current conversation
      setCurrentConversation(response);
      
      // Navigate to the new conversation
      navigate('/ai-assistant/chat/' + response.id);

    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isChatPage = id !== undefined;

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // Always show sidebar on desktop
      } else if (id) {
        setIsSidebarOpen(false); // Hide sidebar on mobile when chat is selected
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [id]);

  useEffect(() => {
    if (id && isMobile) {
      setIsSidebarOpen(false);
    }
  }, [id, isMobile]);

  // Initial fetch of conversations
  useEffect(() => {
    fetchAllConversations();
  }, []);

  const handleSelectConversation = (conversationId: string): void => {
    // Find the conversation from local state
    const selectedConversation = conversations.find(conv => conv.id === conversationId);
    
    if (selectedConversation) {
      setCurrentConversation(selectedConversation);
    }
    
    navigate(`/ai-assistant/chat/${conversationId}`);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = async (): Promise<void> => {
    await createNewConversation();
  };

  const handleBackToAllChats = (): void => {
    setCurrentConversation(null);
    navigate('/ai-assistant/chat');
    if (isMobile) {
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleConversationUpdate = (updatedConversation: AiConversation): void => {
    // Update in conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === updatedConversation.id ? updatedConversation : conv
      )
    );
    
    // Update current conversation if it's the same one
    if (currentConversation?.id === updatedConversation.id) {
      setCurrentConversation(updatedConversation);
    }
  };

  const getShareableUrl = (): string => {
    if (id) {
      return `${window.location.origin}/ai-assistant/chat/${id}`;
    }
    return `${window.location.origin}/ai-assistant/chat`;
  };

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(getShareableUrl());
    console.log('Link copied to clipboard:', getShareableUrl());
  };

  return (
    <div className="abid flex h-full flex-col md:flex-row-reverse">
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <div className="flex items-center gap-3">
            {isChatPage ? (
              <button
                onClick={handleBackToAllChats}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Chats</span>
              </button>
            ) : (
              <span className="text-lg font-semibold text-gray-900">AI Assistant</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isChatPage && (
              <button
                onClick={handleNewChat}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'New Chat'}
              </button>
            )}

            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {isSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sidebar Overlay for Mobile - Only show when sidebar is open on mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          fixed inset-y-0 left-0 z-50 w-full 
          md:static md:z-auto md:flex md:w-64 lg:w-72 
          md:translate-x-0 
          transform transition-transform duration-300 ease-in-out
          h-full md:h-[calc(100vh-4rem)] 
          bg-white
          overflow-y-auto
        `}
      >
        <div className="flex-1 h-[85vh] md:h-[93.5%] lg:h-[93.5%] overflow-y-auto">
          <BotLeftBar
            onSelectConversation={handleSelectConversation}
            onNewChat={createNewConversation}
            currentChatId={id}
            conversations={conversations}
            setConversations={setConversations}
            loading={loading}
            error={error}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
        <ChatArea
          currentConversation={currentConversation}
          isLoading={isLoading}
          conversations={conversations}
          isChatPage={isChatPage}
          setConversations={setConversations}
          onBackToAllChats={handleBackToAllChats}
          onToggleSidebar={toggleSidebar}
          onCopyLink={handleCopyLink}
          onNewChat={handleNewChat}
          showMobileSidebarToggle={isMobile}
          onConversationUpdate={handleConversationUpdate} // Add this prop
        />
      </div>
    </div>
  );
};

export default ConversationAIChatbot;
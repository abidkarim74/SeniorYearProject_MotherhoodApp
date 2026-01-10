// pages/ConversationAIChatbot.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BotLeftBar from "../components/ai_chatbot/includes/BotLeftBar";
import ChatArea from "../components/ai_chatbot/includes/ChatArea";
import { Menu, X, ChevronLeft } from 'lucide-react';

const ConversationAIChatbot = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentConversation, setCurrentConversation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const isChatPage = id !== undefined;

  // Check if mobile on mount and resize
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

  // Close sidebar on mobile when chat is selected
  useEffect(() => {
    if (id && isMobile) {
      setIsSidebarOpen(false);
    }
  }, [id, isMobile]);

  // Fetch conversation data when ID changes
  useEffect(() => {
    if (id) {
      fetchConversationData(id);
    } else {
      setCurrentConversation(null);
    }
  }, [id]);

  const fetchConversationData = async (conversationId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const mockData: Record<string, any> = {
        '1': {
          id: '1',
          title: 'Vaccination Schedule',
          messages: [
            { id: 1, sender: 'user' as const, text: 'When is the next MMR vaccine due for my 1-year-old?', timestamp: '10:30 AM' },
            { id: 2, sender: 'ai' as const, text: 'The next MMR vaccine is typically given between 12-15 months of age. It\'s the first dose, with the second dose recommended between 4-6 years.', timestamp: '10:31 AM' },
          ],
          createdAt: '2024-01-10'
        },
        '2': {
          id: '2',
          title: 'Growth Milestones',
          messages: [
            { id: 1, sender: 'user' as const, text: 'What milestones should my 6-month-old be reaching?', timestamp: 'Yesterday' },
            { id: 2, sender: 'ai' as const, text: 'At 6 months, babies typically start sitting without support, babbling (making consonant-vowel sounds), and may begin to show interest in solid foods.', timestamp: 'Yesterday' },
          ],
          createdAt: '2024-01-09'
        },
        '3d04b408-45d3-406d-bc71-b79ee2b46daa': {
          id: '3d04b408-45d3-406d-bc71-b79ee2b46daa',
          title: 'Sleep Training',
          messages: [
            { id: 1, sender: 'user' as const, text: 'What are the best sleep training methods?', timestamp: 'Dec 15' },
            { id: 2, sender: 'ai' as const, text: 'Gentle sleep training methods include the Ferber method, chair method, and bedtime fading. Always consult with your pediatrician first.', timestamp: 'Dec 15' }
          ],
          createdAt: '2024-01-08'
        }
      };

      await new Promise(resolve => setTimeout(resolve, 300));
      const data = mockData[conversationId];
      if (data) {
        setCurrentConversation(data);
      } else {
        setCurrentConversation({
          id: conversationId,
          title: `Chat ${conversationId.substring(0, 8)}...`,
          messages: [],
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversationId: string): void => {
    navigate(`/ai-assistant/chat/${conversationId}`);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = (): void => {
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    navigate(`/ai-assistant/chat/${newId}`);
    setCurrentConversation(null);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleBackToAllChats = (): void => {
    navigate('/ai-assistant/chat');
    if (isMobile) {
      setIsSidebarOpen(true);
    }
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
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
              >
                New Chat
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
            onNewChat={handleNewChat}
            currentChatId={id}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
        <ChatArea
          currentConversation={currentConversation}
          isLoading={isLoading}
          isChatPage={isChatPage}
          onBackToAllChats={handleBackToAllChats}
          onToggleSidebar={toggleSidebar}
          onCopyLink={handleCopyLink}
          onNewChat={handleNewChat}
          showMobileSidebarToggle={isMobile}
        />
      </div>
    </div>
  );
};

export default ConversationAIChatbot;
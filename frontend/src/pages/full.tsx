// pages/ConversationAIChatbot.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BotLeftBar from "../components/ai_chatbot/includes/BotLeftBar";
import ChatArea from "../components/ai_chatbot/includes/ChatArea";

const ConversationAIChatbot = () => {
  const { id } = useParams<{ id: string }>(); // Get chat ID from URL
  const navigate = useNavigate(); // For navigation
  const location = useLocation(); // To get current path
  const [currentConversation, setCurrentConversation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // For mobile sidebar toggle

  // Check if we're on a chat page or the base page
  const isChatPage = id !== undefined;

  // Close sidebar on mobile when chat is selected
  useEffect(() => {
    if (id && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [id]);

  // Fetch conversation data when ID changes
  useEffect(() => {
    if (id) {
      fetchConversationData(id);
    } else {
      // No chat selected - show default state
      setCurrentConversation(null);
    }
  }, [id]);

  const fetchConversationData = async (conversationId: string): Promise<void> => {
    setIsLoading(true);

    try {
      // Mock data - replace with actual API call
      const mockData: Record<string, any> = {
        '1': {
          id: '1',
          title: 'Vaccination Schedule',
          messages: [
            { id: 1, sender: 'user' as const, text: 'When is the next MMR vaccine due for my 1-year-old?', timestamp: '10:30 AM' },
            { id: 2, sender: 'ai' as const, text: 'The next MMR vaccine is typically given between 12-15 months of age. It\'s the first dose, with the second dose recommended between 4-6 years.', timestamp: '10:31 AM' },
            { id: 3, sender: 'user' as const, text: 'Are there any side effects I should watch for?', timestamp: '10:32 AM' },
            { id: 4, sender: 'ai' as const, text: 'Common side effects include mild fever, soreness at injection site, and a mild rash 7-14 days after vaccination. Serious side effects are very rare.', timestamp: '10:33 AM' },
            { id: 5, sender: 'user' as const, text: 'What about other vaccines due at 1 year?', timestamp: '10:34 AM' },
            { id: 6, sender: 'ai' as const, text: 'At 12-15 months, babies typically receive: MMR, Varicella (chickenpox), Hib (4th dose), PCV13 (4th dose), and the first dose of Hepatitis A.', timestamp: '10:35 AM' },
            { id: 7, sender: 'user' as const, text: 'Thanks! Should I give pain relief before the appointment?', timestamp: '10:36 AM' },
            { id: 8, sender: 'ai' as const, text: 'It\'s generally not recommended to give pain relief before vaccines as it might reduce immune response. You can give it afterward if needed for fever or discomfort.', timestamp: '10:37 AM' },
            { id: 9, sender: 'user' as const, text: 'What about pre-vaccination checklist?', timestamp: '10:38 AM' },
            { id: 10, sender: 'ai' as const, text: 'Before vaccination: Ensure baby is well, bring immunization card, inform about any previous reactions, and prepare questions for pediatrician.', timestamp: '10:39 AM' },
            { id: 11, sender: 'user' as const, text: 'Can vaccines be delayed if baby has cold?', timestamp: '10:40 AM' },
            { id: 12, sender: 'ai' as const, text: 'Mild illnesses like cold without fever are usually not a reason to delay vaccines. However, moderate to severe illness may require postponement - consult pediatrician.', timestamp: '10:41 AM' },
            { id: 13, sender: 'user' as const, text: 'What about combination vaccines?', timestamp: '10:42 AM' },
            { id: 14, sender: 'ai' as const, text: 'Combination vaccines (like MMRV) reduce number of shots. They\'re as effective and safe as separate vaccines. Discuss options with pediatrician.', timestamp: '10:43 AM' },
            { id: 15, sender: 'user' as const, text: 'Any tips for calming baby during shots?', timestamp: '10:44 AM' },
            { id: 16, sender: 'ai' as const, text: 'Breastfeed during/after shot, hold baby close, use distraction with toys, stay calm yourself, and comfort immediately after.', timestamp: '10:45 AM' },
          ],
          createdAt: '2024-01-10'
        },
        '2': {
          id: '2',
          title: 'Growth Milestones',
          messages: [
            { id: 1, sender: 'user' as const, text: 'What milestones should my 6-month-old be reaching?', timestamp: 'Yesterday' },
            { id: 2, sender: 'ai' as const, text: 'At 6 months, babies typically start sitting without support, babbling (making consonant-vowel sounds), and may begin to show interest in solid foods.', timestamp: 'Yesterday' },
            { id: 3, sender: 'user' as const, text: 'My baby isn\'t rolling over yet. Should I be concerned?', timestamp: 'Yesterday' },
            { id: 4, sender: 'ai' as const, text: 'Most babies roll from tummy to back by 4-6 months and back to tummy by 6-7 months. If your baby isn\'t rolling by 7 months, mention it at your next pediatric visit.', timestamp: 'Yesterday' },
            { id: 5, sender: 'user' as const, text: 'What about fine motor skills?', timestamp: 'Yesterday' },
            { id: 6, sender: 'ai' as const, text: 'At 6 months, babies typically: transfer objects hand to hand, bang objects together, use raking grasp, and bring objects to mouth.', timestamp: 'Yesterday' },
            { id: 7, sender: 'user' as const, text: 'When should I start tummy time?', timestamp: 'Yesterday' },
            { id: 8, sender: 'ai' as const, text: 'Tummy time can start from day 1! Begin with 1-2 minutes several times daily, gradually increasing. By 3 months, aim for at least 1 hour total throughout the day.', timestamp: 'Yesterday' }
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

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const data = mockData[conversationId];
      if (data) {
        setCurrentConversation(data);
      } else {
        // Handle non-existent conversation
        setCurrentConversation({
          id: conversationId,
          title: `Chat ${conversationId.substring(0, 8)}...`,
          messages: [],
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversationId: string): void => {
    // Update URL when conversation is selected
    navigate(`/ai-assistant/chat/${conversationId}`);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleNewChat = (): void => {
    // Generate a UUID-like ID for new chat
    const newId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();

    // Navigate to new chat URL
    navigate(`/ai-assistant/chat/${newId}`);
    // Clear current conversation while loading new one
    setCurrentConversation(null);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleBackToAllChats = (): void => {
    // Navigate back to base chat page without ID
    navigate('/ai-assistant/chat');
  };

  const toggleSidebar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Format URL for sharing (like DeepSeek)
  const getShareableUrl = (): string => {
    if (id) {
      return `${window.location.origin}/ai-assistant/chat/${id}`;
    }
    return `${window.location.origin}/ai-assistant/chat`;
  };

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(getShareableUrl());
    // You could add a toast notification here
    console.log('Link copied to clipboard:', getShareableUrl());
  };

  return (
    <div className="abid flex h-full flex-col md:flex-row-reverse md:overflow-hidden">
      {/* Mobile Header with Menu Button */}
      <div className="md:hidden flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between p-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-900">AI Assistant</span>
          </div>
          <button
            onClick={handleNewChat}
            className="p-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-lg"
            aria-label="New chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full md:h-[calc(100vh-4rem)] 
 overflow-y-auto 
           md:overflow-y-auto">

        <ChatArea
          currentConversation={currentConversation}
          isLoading={isLoading}
          isChatPage={isChatPage}
          onBackToAllChats={handleBackToAllChats}
          onToggleSidebar={toggleSidebar}
          onCopyLink={handleCopyLink}
          onNewChat={handleNewChat}
          showMobileSidebarToggle={window.innerWidth < 768}
        />
      </div>

      <div className={`
        ${isSidebarOpen ? 'flex' : 'hidden'} 
        md:flex md:w-64 lg:w-72
        fixed md:sticky md:top-0
        inset-0 md:inset-auto z-40 md:z-30
        h-full md:h-[calc(100vh-4rem)] 
        bg-white border-l border-gray-200
        md:overflow-y-auto
      `}>
        <div className="md:hidden flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 -z-10"
          onClick={toggleSidebar}
        />

        <div className="flex-1 overflow-hidden flex flex-col">
          <BotLeftBar
            onSelectConversation={handleSelectConversation}
            onNewChat={handleNewChat}
            currentChatId={id}
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationAIChatbot;
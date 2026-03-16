import { useState, useEffect } from "react";
import BotLeftbar from "./includes/BotLeftbar";
import ChatArea from "./includes/ChatArea";
import { useUIContext } from "../../context/uiContext";
import { Menu, X } from "lucide-react";

const Chatbot = () => {
  const { setBotOpen } = useUIContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(1); // Default to first chat
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setBotOpen(true);

    // Check if mobile on mount and when window resizes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      setBotOpen(false);
      window.removeEventListener('resize', checkMobile);
    };
  }, [setBotOpen]);

  const handleChatSelect = (chatId: number) => {
    setSelectedChat(chatId);
    if (isMobile) {
      setIsSidebarOpen(false); // Close sidebar on mobile after selecting a chat
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Mobile Menu Button - Only visible on small screens */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-white rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-200 group"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600 group-hover:text-[#e5989b]" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 group-hover:text-[#e5989b]" />
        )}
      </button>

      {/* Left Sidebar - Responsive with slide animation */}
      <div
        className={`
          fixed md:relative z-40 h-full transition-all duration-300 ease-in-out
          ${isMobile 
            ? isSidebarOpen 
              ? 'translate-x-0' 
              : '-translate-x-full' 
            : 'translate-x-0'
          }
        `}
      >
        <BotLeftbar 
          selectedChat={selectedChat} 
          onChatSelect={handleChatSelect}
          isMobile={isMobile}
          onCloseSidebar={closeSidebar}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Chat Area */}
      <div className={`
        flex-1 transition-all duration-300 ease-in-out
        ${isMobile && isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        <ChatArea 
          selectedChat={selectedChat}
          isMobile={isMobile}
          onOpenSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
};

export default Chatbot;
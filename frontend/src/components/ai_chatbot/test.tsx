import { useState } from "react";
import BotLeftBar from "./includes/BotLeftBar";
import BotConversationArea from "./includes/ChatArea";

const ChatBot = () => {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>("1");

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setIsLeftBarOpen(false);
  };

  const handleBackToConversations = () => {
    setActiveConversationId(null);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        {/* Left Sidebar - Fixed, no scroll */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-hidden flex flex-col">
          <BotLeftBar onSelectConversation={setActiveConversationId} />
        </div>
        
        {/* Main Content - Fixed container, messages scroll inside */}
        <div className="flex-1 overflow-hidden">
          <BotConversationArea conversationId={activeConversationId} />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full w-full overflow-hidden">
        {!activeConversationId ? (
          /* Mobile: No conversation selected - Show conversation list */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Mobile Header - Fixed */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">AI Conversations</h1>
                <button
                  onClick={() => setIsLeftBarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Empty State - Scrollable if needed */}
            <div className="flex-1 overflow-auto">
              <div className="flex items-center justify-center p-4 min-h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-white text-4xl">🤖</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a conversation</h3>
                  <p className="text-gray-600 mb-8">Choose from your conversation history</p>
                  <button
                    onClick={() => setIsLeftBarOpen(true)}
                    className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white px-6 py-3 rounded-lg font-medium"
                  >
                    View Conversations
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile: Conversation selected - Show conversation view */
          <div className="flex flex-col h-full overflow-hidden">
            {/* Mobile Header with Back Button - Fixed */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
              <div className="flex items-center">
                <button
                  onClick={handleBackToConversations}
                  className="mr-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div>
                  <h2 className="font-medium text-gray-900">Conversation</h2>
                  <p className="text-xs text-gray-500">Active now</p>
                </div>
              </div>
            </div>

            {/* Conversation Area - Scrollable container */}
            <div className="flex-1 overflow-hidden">
              <BotConversationArea conversationId={activeConversationId} onBack={handleBackToConversations} />
            </div>
          </div>
        )}

        {/* Mobile Sidebar (hidden by default) */}
        <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ${
          isLeftBarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20" onClick={() => setIsLeftBarOpen(false)} />
          
          {/* Sidebar - Fixed height with internal scroll */}
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl overflow-hidden flex flex-col">
            <BotLeftBar onSelectConversation={handleSelectConversation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
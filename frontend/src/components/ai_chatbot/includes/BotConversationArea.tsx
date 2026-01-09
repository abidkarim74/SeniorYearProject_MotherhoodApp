interface BotConversationAreaProps {
  conversationId?: string | null;
  onBack?: () => void;
}

const BotConversationArea = ({ conversationId, onBack }: BotConversationAreaProps) => {
  return (
    <section className="flex flex-col h-full min-h-0">
      {/* Messages Area - Takes remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {conversationId ? (
          <div className="p-3 sm:p-4 h-full">
            {/* Messages container */}
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Bot message example */}
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">AI</span>
                </div>
                <div className="bg-white rounded-lg sm:rounded-xl rounded-tl-none p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                  <p className="text-gray-900 text-sm">Hello! I'm your AI Parenting Assistant. How can I help you today?</p>
                  <p className="text-xs text-gray-500 mt-1">10:30 AM</p>
                </div>
              </div>

              {/* User message example */}
              <div className="flex items-start justify-end space-x-2 sm:space-x-3">
                <div className="bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-lg sm:rounded-xl rounded-tr-none p-3 shadow-sm max-w-[85%] sm:max-w-[80%]">
                  <p className="text-sm">When is my child's next vaccination due?</p>
                  <p className="text-xs text-white/80 mt-1 text-right">10:32 AM</p>
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-700 text-xs">U</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6">
            <div className="text-center max-w-md">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl">💬</span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-6">
                Choose a conversation from the sidebar or create a new one to begin chatting.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* GPT-style Message Input with your colors */}
      {conversationId && (
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-3">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-center bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="pl-3 pr-2 py-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-1 py-2 sm:py-2.5 text-sm focus:outline-none placeholder-gray-500"
              />
              <div className="flex items-center pr-2 gap-1">
                <button className="p-1.5 sm:p-2 text-gray-500 hover:text-[#e5989b] hover:bg-gray-100 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button className="p-1.5 sm:p-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-md hover:opacity-90 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              AI can make mistakes. Verify important parenting information.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default BotConversationArea;
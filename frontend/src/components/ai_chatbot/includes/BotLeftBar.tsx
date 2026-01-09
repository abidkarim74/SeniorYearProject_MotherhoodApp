interface BotLeftBarProps {
  onSelectConversation?: (conversationId: string) => void;
}

const BotLeftBar = ({ onSelectConversation }: BotLeftBarProps) => {
  // Sample conversations data
  const conversations = [
    { id: '1', title: 'Vaccination Schedule', lastMessage: 'Next MMR vaccine due in 2 weeks', time: '10:30 AM', unread: 0 },
    { id: '2', title: 'Growth Milestones', lastMessage: '6-month development tracking', time: 'Yesterday', unread: 2 },
    { id: '3', title: 'Sleep Training', lastMessage: 'Bedtime routine suggestions', time: 'Dec 15', unread: 0 },
    { id: '4', title: 'Nutrition Advice', lastMessage: 'Introducing solid foods', time: 'Dec 10', unread: 1 },
    { id: '5', title: 'Teething', lastMessage: 'Best teething toys', time: 'Dec 8', unread: 0 },
  ];

  const handleNewChat = () => {
    const newId = Date.now().toString();
    if (onSelectConversation) {
      onSelectConversation(newId);
    }
  };

  return (
    <section className="h-full flex flex-col">
      {/* Header - Auto size relative to container */}
      <div className="flex-shrink-0 px-3 py-2.5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">AI Chat</h2>
              <p className="text-xs text-gray-500 truncate">{conversations.length} conv</p>
            </div>
          </div>
          <button
            onClick={handleNewChat}
            className="flex-shrink-0 p-1.5 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-lg hover:shadow-sm"
            title="New Chat"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Search - Auto size */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#e5989b] focus:border-[#e5989b] bg-white"
          />
          <svg className="absolute left-2.5 top-1.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Conversations List - Takes ALL remaining space with relative sizing */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="px-2 py-1">
            <div className="space-y-0.5">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation?.(conversation.id)}
                  className="w-full p-2 text-left rounded-lg hover:bg-[#fceaea] border border-transparent hover:border-[#e5989b]/20 transition-all duration-150 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#fff1f1]">
                        <svg className="w-3 h-3 text-gray-600 group-hover:text-[#e5989b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-medium text-gray-900 truncate group-hover:text-[#e5989b]">
                            {conversation.title}
                          </h3>
                          {conversation.unread > 0 && (
                            <span className="flex-shrink-0 w-4 h-4 bg-[#e5989b] text-white text-[10px] font-medium rounded-full flex items-center justify-center ml-1">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                    </div>
                    <span className="flex-shrink-0 text-[10px] text-gray-500 whitespace-nowrap ml-1">
                      {conversation.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer/User Profile - Auto size */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="relative flex-shrink-0">
            <div className="w-7 h-7 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
          </div>
          <div className="ml-2 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">Parent User</p>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="truncate">AI Assistant</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BotLeftBar;
import { useState } from 'react';
import { 
  MessageCircle, Plus, Search, Clock, Star, Archive, Trash2, 
  MoreVertical, Edit2, Check, X, Sparkles, Bot, Heart, Smile, 
  Coffee, Sun, ChevronLeft 
} from 'lucide-react';

interface BotLeftbarProps {
  selectedChat?: number | null;
  onChatSelect: (chatId: number) => void;
  isMobile?: boolean;
  onCloseSidebar?: () => void; // This is the correct prop name
}

const BotLeftbar = ({ selectedChat, onChatSelect, isMobile, onCloseSidebar }: BotLeftbarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showOptions, setShowOptions] = useState<number | null>(null);

  // Sample conversations data
  const [conversations, setConversations] = useState([
    { 
      id: 1, 
      title: 'Baby feeding schedule', 
      preview: 'How often should I feed my 3-month...',
      time: '2 min ago',
      isStarred: true,
      mood: 'happy',
      messages: 12
    },
    { 
      id: 2, 
      title: 'Sleep training tips', 
      preview: 'My baby won\'t sleep through the night...',
      time: '1 hour ago',
      isStarred: false,
      mood: 'tired',
      messages: 8
    },
    { 
      id: 3, 
      title: 'Vaccination concerns', 
      preview: 'Are there any side effects for the...',
      time: 'Yesterday',
      isStarred: true,
      mood: 'worried',
      messages: 15
    },
    { 
      id: 4, 
      title: 'Baby milestones', 
      preview: 'When do babies start crawling?',
      time: '2 days ago',
      isStarred: false,
      mood: 'excited',
      messages: 5
    },
    { 
      id: 5, 
      title: 'Breastfeeding help', 
      preview: 'Having trouble with latching...',
      time: '3 days ago',
      isStarred: false,
      mood: 'frustrated',
      messages: 20
    },
    { 
      id: 6, 
      title: 'Teething remedies', 
      preview: 'What helps with teething pain?',
      time: '1 week ago',
      isStarred: false,
      mood: 'curious',
      messages: 7
    },
  ]);

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case 'happy': return <Smile className="w-3 h-3 text-yellow-500" />;
      case 'tired': return <Coffee className="w-3 h-3 text-amber-600" />;
      case 'worried': return <Heart className="w-3 h-3 text-pink-400" />;
      case 'excited': return <Sparkles className="w-3 h-3 text-purple-400" />;
      case 'frustrated': return <X className="w-3 h-3 text-red-400" />;
      case 'curious': return <Search className="w-3 h-3 text-blue-400" />;
      default: return <MessageCircle className="w-3 h-3 text-gray-400" />;
    }
  };

  const handleRename = (id: number, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
    setShowOptions(null);
  };

  const handleSaveRename = (id: number) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, title: editTitle } : conv
      )
    );
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (id: number) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    setShowOptions(null);
  };

  const toggleStar = (id: number) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id ? { ...conv, isStarred: !conv.isStarred } : conv
      )
    );
    setShowOptions(null);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const starredConversations = filteredConversations.filter(conv => conv.isStarred);
  const otherConversations = filteredConversations.filter(conv => !conv.isStarred);

  const handleChatClick = (chatId: number) => {
    onChatSelect(chatId);
    if (isMobile && onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const ConversationItem = ({ conv }: { conv: typeof conversations[0] }) => (
    <div className="relative group">
      <div 
        className={`flex items-start space-x-3 p-3 rounded-xl transition-all duration-200 ${
          editingId === conv.id 
            ? 'bg-[#fceaea] ring-2 ring-[#e5989b] ring-opacity-50' 
            : selectedChat === conv.id
              ? 'bg-[#fceaea] shadow-md'
              : 'hover:bg-[#fceaea] hover:shadow-sm cursor-pointer'
        }`}
        onClick={() => {
          if (editingId !== conv.id) {
            handleChatClick(conv.id);
          }
        }}
      >
        {/* Avatar/Bot Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-xl flex items-center justify-center shadow-md">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            {getMoodIcon(conv.mood)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editingId === conv.id ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="flex-1 text-sm font-medium bg-white border border-[#e5989b] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#e5989b]"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSaveRename(conv.id)}
              />
              <button
                onClick={() => handleSaveRename(conv.id)}
                className="p-1 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-800 truncate">{conv.title}</h3>
                <div className="flex items-center space-x-1">
                  {conv.isStarred && (
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  )}
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{conv.preview}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-[#e5989b] font-medium">{conv.messages} messages</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(showOptions === conv.id ? null : conv.id);
                  }}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-white rounded-lg transition-all"
                >
                  <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Options Menu */}
      {showOptions === conv.id && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => toggleStar(conv.id)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#fceaea] hover:text-[#e5989b] transition-colors"
          >
            <Star className={`w-4 h-4 mr-3 ${conv.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {conv.isStarred ? 'Unstar' : 'Star'}
          </button>
          <button
            onClick={() => handleRename(conv.id, conv.title)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#fceaea] hover:text-[#e5989b] transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-3" />
            Rename
          </button>
          <button
            onClick={() => console.log('Archive:', conv.id)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#fceaea] hover:text-[#e5989b] transition-colors"
          >
            <Archive className="w-4 h-4 mr-3" />
            Archive
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={() => handleDelete(conv.id)}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Delete
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full md:w-80 h-full bg-white/95 backdrop-blur-sm border-r border-gray-200 flex flex-col relative">
      {/* Mobile Header with Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h2 className="font-semibold text-gray-700">AI Assistant</h2>
          </div>
          <button
            onClick={onCloseSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* Header for Desktop */}
      {!isMobile && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h2 className="font-semibold text-gray-700">AI Assistant</h2>
            </div>
            <button className="p-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white rounded-xl hover:shadow-lg transition-all duration-200 group relative">
              <Plus className="w-4 h-4" />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] text-white text-xs py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                New Chat
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-2 h-2 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rotate-45"></div>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b] focus:bg-white transition-all text-sm"
            />
          </div>
        </div>
      )}

      {/* Mobile Search (separate for better UX) */}
      {isMobile && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5989b] focus:bg-white transition-all text-sm"
            />
          </div>
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Today's date */}
        <div className="flex items-center space-x-2 px-2">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs font-medium text-gray-400">RECENT</span>
        </div>

        {/* Starred Conversations */}
        {starredConversations.length > 0 && (
          <div className="space-y-1">
            {starredConversations.map(conv => (
              <ConversationItem key={conv.id} conv={conv} />
            ))}
          </div>
        )}

        {/* Other Conversations */}
        {otherConversations.length > 0 && (
          <div className="space-y-1">
            {otherConversations.map(conv => (
              <ConversationItem key={conv.id} conv={conv} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-[#e5989b] to-[#d88a8d] rounded-2xl flex items-center justify-center mb-3 opacity-50">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 font-medium">No conversations found</p>
            <p className="text-sm text-gray-400 mt-1">Start a new chat to get help</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Sun className="w-3 h-3" />
            <span>{filteredConversations.length} conversations</span>
          </div>
          <button className="hover:text-[#e5989b] transition-colors">Clear all</button>
        </div>
      </div>
    </div>
  );
};

export default BotLeftbar;
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
      <h2>h</h2>
    </div>
  );
};

export default ChatBot;
export interface AIBot {
  description: string
  id: string
  name: string
  user_id: string
}


interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AiConversation {
  id: string;
  topic: string;
  user_id: string,
  created_at: string
  updated_at:  string
  messages: Message[]
}


export interface AIMessage {
  id: string;
  conversation_id: string;
  user_id: string;
  sender: 'user' | 'ai'; // This is what you're using in the component
  text: string;
  created_at: string;
  timestamp?: string;
}
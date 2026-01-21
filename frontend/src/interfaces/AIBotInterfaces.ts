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
import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatStore {
  // UI State
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleChat: () => void;

  // Messages
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;

  // Loading State
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  // Error State
  error: string | null;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // UI State
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  // Loading State
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  // Error State
  error: null,
  setError: (error) => set({ error }),
}));

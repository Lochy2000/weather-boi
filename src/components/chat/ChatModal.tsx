import React, { useEffect, useRef } from 'react';
import { X, Trash2, Loader2 } from 'lucide-react';
import { useChatStore } from '../../stores/chat.store';
import { useAppStore } from '../../stores/app.store';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { sendChatMessage, generateWelcomeMessage } from '../../lib/api/services/gemini';
import { WeatherData } from '../../types';

interface ChatModalProps {
  weatherData?: WeatherData;
}

export const ChatModal: React.FC<ChatModalProps> = ({ weatherData }) => {
  const { isOpen, setIsOpen, messages, addMessage, clearMessages, isLoading, setIsLoading, error, setError } = useChatStore();
  const { currentLocation } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasShownWelcome = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show welcome message when chat is opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0 && !hasShownWelcome.current) {
      const welcomeMsg = generateWelcomeMessage({
        location: currentLocation || undefined,
        weatherData,
      });
      addMessage({
        role: 'assistant',
        content: welcomeMsg,
      });
      hasShownWelcome.current = true;
    }
  }, [isOpen, messages.length, currentLocation, weatherData]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    addMessage({
      role: 'user',
      content: message,
    });

    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role === 'user' ? ('user' as const) : ('model' as const),
        content: msg.content,
      }));

      // Send message with weather context
      const response = await sendChatMessage(
        message,
        {
          location: currentLocation || undefined,
          weatherData,
        },
        conversationHistory
      );

      // Add AI response
      addMessage({
        role: 'assistant',
        content: response,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI assistant';
      setError(errorMessage);
      addMessage({
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    clearMessages();
    hasShownWelcome.current = false;
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-2xl h-[600px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl flex flex-col pointer-events-auto animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300 dark:border-neutral-700">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                Weather Assistant
              </h2>
              {currentLocation && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {currentLocation.name}, {currentLocation.country}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-neutral-700 dark:bg-neutral-800 text-neutral-200">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex-1 max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 bg-neutral-200 dark:bg-neutral-800">
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Thinking...
                  </p>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            placeholder={
              currentLocation
                ? 'Ask about the weather...'
                : 'Search for a location first to get weather-specific advice'
            }
          />
        </div>
      </div>
    </>
  );
};

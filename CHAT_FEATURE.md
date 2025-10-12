# AI Weather Chat Assistant

## Overview

The weather app now includes an intelligent AI chat assistant powered by Google's Gemini AI. This assistant provides personalized weather advice, activity recommendations, and answers to weather-related questions based on real-time weather data.

## Features

### 🤖 Context-Aware AI Assistant
- Automatically aware of the current location you've searched
- Has access to current weather conditions, hourly forecasts, and daily forecasts
- Provides personalized recommendations based on real-time data

### 💬 Chat Interface
- **Chat Button**: Located in the bottom-left corner of the screen (blue circular button with message icon)
- **Modal Dialog**: Opens in the center of the screen when clicked
- **Clean Design**: Follows the app's existing design system with light/dark mode support
- **Message History**: Maintains conversation context throughout the session

### 🎯 Example Questions You Can Ask

1. **Clothing Advice**
   - "Should I wear a jacket this evening?"
   - "What should I wear today?"
   - "Do I need an umbrella?"

2. **Activity Planning**
   - "What sort of plans can I make for the weekend weather dependent if I am going to Brighton beach?"
   - "Is it a good day for outdoor activities?"
   - "When is the best time to go for a run?"

3. **Weather Insights**
   - "Will it rain today?"
   - "How's the UV index?"
   - "Is the temperature dropping tonight?"

## Implementation Details

### Architecture

#### Components
- **ChatButton** ([src/components/chat/ChatButton.tsx](src/components/chat/ChatButton.tsx)): Floating action button in bottom-left corner
- **ChatModal** ([src/components/chat/ChatModal.tsx](src/components/chat/ChatModal.tsx)): Main chat interface with weather context integration
- **ChatMessage** ([src/components/chat/ChatMessage.tsx](src/components/chat/ChatMessage.tsx)): Individual message component with user/assistant styling
- **ChatInput** ([src/components/chat/ChatInput.tsx](src/components/chat/ChatInput.tsx)): Auto-resizing textarea input with send button

#### State Management
- **chat.store.ts** ([src/stores/chat.store.ts](src/stores/chat.store.ts)): Zustand store managing:
  - Chat open/closed state
  - Message history
  - Loading states
  - Error handling

#### API Integration
- **gemini.ts** ([src/lib/api/services/gemini.ts](src/lib/api/services/gemini.ts)): Gemini AI service with:
  - Optimized model selection (gemini-1.5-flash for fast responses)
  - Weather context building
  - Conversation history management
  - Efficient API usage patterns

### AI Model Configuration

The chat uses **Gemini 1.5 Flash** model, which provides:
- ⚡ Fast response times
- 💰 Cost-effective API usage
- 🎯 High-quality conversational responses
- 📊 Context window for weather data and conversation history

Configuration parameters:
```typescript
{
  model: 'gemini-1.5-flash',
  temperature: 0.7,      // Balanced creativity
  topK: 40,              // Token sampling
  topP: 0.95,            // Nucleus sampling
  maxOutputTokens: 1024  // Response length limit
}
```

### Weather Context

The AI assistant receives comprehensive weather context:

**Location Data:**
- City name and country
- Coordinates and timezone

**Current Conditions:**
- Temperature and feels-like temperature
- Humidity percentage
- Wind speed and direction
- Precipitation levels
- UV index
- Cloud cover

**Forecasts:**
- Hourly forecast for next 24 hours
- Daily forecast for upcoming week
- Temperature highs and lows
- Precipitation probabilities

### Efficient API Usage

1. **Single Request Per Message**: Each user message sends one request to Gemini API
2. **Context Bundling**: All weather data and conversation history sent in a single context payload
3. **Smart Prompting**: System prompt includes relevant weather data to minimize follow-up questions
4. **No Streaming**: Simplified implementation without streaming for better reliability

## Setup Instructions

### 1. Environment Configuration

The API key is already configured in your [.env](.env) file:

```env
VITE_GEMINI_API_KEY=AIzaSyCBuk81dwxTMtDo-TdGndjh0jmdmZU_R1s
```

**Important**: In production, ensure this file is in `.gitignore` and never committed to version control.

### 2. Installation

The required package is already installed:
```bash
npm install @google/generative-ai
```

### 3. Running the App

```bash
npm run dev
```

The chat feature will be immediately available at the bottom-left corner of the app.

## User Experience

### First Time Use
1. User searches for a location
2. Weather data loads
3. User clicks the chat button (bottom-left corner)
4. Modal opens with a personalized welcome message
5. User can start asking questions

### Ongoing Conversation
- Chat maintains context throughout the session
- AI remembers previous messages in the conversation
- Weather context updates when user searches for a new location
- Users can clear chat history with the trash icon

### Design Features
- **Smooth Animations**: Fade-in and slide-in effects for messages
- **Auto-scroll**: Automatically scrolls to latest message
- **Responsive Input**: Textarea auto-expands with content (max 3 lines)
- **Loading States**: Shows "Thinking..." indicator while AI responds
- **Error Handling**: Displays clear error messages if something goes wrong
- **Accessibility**: Proper ARIA labels and keyboard navigation support

## UI/UX Design Decisions

### Color Scheme
- **User Messages**: Blue background (#4F46E5) matching the app's primary color
- **AI Messages**: Neutral gray background matching the app's theme
- **Icons**: Consistent with lucide-react icon set used throughout the app

### Typography
- Uses the app's existing font families (DM Sans and Bricolage Grotesque)
- Message text: 14px (0.875rem) for readability
- Timestamps: 12px (0.75rem) for subtle presence

### Positioning
- **Chat Button**: Bottom-left corner (6rem margin) to avoid interfering with main content
- **Modal**: Center of screen with backdrop overlay for focus
- **Fixed Size**: 600px height, max-width 768px for optimal conversation view

### Interactions
- **Hover Effects**: Button scales to 110% on hover
- **Focus States**: Clear focus rings for accessibility
- **Click Outside**: Modal closes when clicking backdrop
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

## Troubleshooting

### API Key Issues
If you see "API key is not configured" error:
1. Check that `.env` file exists in the project root
2. Verify `VITE_GEMINI_API_KEY` is set correctly
3. Restart the development server (`npm run dev`)

### No Weather Context
If AI doesn't seem aware of weather:
1. Ensure you've searched for a location first
2. Wait for weather data to fully load
3. Check browser console for any errors

### Chat Button Not Visible
1. Check if there are any z-index conflicts
2. Verify the button is not hidden behind other elements
3. Try refreshing the page

## Future Enhancements

Potential improvements for the chat feature:

1. **Persistent Chat History**: Save conversations to localStorage
2. **Voice Input**: Add speech-to-text for hands-free interaction
3. **Quick Actions**: Preset buttons for common questions
4. **Rich Responses**: Add weather icons and charts in AI responses
5. **Multi-language Support**: Detect and respond in user's language
6. **Notification Suggestions**: AI recommends weather alerts
7. **Streaming Responses**: Show AI typing in real-time
8. **Export Chat**: Allow users to save or share conversations

## Technical Considerations

### Performance
- Lazy loading: Chat components only render when needed
- Memoization: Consider memoizing heavy computations
- Debouncing: Not needed as messages are user-triggered

### Security
- API key stored in environment variables
- No sensitive user data sent to AI
- Weather data is public information

### Accessibility
- Keyboard navigation fully supported
- Screen reader friendly with ARIA labels
- High contrast ratios for text readability
- Focus management in modal

## License & Credits

- **AI Model**: Google Gemini 1.5 Flash
- **Icons**: Lucide React
- **State Management**: Zustand
- **Styling**: Tailwind CSS

---

Built with ❤️ for better weather planning!

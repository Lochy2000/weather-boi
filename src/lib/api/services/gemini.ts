import { GoogleGenerativeAI } from '@google/generative-ai';
import { Location, WeatherData } from '../../../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set in environment variables');
}

// Initialize Gemini AI with the most efficient model for chat
const genAI = new GoogleGenerativeAI(API_KEY);

// Use gemini-2.5-flash for chat interactions
// This is the current generation model with best price/performance balance
// Gemini 1.x models (gemini-pro, gemini-1.5-flash) are now deprecated
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
});

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface WeatherContext {
  location?: Location;
  weatherData?: WeatherData;
  currentTemp?: number;
  condition?: string;
  todayHigh?: number;
  todayLow?: number;
  precipitation?: number;
  windSpeed?: number;
  humidity?: number;
}

/**
 * Build a context-aware system prompt for the weather assistant
 */
function buildSystemPrompt(context: WeatherContext): string {
  let prompt = `You are a helpful and friendly weather assistant expert. You provide advice about weather conditions, what to wear, and activity recommendations based on current and forecasted weather data.

Keep your responses concise, friendly, and practical. Use everyday language and avoid technical jargon unless asked.`;

  if (context.location) {
    prompt += `\n\nCurrent location: ${context.location.name}`;
    if (context.location.country) {
      prompt += `, ${context.location.country}`;
    }
  }

  if (context.weatherData && context.weatherData.current) {
    const current = context.weatherData.current;
    prompt += `\n\nCurrent weather conditions:`;
    prompt += `\n- Temperature: ${current.temperature_2m}°${context.weatherData.current_units?.temperature_2m || 'C'}`;
    prompt += `\n- Feels like: ${current.apparent_temperature}°${context.weatherData.current_units?.apparent_temperature || 'C'}`;
    prompt += `\n- Humidity: ${current.relative_humidity_2m}%`;
    prompt += `\n- Wind: ${current.wind_speed_10m} ${context.weatherData.current_units?.wind_speed_10m || 'km/h'}`;
    prompt += `\n- Precipitation: ${current.precipitation} ${context.weatherData.current_units?.precipitation || 'mm'}`;

    if (current.uv_index !== undefined) {
      prompt += `\n- UV Index: ${current.uv_index}`;
    }
  }

  if (context.weatherData && context.weatherData.daily) {
    const daily = context.weatherData.daily;
    prompt += `\n\nToday's forecast:`;
    prompt += `\n- High: ${daily.temperature_2m_max[0]}°, Low: ${daily.temperature_2m_min[0]}°`;
    prompt += `\n- Precipitation probability: ${daily.precipitation_probability_max[0]}%`;

    if (daily.time.length > 1) {
      prompt += `\n\nUpcoming days:`;
      for (let i = 1; i < Math.min(3, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        prompt += `\n- ${dayName}: High ${daily.temperature_2m_max[i]}°, Low ${daily.temperature_2m_min[i]}°, Precipitation: ${daily.precipitation_probability_max[i]}%`;
      }
    }
  }

  prompt += `\n\nUse this weather information to provide helpful, context-aware advice. When users ask about specific activities, times, or plans, reference the relevant weather data to give practical recommendations.`;

  return prompt;
}

/**
 * Send a message to the Gemini AI and get a response
 * This function is optimized for efficient API usage with streaming disabled for simplicity
 */
export async function sendChatMessage(
  message: string,
  context: WeatherContext,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    const systemPrompt = buildSystemPrompt(context);

    // Start a chat session with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I\'m ready to help with weather-related questions and advice based on the current conditions and forecast.' }],
        },
        // Add conversation history
        ...conversationHistory.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        })),
      ],
    });

    // Send the message
    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error communicating with Gemini AI:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('API key issue. Please check your Gemini API configuration.');
      }
      throw new Error(`Failed to get AI response: ${error.message}`);
    }

    throw new Error('An unexpected error occurred while communicating with the AI assistant.');
  }
}

/**
 * Generate a welcome message based on current weather
 */
export function generateWelcomeMessage(context: WeatherContext): string {
  if (!context.location) {
    return "Hi! I'm your weather assistant. Search for a location to get started, and I'll help you with weather-related questions and advice!";
  }

  const location = context.location.name;
  let message = `Hi! I'm your weather assistant for ${location}. `;

  if (context.weatherData?.current) {
    const temp = Math.round(context.weatherData.current.temperature_2m);
    message += `It's currently ${temp}°. `;
  }

  message += `Ask me anything about the weather, what to wear, or activity recommendations!`;

  return message;
}

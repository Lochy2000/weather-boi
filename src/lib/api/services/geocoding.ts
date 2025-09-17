import { apiClient } from '../client';
import { API_CONFIG } from '../config';
import { Location } from '../../../types';

interface GeocodingResponse {
  results?: Location[];
  generationtime_ms: number;
}

export const geocodingService = {
  search: async (query: string, count = API_CONFIG.MAX_SEARCH_RESULTS): Promise<Location[]> => {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await apiClient.get<GeocodingResponse>(`${API_CONFIG.GEOCODING_BASE_URL}/search`, {
      params: { 
        name: query, 
        count, 
        language: 'en' 
      }
    });

    return response.data.results || [];
  }
};
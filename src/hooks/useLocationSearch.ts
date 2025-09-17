import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';
import { geocodingService } from '../lib/api/services/geocoding';
import { Location } from '../types';

export function useLocationSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  const { data: locations = [], isLoading, error } = useQuery<Location[]>({
    queryKey: ['locations', debouncedQuery],
    queryFn: () => geocodingService.search(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000, // 1 minute
  });

  const search = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    locations,
    isLoading,
    error,
    search,
    clearSearch,
    searchQuery,
  };
}
import { useState, useCallback, useRef, useEffect } from 'react';
import { cityApi } from '../services/api';
import { City, CitySearchState } from '../types';

export const useCitySearch = () => {
  const [state, setState] = useState<CitySearchState>({
    isLoading: false,
    query: '',
    results: [],
  });
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const searchCities = useCallback(async (query: string) => {
    if (query.length < 2) {
      setState(prev => ({
        ...prev,
        query,
        results: [],
        isLoading: false,
      }));
      return;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setState(prev => ({
      ...prev,
      query,
      isLoading: true,
      error: undefined,
    }));

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await cityApi.search(query);
        
        setState(prev => ({
          ...prev,
          results: response.data,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to search cities',
        }));
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const selectCity = useCallback((city: City) => {
    setState(prev => ({
      ...prev,
      selectedCity: city,
      query: city.name,
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedCity: undefined,
      query: '',
      results: [],
    }));
  }, []);

  const loadAllCities = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: undefined,
    }));

    try {
      const response = await cityApi.getAll();
      
      setState(prev => ({
        ...prev,
        results: response.data,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load cities',
      }));
    }
  }, []);

  return {
    ...state,
    searchCities,
    selectCity,
    clearSelection,
    loadAllCities,
  };
};

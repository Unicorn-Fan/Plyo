import { useState, useCallback, useRef } from 'react';
import { brokerApi } from '../services/api';
import { BrokerSearchState, City, BrokerOfficesResponse } from '../types';

export const useBrokerSearch = () => {
  const [state, setState] = useState<BrokerSearchState>({
    isLoading: false,
    results: [],
    showProximity: false,
  });
  
  const searchInProgressRef = useRef<string | null>(null);

  const searchBrokers = useCallback(async (city?: City, showProximity: boolean = false) => {
    const searchKey = `${city?.name || 'all'}-${showProximity}`;
    
    if (searchInProgressRef.current === searchKey) {
      return;
    }
    searchInProgressRef.current = searchKey;
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: undefined,
      showProximity,
    }));

    try {
      let response: BrokerOfficesResponse;
      
      if (showProximity && city?.latitude && city?.longitude) {
        response = await brokerApi.getProximity(
          city.name,
          city.latitude,
          city.longitude,
          3
        );
      } else if (city) {
        response = await brokerApi.getAll(city.name);
      } else {
        response = await brokerApi.getAll();
      }
      
      setState(prev => ({
        ...prev,
        city: city?.name,
        results: response.data,
        isLoading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to search brokers',
      }));
    } finally {
      searchInProgressRef.current = null;
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({
      isLoading: false,
      results: [],
      showProximity: false,
    });
  }, []);

  return {
    ...state,
    searchBrokers,
    clearResults,
  };
};

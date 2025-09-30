import axios, { AxiosResponse } from 'axios';
import {
  CreateLeadRequest,
  CreateLeadResponse,
  Lead,
  BrokerOfficesResponse,
  CitiesResponse,
  ApiResponse,
} from '@/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export const leadApi = {
  create: async (leadData: CreateLeadRequest): Promise<CreateLeadResponse> => {
    const response: AxiosResponse<CreateLeadResponse> = await api.post('/api/leads', leadData);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Lead>> => {
    const response: AxiosResponse<ApiResponse<Lead>> = await api.get(`/api/leads/${id}`);
    return response.data;
  },

  assignToBroker: async (leadId: string, brokerOfficeId: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.put(
      `/api/leads/${leadId}/assign`,
      { leadId, brokerOfficeId }
    );
    return response.data;
  },
};

export const brokerApi = {
  getAll: async (city?: string, latitude?: number, longitude?: number, limit?: number): Promise<BrokerOfficesResponse> => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (latitude) params.append('latitude', latitude.toString());
    if (longitude) params.append('longitude', longitude.toString());
    if (limit) params.append('limit', limit.toString());

    const response: AxiosResponse<BrokerOfficesResponse> = await api.get(`/api/brokers?${params}`);
    return response.data;
  },

  getProximity: async (city?: string, latitude?: number, longitude?: number, limit?: number): Promise<BrokerOfficesResponse> => {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (latitude) params.append('latitude', latitude.toString());
    if (longitude) params.append('longitude', longitude.toString());
    if (limit) params.append('limit', limit.toString());

    const response: AxiosResponse<BrokerOfficesResponse> = await api.get(`/api/brokers/proximity?${params}`);
    return response.data;
  },
};

export const cityApi = {
  getAll: async (): Promise<CitiesResponse> => {
    const response: AxiosResponse<CitiesResponse> = await api.get('/api/cities');
    return response.data;
  },

  search: async (query: string): Promise<CitiesResponse> => {
    if (query.length < 2) {
      return { success: true, data: [], count: 0 };
    }

    const response: AxiosResponse<CitiesResponse> = await api.get(`/api/cities/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getNorwegian: async (): Promise<CitiesResponse> => {
    const response: AxiosResponse<CitiesResponse> = await api.get('/api/cities/norwegian');
    return response.data;
  },
};

export default api;


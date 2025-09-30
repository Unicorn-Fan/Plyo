export interface Lead {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  city: string;
  comment?: string;
  status: LeadStatus;
  assignedBrokerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum LeadStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  CONTACTED = 'contacted',
  CLOSED = 'closed',
}

export interface CreateLeadRequest {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  city: string;
  comment?: string;
}

export interface CreateLeadResponse {
  success: boolean;
  message: string;
  leadId: string;
}

export interface BrokerOffice {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  emailAddress: string;
  city: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
}

export interface BrokerOfficesResponse {
  success: boolean;
  data: BrokerOffice[];
  count: number;
  message?: string;
}

export interface City {
  id: string;
  name: string;
  region: string;
  latitude?: number;
  longitude?: number;
}

export interface CitiesResponse {
  success: boolean;
  data: City[];
  count: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface CitySearchState extends LoadingState {
  query: string;
  results: City[];
  selectedCity?: City;
}

export interface BrokerSearchState extends LoadingState {
  city?: string;
  results: BrokerOffice[];
  showProximity: boolean;
}

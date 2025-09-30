import { useState, useCallback } from 'react';
import { leadApi } from '../services/api';
import { CreateLeadRequest, CreateLeadResponse } from '../types';

export const useLeadCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<CreateLeadResponse | undefined>();

  const submitLead = useCallback(async (leadData: CreateLeadRequest) => {
    setIsSubmitting(true);
    setError(undefined);
    setSuccess(undefined);

    try {
      const response = await leadApi.create(leadData);
      setSuccess(response);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit lead';
      setError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(undefined);
    setSuccess(undefined);
    setIsSubmitting(false);
  }, []);

  return {
    submitLead,
    isSubmitting,
    error,
    success,
    reset,
  };
};

import { useState, useEffect } from 'react';

interface RateLimitState {
  requests: number;
  lastReset: number;
}

export function useRateLimit(limitPerHour: number) {
  const [state, setState] = useState<RateLimitState>(() => {
    const stored = localStorage.getItem('connectionRateLimit');
    return stored
      ? JSON.parse(stored)
      : { requests: 0, lastReset: Date.now() };
  });

  useEffect(() => {
    localStorage.setItem('connectionRateLimit', JSON.stringify(state));
  }, [state]);

  const checkAndIncrementLimit = (): boolean => {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    // Reset counter if an hour has passed
    if (now - state.lastReset >= hourInMs) {
      setState({ requests: 1, lastReset: now });
      return true;
    }
    
    // Check if we're still within limit
    if (state.requests >= limitPerHour) {
      return false;
    }
    
    // Increment counter
    setState(prev => ({
      ...prev,
      requests: prev.requests + 1
    }));
    return true;
  };

  const getRemainingRequests = (): number => {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    if (now - state.lastReset >= hourInMs) {
      return limitPerHour;
    }
    
    return limitPerHour - state.requests;
  };

  const getTimeUntilReset = (): number => {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    return Math.max(0, hourInMs - (now - state.lastReset));
  };

  return {
    checkAndIncrementLimit,
    getRemainingRequests,
    getTimeUntilReset
  };
}
'use client';
import { useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { api, ApiResponse } from '../../../lib/axios-config';
import { useDebounce } from './hooks/useDebounce';
import { ConnectionCard } from './components/ConnectionCard';
import { PendingRequests } from './components/PendingRequests';
import { NetworkFilters } from './components/NetworkFilters';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SuggestionsResponse, FetchRequestResponse } from './types/network';
import {  useAppSelector, RootState } from "../../../store/store";
import { useRateLimit } from './hooks/useRateLimit';
import { toast } from 'sonner';
import { InfiniteData } from '@tanstack/react-query';

export default function NetworkPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  // Fetch suggestions query
  const {
    data: suggestionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<SuggestionsResponse, Error>({
    queryKey: ['suggestions', debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<SuggestionsResponse>(
        `/api/users/network/suggestions/${user?._id}/?page=${pageParam}&search=${debouncedSearch}`
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  // Fetch requests query
  const { data: requestsData } = useInfiniteQuery<FetchRequestResponse, Error>({
    queryKey: ['requests'],
    queryFn: async () => {
      const response = await api.get<FetchRequestResponse>(
        `/api/users/network/pending-requests/${user?._id}`
      );
      return response.data;
    },
    getNextPageParam: () => undefined,
    initialPageParam: 1,
  });

  const rateLimiter = useRateLimit(1);

  // Connection request mutation
  const connectMutation = useMutation({
    mutationFn: async (RequserId: string) => {
      if (!rateLimiter.checkAndIncrementLimit()) {
        const timeUntilReset = rateLimiter.getTimeUntilReset();
        const minutesUntilReset = Math.ceil(timeUntilReset / (60 * 1000));
        throw new Error(
          `You've reached your connection limit. Please try again in ${minutesUntilReset} minutes.`
        );
      }
      
      const response = await api.post<ApiResponse<void>>(
        `/api/users/network/connect/${user?._id}`, 
        { RequserId }
      );
      return response;
    },
    onSuccess: (_, RequserId) => {
      // Update local data to mark connection as pending
      queryClient.setQueryData(['suggestions', debouncedSearch], (oldData: InfiniteData<SuggestionsResponse> | undefined) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            suggestions: page.suggestions.map(suggestion => 
              suggestion._id === RequserId 
                ? { ...suggestion, connectionStatus: 'pending' } 
                : suggestion
            )
          }))
        };
      });

      const remaining = rateLimiter.getRemainingRequests();
      toast("Connection request sent successfully", {
        description: remaining === 0 
          ? "You've reached your hourly connection limit."
          : `You can send ${remaining} more connection${remaining === 1 ? '' : 's'} this hour.`
      });
    },
    onError: (error: Error) => {
      console.error(error);
      toast("Unable to send connection request", {
        description: error.message
      });
    }
  });

  // Handle request mutation
  const requestMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) =>
      api.post<ApiResponse<void>>(`/api/users/network/handle-request/${user?._id}`, { requestId, action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  // Infinite scroll effect
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Extract requests from response
  const requests = requestsData?.pages[0]?.requests ?? [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <NetworkFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={() => {}} 
      />

      <PendingRequests
        requests={requests}
        onAccept={(requestId) => requestMutation.mutate({ requestId, action: 'accept' })}
        onReject={(requestId) => requestMutation.mutate({ requestId, action: 'reject' })}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestionsData?.pages.map((page) =>
            page.suggestions.map((suggestion) => (
              <ConnectionCard
                key={suggestion._id}
                user={suggestion}
                onConnect={(userId) => connectMutation.mutate(userId)}
              />
            ))
          )}
        </div>

        <div ref={ref} className="h-10 mt-4">
          {isFetchingNextPage && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
}
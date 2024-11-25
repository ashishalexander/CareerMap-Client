'use client';

import { useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { api, ApiResponse } from '../../../lib/axios-config'; // Update this import path as needed
import { useDebounce } from './hooks/useDebounce';
import { ConnectionCard } from './components/ConnectionCard';
import { PendingRequests } from './components/PendingRequests';
import { NetworkFilters } from './components/NetworkFilters';
import { LoadingSpinner } from './components/LoadingSpinner';
import { User, ConnectionRequest } from './types/network';
import { useAppDispatch, useAppSelector, RootState } from "../../../store/store";


interface SuggestionsResponse {
  data: User[];
  nextPage: number | null;
}

export default function NetworkPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  // Fetch suggestions
  const {
    data: suggestionsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<SuggestionsResponse, Error>({
    queryKey: ['suggestions', debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ApiResponse<SuggestionsResponse>>(`/api/network/suggestions?page=${pageParam}&search=${debouncedSearch}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  // Fetch requests
  const { data: requestsData } = useInfiniteQuery<ApiResponse<ConnectionRequest[]>, Error>({
    queryKey: ['requests'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<ApiResponse<ConnectionRequest[]>>(`/api/users/network/pending-requests/${user?._id}`);
      return response;
    },
    getNextPageParam: () => undefined, // Only one page of requests
    initialPageParam: 1,
  });

  // Connect mutation
  const connectMutation = useMutation({
    mutationFn: (userId: string) => api.post<ApiResponse<void>>('/api/network/connect', { userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
    },
  });

  // Handle request mutation
  const requestMutation = useMutation({
    mutationFn: ({ requestId, action }: { requestId: string; action: 'accept' | 'reject' }) =>
      api.post<ApiResponse<void>>('/api/network/handle-request', { requestId, action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  // Infinite scroll
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const suggestions = suggestionsData?.pages.flatMap(page => page.data) ?? [];
  const requests = requestsData?.pages[0]?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* <h1 className="text-3xl font-bold mb-6">Your Network</h1> */}

      <NetworkFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilterChange={() => {}} // Implement filter logic
      />

      <PendingRequests
        requests={requests}
        onAccept={(requestId) => requestMutation.mutate({ requestId, action: 'accept' })}
        onReject={(requestId) => requestMutation.mutate({ requestId, action: 'reject' })}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((user) => (
            <ConnectionCard
              key={user.id}
              user={user}
              onConnect={() => connectMutation.mutate(user.id)}
              onIgnore={() => {}} // Implement ignore logic
            />
          ))}
        </div>

        <div ref={ref} className="h-10 mt-4">
          {isFetchingNextPage && <LoadingSpinner />}
        </div>
      </div>
    </div>
  );
}


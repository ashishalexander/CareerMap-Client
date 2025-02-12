'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NetworkPageClient from './NetworkPageClient';

const queryClient = new QueryClient();

export default function NetworkPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkPageClient />
    </QueryClientProvider>
  );
}


"use client"
import { JobApplicationsList } from './components/JobApplicationList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ApplicationsPage() {
  return (
    <QueryClientProvider client={queryClient}>
        <div className="container mx-auto py-8">
            <JobApplicationsList />
        </div>
    </QueryClientProvider>
    
  );
}
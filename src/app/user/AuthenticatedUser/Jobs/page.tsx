'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobList } from './components/Job-list';
import { JobDetails } from './components/job-details';
import { Job } from './Types/Job';

const queryClient = new QueryClient();

export default function JobListingPage() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen">
        <JobList 
          onJobSelect={(job) => setSelectedJob(job)}
          selectedJobId={selectedJob?.id}
        />

        <div className="w-2/3 p-6">
          {selectedJob ? (
            <JobDetails job={selectedJob} />
          ) : (
            <div className="text-center text-gray-500">
              Select a job to view details
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

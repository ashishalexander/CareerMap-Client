'use client';

import React, { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Job } from '../Types/Job';

interface JobListProps {
  onJobSelect: (job: Job) => void;
  selectedJobId?: number;
}

export function JobList({ onJobSelect, selectedJobId }: JobListProps) {
  const fetchJobs = async ({ pageParam = 1 }) => {
    const response = await axios.get('/api/jobs', {
      params: { 
        page: pageParam, 
        limit: 10 
      },
    });
    return response.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1, // Fix the missing parameter.
  });

  const jobs = data?.pages.flatMap((page) => page.jobs) || [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const bottom = scrollContainerRef.current.scrollHeight === scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight;
      if (bottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <div className="w-1/3 border-r p-4 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      <div
        ref={scrollContainerRef}
        className="h-[calc(100vh-100px)] overflow-y-auto"
        onScroll={handleScroll}
      >
        {status === 'pending' ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`cursor-pointer p-3 hover:bg-gray-100 
                ${selectedJobId === job.id ? 'bg-blue-50' : ''} 
                transition-colors duration-200
              `}
              onClick={() => onJobSelect(job)}
            >
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <Separator className="my-2" />
            </div>
          ))
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

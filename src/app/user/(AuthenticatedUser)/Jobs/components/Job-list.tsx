'use client';

import React, { useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { IJob } from '../Types/Job';
import { useAppSelector } from '@/app/store/store';
import api from '../../../../lib/axios-config';

interface JobListProps {
  onJobSelect: (job: IJob) => void;
  selectedJobId?: string;  // Change to string as _id is a string
}

export function JobList({ onJobSelect, selectedJobId }: JobListProps) {
  const userId = useAppSelector((state) => state.auth.user?._id);

  const fetchJobs = async ({ pageParam = 1 }) => {
    const response = await api.get(`/api/users/jobs/${userId}`, {
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
    queryKey: ['jobs', userId],
    queryFn: fetchJobs,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
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
              key={job._id}  // Use _id here
              className={`cursor-pointer p-3 hover:bg-gray-100 
                ${selectedJobId === job._id ? 'bg-blue-50' : ''} 
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

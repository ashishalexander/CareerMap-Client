"use client"
import { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeleton: FC = () => (
  <div className="bg-white shadow rounded-lg max-w-4xl mx-auto border border-gray-200">
    <Skeleton className="h-48 w-full rounded-t-lg" />
    <div className="px-8 pb-8">
      <div className="flex items-start gap-4 pt-8">
        <div className="relative">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <div className="flex gap-4 mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  </div>
);
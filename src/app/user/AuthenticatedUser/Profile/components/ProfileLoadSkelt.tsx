import { FC } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeleton: FC = () => {
  return (
    <div className="bg-[#F3F2EF] min-h-screen py-8">
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto border border-[#E5E5E5]">
        {/* Banner Skeleton */}
        <div className="relative">
          <Skeleton className="w-full h-60 rounded-t-lg" />
          
          {/* Avatar Skeleton - Positioned absolutely like the real avatar */}
          <div className="absolute -bottom-16 left-8">
            <Skeleton className="w-32 h-32 rounded-full border-4 border-white" />
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            {/* Left side - Profile Info */}
            <div className="flex-1">
              {/* Name */}
              <Skeleton className="h-8 w-64 mb-2" />
              
              {/* Headline */}
              <Skeleton className="h-5 w-96 mb-4" />
              
              {/* Location, Company, Website */}
              <div className="flex flex-wrap gap-4 mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-36" />
              </div>
              
              {/* Connections */}
              <Skeleton className="h-5 w-28" />
            </div>

            {/* Right side - Actions */}
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>

          {/* About Section */}
          <div className="mt-8">
            <Skeleton className="h-7 w-32 mb-4" /> {/* "About" heading */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Additional Sections */}
          <div className="mt-8">
            <Skeleton className="h-7 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>

          {/* Activity Section */}
          <div className="mt-8">
            <Skeleton className="h-7 w-36 mb-4" />
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  );
};

// Optional smaller skeletons for specific sections
export const ProfileInfoSkeleton: FC = () => (
  <div className="flex-1">
    <Skeleton className="h-8 w-64 mb-2" />
    <Skeleton className="h-5 w-96 mb-4" />
    <div className="flex gap-4 mb-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-5 w-40" />
    </div>
  </div>
);

export const ProfileActionsSkeleton: FC = () => (
  <div className="flex gap-2">
    <Skeleton className="h-10 w-28" />
    <Skeleton className="h-10 w-28" />
    <Skeleton className="h-10 w-28" />
  </div>
);

export const AboutSectionSkeleton: FC = () => (
  <div className="mt-8">
    <Skeleton className="h-7 w-32 mb-4" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);
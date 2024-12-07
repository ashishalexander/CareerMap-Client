"use client"
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {CreatePost} from './components/PostCreation';
import {PostFeed} from './components/PostCard';
import { IPost } from '@/const/Ipost';
import { UserProfile } from './components/profile';
import { RootState } from '@/app/store/store';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { Iuser } from '@/const/Iuser';

// Create QueryClient outside the component
const queryClient = new QueryClient();

const HomePage: React.FC<{ user: Iuser }> = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state: RootState) => state.auth.user)
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="grid grid-cols-3 gap-6">
            {user ? (
              <div className="col-span-1">
                <UserProfile user={user} />
              </div>
            ) : (
              <div className="col-span-1"> 
                <p>Loading user data...</p>
              </div>
            )}
            {/* Main Feed */}
            <div className="col-span-2">
              <CreatePost />
              <PostFeed />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default HomePage;
"use client"
import React from 'react';
import {CreatePost} from './components/PostCreation';
import {PostCard} from './components/PostCard';
import { Ipost } from '@/const/Ipost';
import { IJob } from '@/const/Ijobs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Iuser } from '@/const/Iuser';
import { UserProfile } from './components/profile';
import { RootState } from '@/app/store/store';
import { useAppDispatch,useAppSelector } from '@/app/store/store';

const samplePost: Ipost={
  id: '1',
  author: {
    _id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    profile: {
      profilePicture: 'https://via.placeholder.com/40x40.png/cccccc/000000?Text=User',
      headline: 'Software Developer at XYZ Corp',
      location: 'San Francisco, CA',
      company: 'XYZ Corp',
      bannerImage: '/api/placeholder/800/200',
      about: 'Passionate developer with experience in full-stack development.',
    },
    role: 'user',
    mobile: '',
    password: '',
    __v: 0,
    isblocked: false
  },
  content: 'This is a sample post content for testing purposes.',
  mediaUrls: [
    { url: 'https://via.placeholder.com/600x800.png/a59090/000000?Text=600x800', type: 'image' },
  ],
  likes: [{ userId: '456', likedAt: new Date() }],
  shares: [],
  comments: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};


const HomePage: React.FC<{ user: Iuser; posts: Ipost[] }> = ({  posts=[samplePost] }) => {
  const dispatch = useAppDispatch()

  const user = useAppSelector((state: RootState) => state.auth.user)
  return (
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
            <CreatePost onPostCreate={(post) => console.log('Post created:', post)} />
            {posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
// app/profile/[userId]/page.tsx
"use client";
import { FC, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/app/lib/axios-config';
import { Building2, MapPin, Link as LinkIcon } from 'lucide-react';

// Interfaces based on your MongoDB models
interface IExperience {
  title: string;
  employmentType: string;
  company: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
}

interface IEducation {
  school: string;
  degree: string;
  startDate: Date;
  endDate: Date;
  skills: string[];
}

interface IMedia {
  type: 'image';
  url: string;
  description: string;
}

interface IPost {
  _id: string;
  author: string;
  text?: string;
  media?: IMedia[];
  likes: {
    userId: string;
    createdAt: Date;
  }[];
  comments: {
    user: string;
    content: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: {
    profilePicture?: string;
    bannerImage?: string;
    about?: string;
    headline?: string;
    location?: string;
    company?: string;
    website?: string;
    connections?: number;
    Education?: IEducation[];
    Experience?: IExperience[];
  };
  posts?: IPost[];
}

interface UserProfileViewProps {
  params: {
    userId: string;
  };
}

const UserProfileView: FC<UserProfileViewProps> = ({ params }) => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const userResponse = await api.get(`/api/users/profile/${params.userId}`);
        // Fetch user's posts separately
        const postsResponse = await api.get(`/api/users/posts/${params.userId}`);
        
        // Combine the data
        setUserData({
          ...userResponse.data,
          posts: postsResponse.data
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.userId]);

  if (loading) {
    return <div className="bg-[#F3F2EF] min-h-screen py-8">Loading...</div>;
  }

  if (!userData) {
    return (
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto p-8 text-center text-gray-600">
        Profile not found
      </div>
    );
  }

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-[#F3F2EF] min-h-screen py-8">
      {/* Profile Header */}
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto border border-[#E5E5E5]">
        <div className="relative">
          {/* Banner */}
          <div className="w-full h-60">
            {userData.profile?.bannerImage ? (
              <img
                src={userData.profile.bannerImage}
                alt="Profile Banner"
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg" />
            )}
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-16 left-8">
            <img
              src={userData.profile?.profilePicture || "/placeholder-avatar.png"}
              alt="profile pic"
              className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8">
          <div>
            <h1 className="text-2xl font-bold">{userData.firstName} {userData.lastName}</h1>
            <p className="text-gray-600 mt-1">{userData.profile?.headline}</p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-gray-500">
              {userData.profile?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userData.profile.location}</span>
                </div>
              )}
              
              {userData.profile?.company && (
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{userData.profile.company}</span>
                </div>
              )}

              {userData.profile?.website && (
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <a 
                    href={userData.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {new URL(userData.profile.website).hostname}
                  </a>
                </div>
              )}
            </div>

            {userData.profile?.connections !== undefined && (
              <div className="mt-3 text-gray-600">
                <span className="font-medium">{userData.profile.connections.toLocaleString()}</span>
                {' connections'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-600">{userData.profile?.about || 'No information available'}</p>
      </div>

      {/* Experience Section */}
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userData.profile?.Experience?.map((experience, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">{experience.title}</h3>
              <p className="text-gray-600">{experience.company}</p>
              <p className="text-sm text-gray-500">
                {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
              </p>
              <p className="text-sm text-gray-500">{experience.location}</p>
              <p className="text-sm text-gray-600 mt-2">{experience.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className="max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userData.profile?.Education?.map((education, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg">{education.school}</h3>
              <p className="text-gray-600">{education.degree}</p>
              <p className="text-sm text-gray-500">
                {formatDate(education.startDate)} - {formatDate(education.endDate)}
              </p>
              {education.skills && education.skills.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Skills</p>
                  <p className="text-sm text-gray-600">{education.skills.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Posts Section */}
      <Card className="max-w-4xl mx-auto mt-8 mb-8">
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userData.posts?.map((post) => (
            <div key={post._id} className="p-4 border rounded-lg">
              <p className="text-gray-700">{post.text}</p>
              {post.media && post.media.length > 0 && (
                <div className="mt-4">
                  {post.media.map((media, index) => (
                    <img
                      key={index}
                      src={media.url}
                      alt={media.description}
                      className="max-w-full h-auto rounded-lg"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center mt-3 space-x-4 text-gray-600">
                <span>{post.likes?.length || 0} Likes</span>
                <span>{post.comments?.length || 0} Comments</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileView;
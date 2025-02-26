"use client";
import { FC } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store'; // Import custom hooks
import { ProfileBanner } from './components/ProfileBanner';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileInfo } from './components/ProfileInfo';
import { AboutSection } from './components/AboutSession';
import { ActivitySkeleton, JobPostingSkeleton, ProfileSkeleton } from './components/ProfileLoadSkelt';
import type { RootState } from '../../../store/store';
import type { Iuser } from '../../../../const/Iuser';
import api from '../../../lib/axios-config'
import { updateUserBannerUrl,updateUserProfileAbout,updateUserProfileInfo,updateUserProfilePicture } from '@/app/store/slices/authSlice';
import React from 'react';
import EducationProfileComponent from './components/Education';
import ExperienceProfileComponent from './components/Experience';
import dynamic from 'next/dynamic';


const ActivityProfileComponent = dynamic(
  () => import('./components/Activity'),
  {
    loading: () => <ActivitySkeleton />,
    ssr: false
  }
);

const RecruiterJobComponent = dynamic(
  () => import('./components/RecuriterJob'),
  {
    loading: () => <JobPostingSkeleton />,
    ssr: false
  }
);

const ProfileSection: FC = () => {
  const dispatch = useAppDispatch(); // Use custom useAppDispatch hook
  const currentUser = useAppSelector((state: RootState) => state.auth.user); // Accessing profile from profileSlice
  const isOwnProfile = true;
  if (!currentUser) {
    return <ProfileSkeleton />;
  }
  const handleProfileUpdate = async (updateData: Partial<Iuser>) => {
    try {
      const response = await api.post<Iuser>(`/api/users/profile/info/${currentUser?._id}`,updateData)
      if(response&&response.data){
        dispatch(updateUserProfileInfo(response.data)); // Update profile using thunk

      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleProfileAbout = async (aboutData: string) => { // Changed to `string`
    try {
      const response = await api.post<Iuser>(`/api/users/profile/about/${currentUser?._id}`, { about: aboutData });
      console.log(response.data);
      dispatch(updateUserProfileAbout(response.data))
    } catch (error) {
      console.error('Failed to update profile about section:', error);
      // Error handling here
    }
  };

  const handleBannerUpdate = async (file: File) => {
    const formData = new FormData()
    formData.append('file',file)
    try {
          const response = await api.post<string>(`/api/users/upload-profile-banner/${currentUser?._id}`,formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
      const imageUrl = response.data
      dispatch(updateUserBannerUrl(imageUrl))
    } catch (error) {
      console.error('Failed to update banner:', error);
    }
  };

  const handleAvatarUpdate = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post(
        `/api/users/upload-profile-avatar/${currentUser?._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const imageUrl = response.data as string;
      dispatch(updateUserProfilePicture(imageUrl));
    } catch (error) {
      console.error('Failed to update profile picture:', error);
    }
  };

 

  return (
    <div className="bg-[#F3F2EF] min-h-screen py-8">
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto border border-[#E5E5E5]">
        <div className="relative">
          <ProfileBanner 
            bannerUrl={currentUser.profile?.bannerImage}
            isOwnProfile={isOwnProfile}
            onBannerUpdate={(file:File) => {
                 handleBannerUpdate(file ); 
            }}
          />
          <ProfileAvatar 
            image={currentUser.profile?.profilePicture}
            isOwnProfile={isOwnProfile}
            onAvatarUpdate={handleAvatarUpdate}
          />
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <ProfileInfo 
              user={currentUser}
              isOwnProfile={isOwnProfile}
              onUpdate={handleProfileUpdate}
            />
          </div>

        </div>
      </div>
      

       {/* About Section */}
       <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
       <AboutSection 
            about={currentUser.profile?.about}
            isOwnProfile={isOwnProfile}
            onUpdate={(about) => handleProfileAbout(about)} // Update about section
          />      
        </div>
       

      {/* Education Section */}
        <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
          <EducationProfileComponent isOwnProfile={isOwnProfile} educations={currentUser.profile.Education} />
        </div>

       {/* Experience Section */}
        <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
          <ExperienceProfileComponent isOwnProfile={isOwnProfile} experiences={currentUser.profile.Experience} />
        </div>

      {/* Activity Section */}
        <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
          <ActivityProfileComponent isOwnProfile={isOwnProfile} />
        </div>

      {/* Recruiter Job Section - Conditionally Rendered */}
      {currentUser?.role === 'recruiter' && (
          <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
            <RecruiterJobComponent isOwnProfile={isOwnProfile} />
          </div>
      )}
    </div>

    
  );
};
export default ProfileSection;

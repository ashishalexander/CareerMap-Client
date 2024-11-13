"use client";
import { FC, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/store'; // Import custom hooks
import { ProfileBanner } from './components/ProfileBanner';
import { ProfileAvatar } from './components/ProfileAvatar';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileActions } from './components/ProfileActions';
import { AboutSection } from './components/AboutSession';
import { ProfileSkeleton } from './components/ProfileLoadSkelt';
import type { RootState } from '../../../store/store';
import type { Iuser } from '../../../../const/Iuser';
import EducationProfileComponent from './components/Education'
import ExperienceProfileComponent from './components/Experience';
import ProjectProfileComponent from './components/Project'
import api from '../../../lib/axios-config'
import { updateUserBannerUrl } from '@/app/store/slices/authSlice';
interface ProfileSectionProps {
  userId?: string | null;
}

const ProfileSection: FC<ProfileSectionProps> = ({ userId = null }) => {
  const dispatch = useAppDispatch(); // Use custom useAppDispatch hook
  const currentUser = useAppSelector((state: RootState) => state.auth.user); // Accessing profile from profileSlice
  console.log(JSON.stringify(currentUser))
  
  const isOwnProfile: boolean = userId === null || (currentUser !== null && userId === currentUser._id);
  console.log(isOwnProfile+'🤷‍♂️')

  const handleProfileUpdate = async (updateData: Partial<Iuser>) => {
    try {
      // await dispatch(updateProfile(updateData)).unwrap(); // Update profile using thunk
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  const handleBannerUpdate = async (file: File) => {
    const formData = new FormData()
    formData.append('file',file)
    try {
          const response = await api.post(`/api/users/upload-profile-banner/${currentUser?._id}`,formData,
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

  
  // if (loading) {
  //   return <ProfileSkeleton />;
  // }

  if (!currentUser) {
    return (
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto p-8 text-center text-gray-600">
        Profile not found
      </div>
    );
  }

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
            onAvatarUpdate={(file) => {
              // Implement file upload logic and call handleProfileUpdate
              //  handleBannerUpdate({profile:{ profilePicture: file }}); // Example call
            }}
          />
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <ProfileInfo 
              user={currentUser}
              isOwnProfile={isOwnProfile}
              onUpdate={handleProfileUpdate}
            />
            <ProfileActions 
              isOwnProfile={isOwnProfile}
              onShare={() => {
                // Implement share functionality
              }}
              onConnect={() => {
                // Implement connect functionality
              }}
              onMessage={() => {
                // Implement message functionality
              }}
            />
          </div>

        </div>
      </div>

       {/* About Section */}
       <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
       <AboutSection 
            about={currentUser.profile?.about}
            isOwnProfile={isOwnProfile}
            onUpdate={(about) => handleProfileUpdate({profile:{ about }})} // Update about section
          />      </div>

      {/* Education Section */}
      <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
        <EducationProfileComponent isOwnProfile={isOwnProfile} />
      </div>

       {/* Experience Section */}
       <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
        <ExperienceProfileComponent isOwnProfile={isOwnProfile} />
      </div>

       {/* Project Section */}
       <div className="bg-white shadow rounded-lg max-w-4xl mx-auto mt-8 p-8 border border-[#E5E5E5]">
        <ProjectProfileComponent isOwnProfile={isOwnProfile} />
      </div>
    </div>

    
  );
};
export default ProfileSection;

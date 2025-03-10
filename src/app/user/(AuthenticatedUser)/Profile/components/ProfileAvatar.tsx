"use client"
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import Image from "next/image";

interface ProfileAvatarProps {
  image?: string;
  isOwnProfile: boolean;
  onAvatarUpdate?: (file: File) => void;
}

export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  image,
  isOwnProfile,
  onAvatarUpdate
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarUpdate) {
      onAvatarUpdate(file);
    }
  };

  return (
    <div className="absolute -bottom-16 left-8">
      <div className="relative">
        <Image
          src={image || "https://placehold.jp/120x120.png"}
          alt="profile pic"
          width={ 120}
          height={120}
          className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
        />
        {isOwnProfile && (
            <div className="absolute bottom-0 right-0">
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Button 
                variant="secondary" 
                size="sm"
                className="rounded-full bg-white hover:bg-gray-100"
                onClick={() => {
                  document.getElementById('avatar-upload')?.click();
                }}
              >
                <Camera className="h-4 w-4" />
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};
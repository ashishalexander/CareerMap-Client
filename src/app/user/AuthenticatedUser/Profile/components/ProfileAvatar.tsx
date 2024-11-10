import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

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
        <img
          src={image || "https://via.placeholder.com/150x150"}
          alt="profile pic"
          className="w-32 h-32 rounded-full border-4 border-white bg-white object-cover"
        />
        {isOwnProfile && (
          <label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-0 right-0 rounded-full bg-white hover:bg-gray-100"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </label>
        )}
      </div>
    </div>
  );
};
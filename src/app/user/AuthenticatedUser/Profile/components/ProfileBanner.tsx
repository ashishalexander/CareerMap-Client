import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfileBannerProps {
  bannerUrl?: string | null;
  isOwnProfile: boolean;
  isUploading?: boolean;
  onBannerUpdate?: (file: File) => void;
  onBannerRemove?: () => void;
}

export const ProfileBanner: FC<ProfileBannerProps> = ({
  bannerUrl,
  isOwnProfile,
  isUploading = false,
  onBannerUpdate,
  onBannerRemove
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onBannerUpdate) {
      onBannerUpdate(file);
    }
  };

  if (isUploading) {
    return (
      <Skeleton className="w-full h-60 rounded-t-lg" />
    );
  }

  return (
    <div className="relative w-full h-60">
      {bannerUrl ? (
        <img
          src={bannerUrl}
          alt="Profile Banner"
          className="w-full h-full object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-t-lg" />
      )}

      {isOwnProfile && (
        <div className="absolute top-4 right-4 flex gap-2">
          <label>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-white/90 hover:bg-white"
              disabled={isUploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {bannerUrl ? 'Change Banner' : 'Add Banner'}
            </Button>
          </label>

          {bannerUrl && onBannerRemove && (
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white"
              onClick={onBannerRemove}
              disabled={isUploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      )}

      {/* Optional overlay for hover effect */}
      {isOwnProfile && (
        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 rounded-t-lg" />
      )}
    </div>
  );
};

// Loading skeleton for the banner
export const ProfileBannerSkeleton: FC = () => {
  return (
    <Skeleton className="w-full h-60 rounded-t-lg" />
  );
};
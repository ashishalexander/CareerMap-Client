import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Share2, Download } from 'lucide-react';

interface ProfileActionsProps {
  isOwnProfile: boolean;
  onShare?: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
}

export const ProfileActions: FC<ProfileActionsProps> = ({
  isOwnProfile,
  onShare,
  onConnect,
  onMessage
}) => {
  if (isOwnProfile) {
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/10"
          onClick={() => {
            // Implement edit profile modal
          }}
        >
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/10"
          onClick={onShare}
        >
          <Share2 className="h-4 w-4" />
          Share Profile
        </Button>
        {/* <Button 
          variant="outline" 
          className="flex items-center gap-2 border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/10"
          onClick={() => {
            // Implement PDF export
          }}
        >
          <Download className="h-4 w-4" />
          Save as PDF
        </Button> */}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button 
        className="bg-[#0A66C2] hover:bg-[#004182]"
        onClick={onConnect}
      >
        Connect
      </Button>
      <Button 
        variant="outline" 
        className="border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/10"
        onClick={onMessage}
      >
        Message
      </Button>
      {/* <Button 
        variant="outline" 
        className="hover:bg-gray-100"
      >
        More
      </Button> */}
    </div>
  );
};
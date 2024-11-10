import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface AboutSectionProps {
  about?: string;
  isOwnProfile: boolean;
  onUpdate: (about: string) => void;
}

export const AboutSection: FC<AboutSectionProps> = ({
  about,
  isOwnProfile,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAbout, setEditedAbout] = useState(about || '');

  const handleSave = () => {
    onUpdate(editedAbout);
    setIsEditing(false);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-gray-900">
        About
        {isOwnProfile && !isEditing && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-gray-100"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </h2>
      
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editedAbout}
            onChange={(e) => setEditedAbout(e.target.value)}
            className="w-full p-2 border rounded-md min-h-[100px]"
            placeholder="Write something about yourself..."
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">
          {about || (isOwnProfile ? 'Add a summary about yourself' : 'No information available')}
        </p>
      )}
    </div>
  );
};
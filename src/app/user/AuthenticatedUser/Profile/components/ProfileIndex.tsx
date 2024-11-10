import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Building, MapPin } from 'lucide-react';

export interface User {
  _id: string;                 
  name: string;                
  title?: string;              
  company?: string;            
  location?: string;           
  connections?: number;        
}

interface ProfileInfoProps {
  user: User;
  isOwnProfile: boolean;
  onUpdate: (data: Partial<User>) => void;
}

export const ProfileInfo: FC<ProfileInfoProps> = ({ 
  user, 
  isOwnProfile,
  onUpdate 
}) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="hover:bg-gray-100"
            onClick={() => {
              // Implement edit modal/form
              const newTitle = prompt('Enter new title:');
              if (newTitle) onUpdate({ title: newTitle });
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-lg text-gray-600">{user.title || 'Add title'}</p>
      
      <div className="mt-2 flex items-center text-gray-600 space-x-4">
        {user.company && (
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1" />
            {user.company}
          </div>
        )}
        {user.location && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {user.location}
          </div>
        )}
      </div>
      
      <div className="mt-2">
        <Button 
          variant="link" 
          className="p-0 h-auto text-[#0A66C2] hover:text-[#004182] hover:underline"
        >
          {user.connections || 0} connections
        </Button>
      </div>
    </div>
  );
};
import { FC, useState } from 'react';
import { Edit2, MapPin, Building2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Iuser } from '@/const/Iuser';



interface ProfileInfoProps {
  user: Iuser;
  isOwnProfile: boolean;
  onUpdate: (data: any) => Promise<void>;
}

export const ProfileInfo: FC<ProfileInfoProps> = ({
  user,
  isOwnProfile,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName,
    headline: user.profile?.headline || '',
    location: user.profile?.location || '',
    company: user.profile?.company || '',
    website: user.profile?.website || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updateData: Partial<Iuser> = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        profile: {
          headline: formData.headline,
          location: formData.location,
          company: formData.company,
          website: formData.website,
        }
      };

      await onUpdate(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 truncate">
          {user.firstName+" "+user.lastName}
        </h1>
        {isOwnProfile && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gray-100"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile Information</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="FirstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="FirstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Textarea
                    id="headline"
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {user.profile?.headline && (
        <p className="text-gray-600 mt-1 text-lg">
          {user.profile.headline}
        </p>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-gray-500">
        {user.profile?.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{user.profile?.location}</span>
          </div>
        )}
        
        {user.profile?.company && (
          <div className="flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            <span>{user.profile?.company}</span>
          </div>
        )}

        {user.profile?.website && (
          <div className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            <a 
              href={user.profile?.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {new URL(user.profile?.website).hostname}
            </a>
          </div>
        )}
      </div>

      {user.profile?.connections !== undefined && (
        <div className="mt-3 text-gray-600">
          <span className="font-medium">{user.profile?.connections.toLocaleString()}</span>
          {' connections'}
        </div>
      )}
    </div>
  );
};
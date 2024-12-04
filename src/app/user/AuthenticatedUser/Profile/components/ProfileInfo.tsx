// File: ProfileInfo.tsx
import { FC, useEffect, useState } from 'react';
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
import { z } from 'zod';

// User Interface Definition
export interface Iuser {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  profile?: {
    headline?: string;
    location?: string;
    company?: string;
    website?: string;
    connections?: number;
  };
}

// Form Validation Schema
const ProfileSchema = z.object({
  firstName: z.string().trim().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().trim().min(2, { message: "Last name must be at least 2 characters" }),
  headline: z.string().trim().max(300, { message: "Headline must be 300 characters or less" }).optional(),
  company: z.string().trim().max(100, { message: "Company name must be 100 characters or less" }).optional(),
  location: z.string().trim().max(100, { message: "Location must be 100 characters or less" }),
  website: z.union([
    z.string().url({ message: "Invalid website URL" }),
    z.literal("")
  ]).optional().transform(value => value === "" ? undefined : value),
});

// Profile Info Component Props
interface ProfileInfoProps {
  user: Iuser;
  isOwnProfile: boolean;
  onUpdate: (data: Partial<Iuser>) => Promise<void>;
}

export const ProfileInfo: FC<ProfileInfoProps> = ({
  user,
  isOwnProfile,
  onUpdate
}) => {
  // Initial Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    headline: user.profile?.headline || '',
    location: user.profile?.location || '',
    company: user.profile?.company || '',
    website: user.profile?.website || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isEditing) {
      setValidationErrors({});
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        headline: user.profile?.headline || '',
        location: user.profile?.location || '',
        company: user.profile?.company || '',
        website: user.profile?.website || ''
      });
    }
  }, [isEditing]);
  // Input Change Handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for the current field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      
      // Validate form data
      const result = ProfileSchema.safeParse(formData);
      
      if (!result.success) {
        // Convert zod errors to a more manageable format
        const errors = result.error.flatten().fieldErrors;
        const errorMap: { [key: string]: string } = {};
        Object.keys(errors).forEach(key => {
          if (errors[key as keyof typeof errors]?.length) {
            errorMap[key] = errors[key as keyof typeof errors]![0];
          }
        });
        
        setValidationErrors(errorMap);
        setIsSubmitting(false);
        return;
      }

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

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      // Reset to original user data
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        headline: user.profile?.headline || '',
        location: user.profile?.location || '',
        company: user.profile?.company || '',
        website: user.profile?.website || ''
      });
      setValidationErrors({});
    }
    setIsEditing(open);
  };


  return (
    <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold text-gray-900 truncate">
        {user.firstName + " " + user.lastName}
      </h1>
      {isOwnProfile && (
        <Dialog open={isEditing} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-gray-100"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Profile Information</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={validationErrors.firstName ? 'border-red-500' : ''}
                  />
                  {validationErrors.firstName && (
                    <p className="text-red-500 text-sm">{validationErrors.firstName}</p>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                      className={validationErrors.lastName ? 'border-red-500' : ''}
                  />
                  {validationErrors.lastName && (
                    <p className="text-red-500 text-sm">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Textarea
                  id="headline"
                  name="headline"
                  value={formData.headline}
                  onChange={handleInputChange}
                  className={`resize-none ${validationErrors.headline ? 'border-red-500' : ''}`}
                  rows={2}
                />
                {validationErrors.headline && (
                  <p className="text-red-500 text-sm">{validationErrors.headline}</p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={validationErrors.company ? 'border-red-500' : ''}
                  />
                  {validationErrors.company && (
                    <p className="text-red-500 text-sm">{validationErrors.company}</p>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={validationErrors.location ? 'border-red-500' : ''}
                  />
                  {validationErrors.location && (
                    <p className="text-red-500 text-sm">{validationErrors.location}</p>
                  )}
                </div>
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
                  className={validationErrors.website ? 'border-red-500' : ''}
                />
                {validationErrors.website && (
                  <p className="text-red-500 text-sm">{validationErrors.website}</p>
                )}
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
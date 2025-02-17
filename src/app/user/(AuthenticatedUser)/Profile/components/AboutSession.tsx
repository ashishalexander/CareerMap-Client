"use client"
import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { z } from 'zod';

// Zod Schema for About Section
const AboutSchema = z.object({
  about: z.union([
    z.string()
      .trim()
      .min(10, { message: "About section must be at least 10 characters" })
      .max(500, { message: "About section must be maximum 500 characters" }),
    z.literal("")
  ]).optional().transform(value => value === "" ? undefined : value)
});

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
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSave = () => {
    try {
      // Validate the input
      const result = AboutSchema.safeParse({ about: editedAbout });
      
      if (!result.success) {
        // Set the first validation error
        const errorMessage = result.error.errors[0].message;
        setValidationError(errorMessage);
        return;
      }

      // Clear any previous validation errors
      setValidationError(null);
      
      // Call update with validated text
      onUpdate(editedAbout.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Validation error:', error);
    }
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
            onChange={(e) => {
              setEditedAbout(e.target.value);
              setValidationError(null);  // Clear error on typing
            }}
            className={`w-full p-2 border rounded-md min-h-[100px] ${validationError ? 'border-red-500' : ''}`}
            placeholder="Write something about yourself..."
          />
          {validationError && (
            <p className="text-red-500 text-sm">{validationError}</p>
          )}
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
import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { PlusCircle, X } from "lucide-react";
import { useAppSelector } from '@/app/store/store';
import { IpostCreate } from "@/const/Ipost";
import api from '@/app/lib/axios-config';

// Zod schema for post validation
const PostSchema = z.object({
  text: z.string().max(5000, { message: "Post text cannot exceed 5000 characters" }).optional(),
  media: z.object({
    file: z.instanceof(File),
    description: z.string().max(500, { message: "Media description cannot exceed 500 characters" }).optional()
  }).optional()
}).refine(data => data.text || data.media, {
  message: "Either text or media must be provided"
});

export const CreatePost: React.FC = () => {
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [articleText, setArticleText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaDescription, setMediaDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current user's ID from Redux store
  const userId = useAppSelector((state) => state.auth.user?._id);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset previous validation errors
      setValidationErrors([]);
      
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      const errors: string[] = [];
      if (!allowedTypes.includes(file.type)) {
        errors.push('Invalid file type. Only JPEG, PNG, and GIF are allowed.');
      }
      if (file.size > maxSize) {
        errors.push('File size exceeds 10MB limit.');
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setMediaDescription('');
    setValidationErrors([]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input
    }
  };

  const handleArticleSubmit = () => {
    // Check if user is authenticated
    if (!userId) {
      setValidationErrors(['User must be logged in to create a post']);
      return;
    }

    // Prepare post data for validation
    const postData = {
      text: articleText.trim() || undefined,
      media: selectedFile 
        ? {
            file: selectedFile,
            description: mediaDescription.trim() || undefined
          }
        : undefined
    };

    try {
      // Validate the post data
      PostSchema.parse(postData);


    // Prepare FormData for sending the request
    const formData = new FormData();
    formData.append('author', userId);
    if (postData.text) {
      formData.append('text', postData.text);
    }
    if (postData.media) {
      formData.append('media', postData.media.file); // Attach the file
      if (postData.media.description) {
        formData.append('description', postData.media.description);
      }
    }

      const respone = api.post(`/api/users/activity/new-post/${userId}`,formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Let Axios handle the multipart boundary
          },
        }
      )
      // TODO: Dispatch post creation action or call API
      console.log('Creating post:', formData);

      // Reset form
      setArticleText('');
      removeSelectedFile();
      setIsArticleDialogOpen(false);
      setValidationErrors([]);

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Extract and set validation error messages
        const errors = error.errors.map(err => err.message);
        setValidationErrors(errors);
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img 
            src="https://placehold.jp/40x40.png" 
            alt="User avatar" 
            className="rounded-full w-10 h-10" 
          />
          <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
            <DialogTrigger asChild>
              <button className="w-full text-left rounded-full border px-4 py-2 text-gray-500 hover:bg-gray-100">
                Start a post
              </button>
            </DialogTrigger>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <PlusCircle size={20} />
              <span>Create Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] max-h-[800px]">
            <DialogHeader>
              <DialogTitle>Create a Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 overflow-y-auto">
              {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  <ul className="list-disc list-inside text-red-600">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Text Input */}
              <Textarea
                placeholder="What's on your mind?"
                value={articleText}
                onChange={(e) => {
                  setArticleText(e.target.value);
                  setValidationErrors([]); // Clear previous errors
                }}
                className="min-h-[200px]"
              />

              {/* Media Upload */}
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleFileSelect}
                  className="w-full"
                />
                
                {selectedFile && (
                  <div className="relative">
                    <div className="w-full h-[400px] flex items-center justify-center">
                      <img 
                        src={URL.createObjectURL(selectedFile)} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain rounded" 
                      />
                    </div>
                    <Input 
                      placeholder="Add a description to your image (optional)"
                      value={mediaDescription}
                      onChange={(e) => {
                        setMediaDescription(e.target.value);
                        setValidationErrors([]); // Clear previous errors
                      }}
                      className="mt-2"
                    />
                    <Button 
                      variant="destructive" 
                      onClick={removeSelectedFile} 
                      className="absolute top-2 right-2"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleArticleSubmit}
                disabled={(!articleText.trim() && !selectedFile) || validationErrors.length > 0}
                className="w-full"
              >
                Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
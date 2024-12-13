import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Briefcase, X } from "lucide-react";
import { useAppSelector } from '@/app/store/store';
import { Separator } from "@/components/ui/separator";
import api from '@/app/lib/axios-config';

const PostSchema = z.object({
  text: z.string().max(5000, { message: "Post text cannot exceed 5000 characters" }).optional(),
  media: z.object({
    file: z.instanceof(File),
    description: z.string().max(500, { message: "Media description cannot exceed 500 characters" }).optional()
  }).optional()
}).refine(data => data.text || data.media, {
  message: "Either text or media must be provided"
});

const JobPostSchema = z.object({
  title: z.string().min(1, "Job title is required").max(100),
  company: z.string().min(1, "Company name is required").max(100),
  location: z.string().min(1, "Location is required").max(100),
  type: z.enum(["Full-time", "Part-time", "Contract", "Internship"], {
    errorMap: () => ({ message: "Please select a valid job type" })
  }),
  description: z.string().min(50, "Description must be at least 50 characters").max(2000),
  requirements: z.string().min(20, "Requirements must be at least 20 characters").max(1000),
  salary: z.string().optional(),
  contactEmail: z.string().email("Invalid email address")
});

export const CreatePost: React.FC = () => {
  // Regular post states
  const [isArticleDialogOpen, setIsArticleDialogOpen] = useState(false);
  const [articleText, setArticleText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaDescription, setMediaDescription] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Job post states
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [jobPost, setJobPost] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    contactEmail: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // User data from Redux store
  const userId = useAppSelector((state) => state.auth.user?._id);
  const user = useAppSelector((state) => state.auth.user);
  const isRecruiter = user?.role === 'recruiter';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValidationErrors([]);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 10 * 1024 * 1024;
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleJobFieldChange = (field: keyof typeof jobPost, value: string) => {
    setJobPost(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleArticleSubmit = async () => {
    if (!userId) {
      setValidationErrors(['User must be logged in to create a post']);
      return;
    }

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
      PostSchema.parse(postData);

      const formData = new FormData();
      formData.append('author', userId);
      if (postData.text) {
        formData.append('text', postData.text);
      }
      if (postData.media) {
        formData.append('media', postData.media.file);
        if (postData.media.description) {
          formData.append('description', postData.media.description);
        }
      }

      await api.post(`/api/users/activity/new-post/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setArticleText('');
      removeSelectedFile();
      setIsArticleDialogOpen(false);
      setValidationErrors([]);

    } catch (error) {
      if (error instanceof z.ZodError) {
        setValidationErrors(error.errors.map(err => err.message));
      }
    }
  };

  const handleJobPostSubmit = async () => {
    if (!userId || !isRecruiter) {
      setFieldErrors({ general: 'You must be logged in as a recruiter to post jobs' });
      return;
    }

    try {
      JobPostSchema.parse(jobPost);

      await api.post(`/api/users/activity/JobPost/${userId}`, {
        ...jobPost,
        recruiter: userId
      });

      setJobPost({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
        contactEmail: ''
      });
      setIsJobDialogOpen(false);
      setFieldErrors({});

    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setFieldErrors(newErrors);
      }
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <img 
            src={user?.profile?.profilePicture || "https://placehold.jp/40x40.png"} 
            alt="User avatar" 
            className="rounded-full w-10 h-10" 
          />
          <button className="w-full text-left rounded-full border px-4 py-2 text-gray-500 hover:bg-gray-100">
            Start a post
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <Dialog open={isArticleDialogOpen} onOpenChange={setIsArticleDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <PlusCircle size={20} />
              <span>Create Post</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] w-[90vw] h-[80vh] max-h-[800px]">
            {/* Regular post dialog content remains the same */}
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

        {isRecruiter && (
          <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Briefcase size={20} />
                <span>Post Job</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] w-[90vw] h-[90vh] max-h-[900px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">Create a Job Posting</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 overflow-y-auto py-6">
                {fieldErrors.general && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                    <p className="text-red-600">{fieldErrors.general}</p>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Senior Software Engineer"
                        value={jobPost.title}
                        onChange={(e) => handleJobFieldChange('title', e.target.value)}
                      />
                      {fieldErrors.title && (
                        <p className="text-sm text-red-500 mt-1">{fieldErrors.title}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          placeholder="Your Company Name"
                          value={jobPost.company}
                          onChange={(e) => handleJobFieldChange('company', e.target.value)}
                        />
                        {fieldErrors.company && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.company}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., New York, NY"
                          value={jobPost.location}
                          onChange={(e) => handleJobFieldChange('location', e.target.value)}
                        />
                        {fieldErrors.location && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.location}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Employment Type</Label>
                        <select
                          id="type"
                          className="w-full border rounded-md p-2"
                          value={jobPost.type}
                          onChange={(e) => handleJobFieldChange('type', e.target.value)}
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                        </select>
                        {fieldErrors.type && (
                          <p className="text-sm text-red-500 mt-1">{fieldErrors.type}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary Range (Optional)</Label>
                        <Input
                          id="salary"
                          placeholder="e.g., $80,000 - $100,000"
                          value={jobPost.salary}
                          onChange={(e) => handleJobFieldChange('salary', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="recruitment@company.com"
                        value={jobPost.contactEmail}
                        onChange={(e) => handleJobFieldChange('contactEmail', e.target.value)}
                      />
                      {fieldErrors.contactEmail && (
                        <p className="text-sm text-red-500 mt-1">{fieldErrors.contactEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Job Details Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Job Details</h3>
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide a detailed description of the role and responsibilities..."
                        value={jobPost.description}
                        onChange={(e) => handleJobFieldChange('description', e.target.value)}
                        className="min-h-[150px]"
                      />
                      {fieldErrors.description && (
                        <p className="text-sm text-red-500 mt-1">{fieldErrors.description}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements">Requirements</Label>
                      <Textarea
                        id="requirements"
                        placeholder="List the key qualifications and skills required..."
                        value={jobPost.requirements}
                        onChange={(e) => handleJobFieldChange('requirements', e.target.value)}
                        className="min-h-[150px]"
                      />
                      {fieldErrors.requirements && (
                        <p className="text-sm text-red-500 mt-1">{fieldErrors.requirements}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleJobPostSubmit}
                    className="w-full"
                  >
                    Post Job
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
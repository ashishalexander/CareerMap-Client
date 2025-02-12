import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter

} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/app/lib/axios-config';
import { PencilIcon, PlusCircle, Trash2,  X, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { RootState, useAppSelector } from '@/app/store/store';

const CustomQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  type: z.enum(["text", "multiple-choice"]),
  options: z.array(z.string()).optional()
});

// Job Post Schema
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
  contactEmail: z.string().email("Invalid email address"),
  customQuestions: z.array(CustomQuestionSchema).optional()


});

// Types
type JobPostFormData = z.infer<typeof JobPostSchema>;

interface CustomQuestion {
  question: string;
  type: "text" | "multiple-choice";
  options?: string[];
}


interface JobPost extends JobPostFormData {
  _id: string;
}

interface RecruiterJobComponentProps {
  isOwnProfile: boolean;
}

const RecruiterJobComponent: React.FC<RecruiterJobComponentProps> = ({ 
  isOwnProfile 
}) => {
  // State Management
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState<string | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);


  // Form Hook
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<JobPostFormData>({
    resolver: zodResolver(JobPostSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      description: '',
      requirements: '',
      salary: '',
      contactEmail: '',
      customQuestions: []


    }
  });

  const user = useAppSelector((state:RootState)=>state.auth.user)

  // Fetch Job Posts
  const fetchJobPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/users/recruiter/JobPost/${user?._id}`);
      setJobPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch job posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  // Fetch job posts on component mount
  useEffect(() => {
    fetchJobPosts();
  }, [fetchJobPosts]);

  // Save Job Post Handler
  const handleSaveJobPost = useCallback(async (data: JobPostFormData) => {
    try {

      const jobData = {
        ...data,
        recruiter: user?._id,
        customQuestions // Include customQuestions in the payload
      };

      if (editingJobId) {
        await api.put(`/api/users/activity/JobPost/${editingJobId}`, jobData);
      } else {
        await api.post(`/api/users/activity/JobPost/${user?._id}`, jobData);
      }
      
      await fetchJobPosts();
      setIsJobDialogOpen(false);
      setEditingJobId(null);
      setCustomQuestions([]); // Reset custom questions

      reset();
    } catch (error) {
      console.error('Failed to save job post:', error);
    }
  }, [editingJobId, reset, fetchJobPosts, user?._id, customQuestions]);

  // Delete Job Post Handler
  const handleDeleteJobPost = async (jobId: string) => {
    try {
      await api.delete(`/api/users/recruiter/${jobId}/${user?._id}`);
      setDeleteConfirmJobId(null); // Close the confirmation dialog

      
      // Refetch job posts after deletion
      await fetchJobPosts();
    } catch (error) {
      console.error('Failed to delete job post:', error);
    }
  };

  // Start Editing Job Post
  const handleStartEdit = useCallback((jobPost: JobPost) => {
    setEditingJobId(jobPost._id);
    setCustomQuestions(jobPost.customQuestions || []);
    
    Object.entries(jobPost).forEach(([key, value]) => {
      setValue(key as keyof JobPostFormData, value);
    });

    
    setIsJobDialogOpen(true);
  }, [setValue]);

  // Start New Job Post
  const handleStartNew = useCallback(() => {
    setEditingJobId(null);
    setCustomQuestions([]);

    reset();
    setIsJobDialogOpen(true);
  }, [reset]);

  const addCustomQuestion = () => {
    setCustomQuestions(prev => [...prev, {
      question: '',
      type: 'text',
      options: []
    }]);
  };

  const removeCustomQuestion = (index: number) => {
    setCustomQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomQuestion = (index: number, field: keyof CustomQuestion, value: any) => {
    setCustomQuestions(prev => prev.map((q, i) => {
      if (i === index) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const addOption = (questionIndex: number) => {
    setCustomQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: [...(q.options || []), '']
        };
      }
      return q;
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setCustomQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        const newOptions = [...(q.options || [])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setCustomQuestions(prev => prev.map((q, i) => {
      if (i === questionIndex) {
        return {
          ...q,
          options: (q.options || []).filter((_, oi) => oi !== optionIndex)
        };
      }
      return q;
    }));
  };


  // Job Post Display Component
  const JobPostDisplay: React.FC<{ jobPost: JobPost }> = 
    useCallback(({ jobPost }) => (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{jobPost.title}</h3>
          <p className="text-gray-600">{jobPost.company} - {jobPost.location}</p>
          <p className="text-sm text-gray-500">{jobPost.type}</p>
          {jobPost.salary && (
            <p className="text-sm text-gray-500">Salary: {jobPost.salary}</p>
          )}
        </div>
        {isOwnProfile && (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleStartEdit(jobPost)}
              className="hover:bg-gray-100"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setDeleteConfirmJobId(jobPost._id)} // Open confirmation dialog

              className="hover:bg-red-100 text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  ), [handleStartEdit, isOwnProfile]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Postings</CardTitle>
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleStartNew}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Job Posting
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading job posts...</p>
        ) : jobPosts.length === 0 ? (
          <p className="text-center text-gray-500">
            {isOwnProfile 
              ? "You haven't created any job postings yet." 
              : "No job postings available."}
          </p>
        ) : (
          jobPosts.map((jobPost) => (
            <JobPostDisplay 
              key={`job-post-${jobPost._id}`}
              jobPost={jobPost}
            />
          ))
        )}

        <Dialog open={!!deleteConfirmJobId} onOpenChange={() => setDeleteConfirmJobId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this job posting? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmJobId(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteConfirmJobId && handleDeleteJobPost(deleteConfirmJobId)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>


        {/* Job Post Dialog */}
        <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
          <DialogContent className="sm:max-w-[800px] w-[90vw] h-[90vh] max-h-[900px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">
                {editingJobId ? 'Edit Job Posting' : 'Create a Job Posting'}
              </DialogTitle>
            </DialogHeader>
            
            <form 
              onSubmit={handleSubmit(handleSaveJobPost)} 
              className="space-y-6 overflow-y-auto py-6"
            >
              <div className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g., Senior Software Engineer"
                        />
                      )}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Controller
                        name="company"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="Your Company Name"
                          />
                        )}
                      />
                      {errors.company && (
                        <p className="text-sm text-red-500 mt-1">{errors.company.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Controller
                        name="location"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., New York, NY"
                          />
                        )}
                      />
                      {errors.location && (
                        <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Employment Type</Label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <select
                            {...field}
                            className="w-full border rounded-md p-2"
                          >
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                          </select>
                        )}
                      />
                      {errors.type && (
                        <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range (Optional)</Label>
                      <Controller
                        name="salary"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="e.g., $80,000 - $100,000"
                          />
                        )}
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
                    <Controller
                      name="contactEmail"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          type="email"
                          placeholder="recruitment@company.com"
                        />
                      )}
                    />
                    {errors.contactEmail && (
                      <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>
                    )}
                  </div>
                </div>

                {/* Job Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Job Details</h3>
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="Provide a detailed description of the role and responsibilities..."
                          className="min-h-[150px]"
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Requirements</Label>
                    <Controller
                      name="requirements"
                      control={control}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="List the key qualifications and skills required..."
                          className="min-h-[150px]"
                        />
                      )}
                    />
                    {errors.requirements && (
                      <p className="text-sm text-red-500 mt-1">{errors.requirements.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Custom Questions (Optional)</h3>
                  <Button
                    type="button"
                    onClick={addCustomQuestion}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Question
                  </Button>
                </div>
                <Separator />
                
                <div className="space-y-6">
                  {customQuestions.map((question, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <Label>Question {index + 1}</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateCustomQuestion(index, 'question', e.target.value)}
                            placeholder="Enter your question"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCustomQuestion(index)}
                          className="ml-2"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Question Type</Label>
                        <select
                          className="w-full border rounded-md p-2"
                          value={question.type}
                          onChange={(e) => updateCustomQuestion(index, 'type', e.target.value)}
                        >
                          <option value="text">Text Answer</option>
                          <option value="multiple-choice">Multiple Choice</option>
                        </select>
                      </div>

                      {question.type === 'multiple-choice' && (
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {question.options?.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(index)}
                            className="mt-2"
                          >
                            Add Option
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              </div>

              <div className="pt-4">
                <Button 
                  type="submit"
                  className="w-full"
                >
                  {editingJobId ? 'Update Job Posting' : 'Post Job'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RecruiterJobComponent;
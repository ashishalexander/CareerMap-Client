import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Briefcase, Upload, Check, Trash2, Plus } from 'lucide-react';
import { IJob } from '../Types/Job';
import { useAppSelector } from '@/app/store/store';


interface JobApplicationProps {
  job: IJob;
  onSubmit: (data: JobApplicationFormData) => Promise<void>;
  hasapplied:boolean;
}

// Define the education schema
const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional()
}).refine(data => {
  if (!data.current && !data.endDate) {
    return false;
  }
  if (data.current) {
    return true;
  }
  return new Date(data.endDate!) >= new Date(data.startDate);
}, {
  message: "End date must be after start date or marked as current",
  path: ["endDate"]
});

// Define the experience schema - now optional fields
const experienceSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional()
}).refine(data => {
  // Only validate dates if both are provided
  if (data.startDate && data.endDate && !data.current) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after start date or marked as current",
  path: ["endDate"]
});

// Define custom answers schema type
const customAnswerSchema = z.union([
  z.string().min(1, 'This question is required'),
  z.array(z.string()).min(1, 'At least one option must be selected')
]);

// Update the main application schema
const applicationSchema = z.object({
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Please use international format'),
  coverLetter: z.string().optional(), // Made optional with no minimum length
  education: z.array(educationSchema)
    .min(1, 'At least one education entry is required'),
  experience: z.array(experienceSchema) // Made optional with no minimum requirement
    .optional()
    .default([]),
  resume: z.instanceof(File, { message: 'Resume is required' })
    .refine(
      file => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    )
    .refine(
      file => file.type === 'application/pdf',
      'Only PDF files are allowed'
    ),
  customAnswers: z.record(customAnswerSchema)
});
type JobApplicationFormData = z.infer<typeof applicationSchema>;

export function JobApplicationForm({ job, onSubmit,hasapplied }: JobApplicationProps) {
  const user = useAppSelector((state) => state.auth.user);
  const [educationList, setEducationList] = useState([{
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  const [experienceList, setExperienceList] = useState([{
    company: '',
    position: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  }]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      education: educationList,
      experience: experienceList,
      customAnswers: {}

    }
  });

  // Pre-fill form with user data from Redux
  useEffect(() => {
    if (user) {
      // Pre-fill personal information
      setValue('fullName', `${user.firstName} ${user.lastName}`);
      setValue('email', user.email);
      setValue('phone', user.mobile || '');

      // Pre-fill education
      if (user.profile?.Education && user.profile.Education.length > 0) {
        const formattedEducation = user.profile.Education.map(edu => ({
          institution: edu.school,
          degree: edu.degree,
          field: '', 
          startDate: new Date(edu.startDate).toISOString().split('T')[0],
          endDate: new Date(edu.endDate).toISOString().split('T')[0],
          current: false,
          description: edu.skills?.join(', ') || ''
        }));
        setEducationList(formattedEducation);
        setValue('education', formattedEducation);
      }

      // Pre-fill experience
      if (user.profile?.Experience && user.profile.Experience.length > 0) {
        const formattedExperience = user.profile.Experience.map(exp => ({
          company: exp.company,
          position: exp.title,
          location: exp.location,
          startDate: new Date(exp.startDate).toISOString().split('T')[0],
          endDate: new Date(exp.endDate).toISOString().split('T')[0],
          current: false,
          description: exp.description
        }));
        setExperienceList(formattedExperience);
        setValue('experience', formattedExperience);
      }
    }
  }, [user, setValue]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed.');
        return;
      }
      setValue('resume', file);
    }
  };

  const watchedFile = watch('resume');

  const addEducation = () => {
    setEducationList([...educationList, {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
    setValue('education', educationList);
  };

  const removeEducation = (index: number) => {
    const newList = educationList.filter((_, i) => i !== index);
    setEducationList(newList);
    setValue('education', newList);
  };

  const addExperience = () => {
    setExperienceList([...experienceList, {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }]);
    setValue('experience', experienceList);
  };

  const removeExperience = (index: number) => {
    const newList = experienceList.filter((_, i) => i !== index);
    setExperienceList(newList);
    setValue('experience', newList);
  };

   // Updated custom question handling to make it required
   const handleCustomAnswerChange = (index: number, value: string) => {
    setValue(`customAnswers.${index}`, value, {
      shouldValidate: true
    });
  };
  const onSubmitForm = async (data: JobApplicationFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
        <p className="text-muted-foreground">{job.company}</p>
        <div className="flex items-center justify-center space-x-2">
          <Briefcase className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Your Application</CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    placeholder="John Doe"
                    className={errors.fullName ? 'border-red-500' : ''}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+1 (555) 000-0000"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Education</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </Button>
              </div>
              
              {educationList.map((education, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium">Education #{index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Institution *</Label>
                      <Input
                        {...register(`education.${index}.institution`)}
                        placeholder="University/School Name"
                      />
                      {errors.education?.[index]?.institution && (
                        <p className="text-red-500 text-sm">{errors.education[index]?.institution?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Degree *</Label>
                      <Input
                        {...register(`education.${index}.degree`)}
                        placeholder="Bachelor's, Master's, etc."
                      />
                      {errors.education?.[index]?.degree && (
                        <p className="text-red-500 text-sm">{errors.education[index]?.degree?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Field of Study *</Label>
                      <Input
                        {...register(`education.${index}.field`)}
                        placeholder="Computer Science, Business, etc."
                      />
                      {errors.education?.[index]?.field && (
                        <p className="text-red-500 text-sm">{errors.education[index]?.field?.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          {...register(`education.${index}.startDate`)}
                        />
                        {errors.education?.[index]?.startDate && (
                          <p className="text-red-500 text-sm">{errors.education[index]?.startDate?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          {...register(`education.${index}.endDate`)}
                          disabled={watch(`education.${index}.current`)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register(`education.${index}.current`)}
                      className="rounded border-gray-300"
                    />
                    <Label>Currently Studying Here</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      {...register(`education.${index}.description`)}
                      placeholder="Describe your major achievements, relevant coursework, etc."
                      className="h-24"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Experience Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Experience</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExperience}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </Button>
              </div>
              
              {experienceList.map((experience, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium">Experience #{index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Company </Label>
                      <Input
                        {...register(`experience.${index}.company`)}
                        placeholder="Company Name"
                      />
                      {errors.experience?.[index]?.company && (
                        <p className="text-red-500 text-sm">{errors.experience[index]?.company?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Position </Label>
                      <Input
                        {...register(`experience.${index}.position`)}
                        placeholder="Job Title"
                      />
                      {errors.experience?.[index]?.position && (
                        <p className="text-red-500 text-sm">{errors.experience[index]?.position?.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Location </Label>
                      <Input
                        {...register(`experience.${index}.location`)}
                        placeholder="City, Country"
                      />
                      {errors.experience?.[index]?.location && (
                        <p className="text-red-500 text-sm">{errors.experience[index]?.location?.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date </Label>
                        <Input
                          type="date"
                          {...register(`experience.${index}.startDate`)}
                        />
                        {errors.experience?.[index]?.startDate && (
                          <p className="text-red-500 text-sm">{errors.experience[index]?.startDate?.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          {...register(`experience.${index}.endDate`)}
                          disabled={watch(`experience.${index}.current`)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="rounded border-gray-300"
                    />
                    <Label>Currently Working Here</Label>
                  </div>

                  <div className="space-y-2">
                    <Label>Description </Label>
                    <Textarea
                      {...register(`experience.${index}.description`)}
                      placeholder="Describe your responsibilities and achievements..."
                      className="h-24"
                    />
                    {errors.experience?.[index]?.description && (
                      <p className="text-red-500 text-sm">{errors.experience[index]?.description?.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter </Label>
              <Textarea
                id="coverLetter"
                {...register('coverLetter')}
                placeholder="Tell us why you're the perfect fit for this role..."
                className={`min-h-[200px] ${errors.coverLetter ? 'border-red-500' : ''}`}
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm">{errors.coverLetter.message}</p>
              )}
            </div>

            {/* Resume Upload */}
            <div className="space-y-4">
              <Label>Resume Upload *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-4">
                <div className="flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className={errors.resume ? 'border-red-500' : ''}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {watchedFile ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      {(watchedFile as File).name}
                    </span>
                  ) : (
                    'PDF up to 5MB'
                  )}
                </p>
                {errors.resume && (
                  <p className="text-red-500 text-sm">{errors.resume.message}</p>
                )}
              </div>
            </div>

            {/* Updated Custom Questions Section */}
            {job.customQuestions && job.customQuestions.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Additional Questions</h3>
                {job.customQuestions.map((q, index) => (
                  <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <Label>{q.question} *</Label>
                    {q.type === 'text' ? (
                      <Textarea
                        {...register(`customAnswers.${index}`, {
                          required: 'This question is required'
                        })}
                        className={`bg-white ${
                          errors.customAnswers?.[index] ? 'border-red-500' : ''
                        }`}
                        placeholder="Your answer..."
                      />
                    ) : (
                      <RadioGroup
                        defaultValue=""
                        onValueChange={(value) => handleCustomAnswerChange(index, value)}
                        className="space-y-2"
                      >
                        {q.options?.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={option}
                              id={`${index}-${optIndex}`}
                            />
                            <Label htmlFor={`${index}-${optIndex}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    {errors.customAnswers?.[index] && (
                      <p className="text-red-500 text-sm">{errors.customAnswers[index]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit"
            className="w-full"
            disabled={isSubmitting||hasapplied}
            onClick={() => console.log("Button clicked")}

          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting Application...
              </span>
            ) : (
              'Submit Application'
            )}
          </Button>
          <p className="text-sm text-gray-500 text-center">
            By submitting this application, you confirm that all provided information is accurate
          </p>
        </CardFooter>
          </form>
        </CardContent>

        
      </Card>
    </div>
  );
}

export default JobApplicationForm;
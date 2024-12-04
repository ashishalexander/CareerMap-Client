import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../../../../store/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerDemo } from '@/components/ui/datePicker';
import { FileDiff, PencilIcon, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from '@/app/lib/axios-config';
import { updateUserProfileEducation } from '@/app/store/slices/authSlice';
import { Trash2 } from 'lucide-react';

// Define the validation schema using zod
const educationSchema = z.object({
  school: z.string()
    .min(1, 'School name is required')
    .max(100, 'School name must be less than 100 characters'),
  
  degree: z.string()
    .min(1, 'Degree is required')
    .max(100, 'Degree must be less than 100 characters'),
  
  startDate: z.date().nullable(),
  
  endDate: z.date().nullable(),
  
  skills: z.array(z.string())
    .refine((val) => val.length > 0, 'At least one skill is required'),
}).refine((data) => {
  // Custom validation for date comparison
  const { startDate, endDate } = data;
  
  // If both dates exist, end date must be after start date
  if (startDate && endDate && endDate <= startDate) {
    return false;
  }
  
  // If end date exists without start date, that's invalid
  if (endDate && !startDate) {
    return false;
  }
  
  return true;
}, {
  message: 'Invalid date range',
  path: ['endDate'], 
});

type EducationFormData = z.infer<typeof educationSchema>;

export interface IEducation {
  school: string;
  degree: string;
  startDate: Date | null;
  endDate: Date | null;
  skills: string[];
}


interface EducationProfileComponentProps {
  isOwnProfile: boolean;
  educations?:{
            school: string;
            degree: string;
            startDate: Date;
            endDate: Date;
            skills:[string];
            _id:string
  }[];
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

interface EducationDisplayProps {
  education: IEducation;
  index: string;
}

const EducationProfileComponent: React.FC<EducationProfileComponentProps> = ({ isOwnProfile,educations }) => {
  const dispatch = useAppDispatch();
  const useSelector = useAppSelector
  const user = useSelector((state:RootState)=>state.auth.user) 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      school: '',
      degree: '',
      startDate: null,
      endDate: null,
      skills: [],
    }
  });

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSaveEducation = useCallback(async (data: EducationFormData) => {
    try {
      const Education: IEducation = {
        school: data.school,
        degree: data.degree,
        startDate: data.startDate,
        endDate: data.endDate,
        skills: data.skills,
      };
      console.log(Education)
      if(editingIndex){
        const  response = await api.put(`/api/users/profile/education-update/${editingIndex}/${user?._id}`,{Education})
        dispatch(updateUserProfileEducation(response.data))
      }else{
        const response = await api.post(`/api/users/profile/education/${user?._id}`,{Education})
        dispatch(updateUserProfileEducation(response.data))
      }
      setIsDialogOpen(false);
      setEditingIndex(null);
      reset();
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  }, [editingIndex, reset, dispatch]);

  const handleDeleteEducation = async (index: string) => {
    try {
      const response = await api.delete(`/api/users/delete/profile-education/${index}/${user?._id}`);
       dispatch(updateUserProfileEducation(response.data));
    } catch (error) {
      console.error('Failed to delete education:', error);
    }
  };
  const handleStartEdit = useCallback((index: string, education: IEducation) => {
    setEditingIndex(index);
    setValue('school', education.school);
    setValue('degree', education.degree);
    setValue('startDate', education.startDate ? new Date(education.startDate) : null);
    setValue('endDate', education.endDate ? new Date(education.endDate) : null);
    setValue('skills', education.skills);
    setIsDialogOpen(true);
  }, [setValue]);

  const handleStartNew = useCallback(() => {
    setEditingIndex(null);
    reset();
    setIsDialogOpen(true);
  }, [reset]);

  const FormField: React.FC<FormFieldProps> = useCallback(({ label, children, error }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  ), []);

  const EducationDisplay: React.FC<EducationDisplayProps> = useCallback(({ education, index }) => (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{education.school}</h3>
          <p className="text-gray-600">{education.degree}</p>
          <p className="text-sm text-gray-500">
            {formatDate(education.startDate)} - {formatDate(education.endDate)}
          </p>
          {education.skills && education.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Skills</p>
              <p className="text-sm text-gray-600">{education.skills.join(', ')}</p>
            </div>
          )}  
        </div>
        {isOwnProfile && (
          <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleStartEdit(index, education)}
            className="hover:bg-gray-100"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteEducation(index)}
            className="hover:bg-red-100 text-black-500"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
          
        )}
      </div>
    </div>
  ), [handleStartEdit, isOwnProfile]);

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsArray = e.target.value
      .split(',')
      .map(skill => skill.trim())  
      .filter(skill => skill.length > 0);  
  
    setValue('skills', skillsArray);  
  };
  

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Education</CardTitle>
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleStartNew}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Education
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {educations?.map((education, index) => (
          <EducationDisplay 
            key={`education-${index}`}
            education={education} 
            index={education._id}
          />
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Edit Education' : 'Add Education'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleSaveEducation)} className="space-y-4 mt-4">
              <FormField 
                label="School" 
                error={errors.school?.message}
              >
                <Controller
                  name="school"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} />
                  )}
                />
              </FormField>

              <FormField 
                label="Degree"
                error={errors.degree?.message}
              >
                <Controller
                  name="degree"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} />
                  )}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField 
                  label="Start Date"
                  error={errors.startDate?.message}
                >
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerDemo 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormField>

                <FormField 
                  label="End Date"
                  error={errors.endDate?.message}
                >
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePickerDemo 
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormField>
              </div>

              <FormField 
                label="Skills"
                error={errors.skills?.message}
              >
                <Controller
                  name="skills"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Textarea
                      value={value||''}
                      onChange={(e) => onChange(e.target.value)} 
                      onBlur={handleSkillsChange}
                      placeholder="Separate skills with commas"
                      className="resize-none"
                      rows={3}
                    />
                  )}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EducationProfileComponent;
import React, { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../../../../store/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerDemo } from '@/components/ui/datePicker';
import { PencilIcon, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface IEducation {
  school?: string;
  degree?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  skills?: string[];
}

interface EducationProfileComponentProps {
  isOwnProfile: boolean;
}

const EducationProfileComponent: React.FC<EducationProfileComponentProps> = ({ isOwnProfile }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IEducation>({
    school: '',
    degree: '',
    startDate: null,
    endDate: null,
    skills: [],
  });

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSaveEducation = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        // await dispatch(updateEducation({ index: editingIndex, updatedData: formData }));
      } else {
        // await dispatch(createEducation(formData));
      }
      setIsDialogOpen(false);
      setEditingIndex(null);
      setFormData({
        school: '',
        degree: '',
        startDate: null,
        endDate: null,
        skills: [],
      });
    } catch (error) {
      console.error('Failed to save education:', error);
    }
  }, [editingIndex, formData, dispatch]);

  const handleStartEdit = useCallback((index: number, education: IEducation) => {
    setEditingIndex(index);
    setFormData(education);
    setIsDialogOpen(true);
  }, []);

  const handleStartNew = useCallback(() => {
    setEditingIndex(null);
    setFormData({
      school: '',
      degree: '',
      startDate: null,
      endDate: null,
      skills: [],
    });
    setIsDialogOpen(true);
  }, []);

  const handleInputChange = useCallback((field: keyof IEducation) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'skills' ? value.split(',').map(skill => skill.trim()) : value
    }));
  }, []);

  const handleDateChange = useCallback((field: 'startDate' | 'endDate') => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  }, []);

  const FormField = useCallback(({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  ), []);

  const EducationDisplay = useCallback(({ education, index }: { education: IEducation; index: number }) => (
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
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleStartEdit(index, education)}
            className="hover:bg-gray-100"
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  ), [handleStartEdit, isOwnProfile]);

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
        {user?.profile?.Education?.map((education, index) => (
          <EducationDisplay 
            key={`education-${index}`}
            education={education} 
            index={index}
          />
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Edit Education' : 'Add Education'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEducation} className="space-y-4 mt-4">
              <FormField label="School">
                <Input
                  value={formData.school || ''}
                  onChange={handleInputChange('school')}
                  required
                />
              </FormField>

              <FormField label="Degree">
                <Input
                  value={formData.degree || ''}
                  onChange={handleInputChange('degree')}
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date">
                  <DatePickerDemo
                    value={formData.startDate??null}
                    onChange={handleDateChange('startDate')}
                  />
                </FormField>

                <FormField label="End Date">
                  <DatePickerDemo
                    value={formData.endDate??null}
                    onChange={handleDateChange('endDate')}
                  />
                </FormField>
              </div>

              <FormField label="Skills">
                <Textarea
                  value={formData.skills?.join(', ') || ''}
                  onChange={handleInputChange('skills')}
                  placeholder="Separate skills with commas"
                  className="resize-none"
                  rows={3}
                />
              </FormField>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
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
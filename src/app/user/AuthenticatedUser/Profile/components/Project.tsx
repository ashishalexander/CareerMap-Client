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

export interface IProject {
  title?: string;
  description?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  url?: string;
  skills?: string[];
}

interface ProjectProfileComponentProps {
  isOwnProfile: boolean;
}

const ProjectProfileComponent: React.FC<ProjectProfileComponentProps> = ({ isOwnProfile }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IProject>({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    url: '',
    skills: [],
  });

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleSaveProject = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingIndex !== null) {
        // await dispatch(updateProject({ index: editingIndex, updatedData: formData }));
      } else {
        // await dispatch(createProject(formData));
      }
      setIsDialogOpen(false);
      setEditingIndex(null);
      setFormData({
        title: '',
        description: '',
        startDate: null,
        endDate: null,
        url: '',
        skills: [],
      });
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  }, [editingIndex, formData, dispatch]);

  const handleStartEdit = useCallback((index: number, project: IProject) => {
    setEditingIndex(index);
    setFormData(project);
    setIsDialogOpen(true);
  }, []);

  const handleStartNew = useCallback(() => {
    setEditingIndex(null);
    setFormData({
      title: '',
      description: '',
      startDate: null,
      endDate: null,
      url: '',
      skills: [],
    });
    setIsDialogOpen(true);
  }, []);

  const handleInputChange = useCallback((field: keyof IProject) => (
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

  const ProjectDisplay = useCallback(({ project, index }: { project: IProject; index: number }) => (
    <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{project.title}</h3>
          <p className="text-gray-600">{project.description}</p>
          <p className="text-sm text-gray-500">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </p>
          {project.url && (
            <p className="text-sm text-blue-500">
              <a href={project.url} target="_blank" rel="noreferrer">
                {project.url}
              </a>
            </p>
          )}
          {project.skills && project.skills.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Skills</p>
              <p className="text-sm text-gray-600">{project.skills.join(', ')}</p>
            </div>
          )}
        </div>
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleStartEdit(index, project)}
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
        <CardTitle>Projects</CardTitle>
        {isOwnProfile && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleStartNew}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Project
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {user?.profile?.Projects?.map((project, index) => (
          <ProjectDisplay 
            key={`project-${index}`}
            project={project} 
            index={index}
          />
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? 'Edit Project' : 'Add Project'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveProject} className="space-y-4 mt-4">
              <FormField label="Title">
                <Input
                  value={formData.title || ''}
                  onChange={handleInputChange('title')}
                  required
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={formData.description || ''}
                  onChange={handleInputChange('description')}
                  required
                  className="resize-none"
                  rows={3}
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

              <FormField label="Project URL">
                <Input
                  value={formData.url || ''}
                  onChange={handleInputChange('url')}
                />
              </FormField>

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

export default ProjectProfileComponent;
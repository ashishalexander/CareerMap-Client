import React, { useState, useCallback } from "react";
import { useAppDispatch, useAppSelector, RootState } from "../../../../store/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerDemo } from "@/components/ui/datePicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PencilIcon, PlusCircle, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/app/lib/axios-config";
import { updateUserProfileExperience } from "@/app/store/slices/authSlice";

// Define the base experience interface
export interface IExperience {
  title: string;
  employmentType: string;
  company: string;
  startDate: Date | null;
  endDate: Date | null;
  location: string;
  description: string;
}

// Extended interface for experience with ID
interface ExperienceWithId extends IExperience {
  _id: string;
}

// Props interface for the main component
interface ExperienceProfileComponentProps {
  isOwnProfile: boolean;
  experiences?: ExperienceWithId[];
}

// Props interface for the display subcomponent
interface ExperienceDisplayProps {
  index: string;
  expobj: ExperienceWithId;
  onEdit: (index: string, experience: ExperienceWithId) => void;
  onDelete: (id: string) => void;
  isOwnProfile: boolean;
}

const ExperienceProfileComponent: React.FC<ExperienceProfileComponentProps> = ({
  isOwnProfile,
  experiences = []
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<string | null>(null);
  const [formData, setFormData] = useState<IExperience>({
    title: "",
    employmentType: "",
    company: "",
    startDate: null,
    endDate: null,
    location: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title?.trim()) errors.title = "Title is required";
    if (!formData.company?.trim()) errors.company = "Company is required";
    if (!formData.employmentType) errors.employmentType = "Employment type is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate)
      errors.endDate = "End date must be after start date";
    if (formData.description?.trim() && formData.description.length > 500)
      errors.description = "Description must be less than 500 characters";
    if (!formData.location?.trim()) errors.location = "Location is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveExperience = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm() || !user?._id) return;
      
      try {
        if (editingIndex !== null) {
          const response = await api.put(`/api/users/profile/experience/${user._id}/${editingIndex}`,  formData );
          dispatch(updateUserProfileExperience(response.data))

        } else {
          console.log(formData)
          const response = await api.post(`/api/users/profile/experience/${user._id}`,  formData );
          dispatch(updateUserProfileExperience(response.data))
        }
        setIsDialogOpen(false);
        setEditingIndex(null);
        setFormData({
          title: "",
          employmentType: "",
          company: "",
          startDate: null,
          endDate: null,
          location: "",
          description: "",
        });
      } catch (error) {
        console.error("Failed to save experience:", error);
      }
    },
    [editingIndex, formData, user?._id]
  );

  const handleDeleteExperience = async (id: string) => {
    if (!user?._id) return;
    try {
      const response = await api.delete(`/api/users/delete/profile-experience/${user._id}/${id}`);
      dispatch(updateUserProfileExperience(response.data))

      // Handle successful deletion (e.g., refresh the experiences list)
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const handleStartEdit = useCallback(
    (index: string, experience: ExperienceWithId) => {
      setEditingIndex(index);
      setFormData({
        ...experience,
        startDate: experience.startDate ? new Date(experience.startDate) : null,
        endDate: experience.endDate ? new Date(experience.endDate) : null,
      });
      setFormErrors({});
      setIsDialogOpen(true);
    },
    []
  );

  const handleStartNew = useCallback(() => {
    setEditingIndex(null);
    setFormData({
      title: "",
      employmentType: "",
      company: "",
      startDate: null,
      endDate: null,
      location: "",
      description: "",
    });
    setFormErrors({});
    setIsDialogOpen(true);
  }, []);

  const handleInputChange = useCallback(
    (field: keyof IExperience) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({
          ...prev,
          [field]: value,
        }));
      },
    []
  );

  const handleDateChange = useCallback(
    (field: "startDate" | "endDate") => (date: Date | null) => {
      setFormData((prev) => ({
        ...prev,
        [field]: date,
      }));
    },
    []
  );

  const handleEmploymentTypeChange = useCallback((type: string) => {
    setFormData((prev) => ({
      ...prev,
      employmentType: type,
    }));
  }, []);

  const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
    error?: string;
  }> = useCallback(
    ({ label, children, error }) => (
      <div className="space-y-2">
        <Label>{label}</Label>
        {children}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    ),
    []
  );

  const ExperienceDisplay: React.FC<ExperienceDisplayProps> = useCallback(
    ({ expobj, index, onEdit, onDelete, isOwnProfile }) => (
      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{expobj.title}</h3>
            <p className="text-gray-600">{expobj.company}</p>
            <p className="text-sm text-gray-500">
              {formatDate(expobj.startDate)} - {formatDate(expobj.endDate)}
            </p>
            <p className="text-sm text-gray-500">{expobj.location}</p>
            <p className="text-sm text-gray-600">{expobj.description}</p>
          </div>
          {isOwnProfile && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(index, expobj)}
                className="hover:bg-gray-100"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(expobj._id)}
                className="hover:bg-gray-100 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    ),
    [formatDate]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Experience</CardTitle>
        {isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStartNew}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Experience
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {experiences.map((experience) => (
          <ExperienceDisplay
            key={experience._id}
            expobj={experience}
            index={experience._id}
            onEdit={handleStartEdit}
            onDelete={handleDeleteExperience}
            isOwnProfile={isOwnProfile}
          />
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveExperience} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField label="Title" error={formErrors.title}>
                    <Input
                      value={formData.title}
                      onChange={handleInputChange("title")}
                    />
                  </FormField>

                  <FormField label="Employment Type" error={formErrors.employmentType}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full">
                          {formData.employmentType || 'Select Employment Type'}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["Full-Time", "Part-Time", "Contract", "Internship"].map(type => (
                          <DropdownMenuItem key={type} onClick={() => handleEmploymentTypeChange(type)}>
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormField>

                  <FormField label="Company" error={formErrors.company}>
                    <Input
                      value={formData.company}
                      onChange={handleInputChange("company")}
                    />
                  </FormField>

                  <FormField label="Location" error={formErrors.location}>
                    <Input
                      value={formData.location}
                      onChange={handleInputChange("location")}
                    />
                  </FormField>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Start Date" error={formErrors.startDate}>
                      <DatePickerDemo
                        value={formData.startDate}
                        onChange={handleDateChange("startDate")}
                      />
                    </FormField>

                    <FormField label="End Date" error={formErrors.endDate}>
                      <DatePickerDemo
                        value={formData.endDate}
                        onChange={handleDateChange("endDate")}
                      />
                    </FormField>
                  </div>

                  <FormField label="Description" error={formErrors.description}>
                    <Textarea
                      value={formData.description}
                      onChange={handleInputChange("description")}
                      placeholder="Describe your experience"
                      className="resize-none h-[150px]"
                    />
                  </FormField>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ExperienceProfileComponent;
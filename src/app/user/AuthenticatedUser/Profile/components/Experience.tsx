import React, { useState, useCallback } from "react";
import {useAppDispatch,useAppSelector,RootState,} from "../../../../store/store";
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
import { PencilIcon, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface IExperience {
  title?: string;
  employmentType?: string;
  company?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  location?: string;
  description?: string;
}

interface ExperienceProfileComponentProps {
  isOwnProfile: boolean;
}

const ExperienceProfileComponent: React.FC<ExperienceProfileComponentProps> = ({
  isOwnProfile,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: RootState) => state.auth);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<IExperience>({
    title: "",
    employmentType: "",
    company: "",
    startDate: null,
    endDate: null,
    location: "",
    description: "",
  });

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleSaveExperience = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (editingIndex !== null) {
          // await dispatch(updateExperience({ index: editingIndex, updatedData: formData }));
        } else {
          // await dispatch(createExperience(formData));
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
    [editingIndex, formData, dispatch]
  );

  const handleStartEdit = useCallback(
    (index: number, experience: IExperience) => {
      setEditingIndex(index);
      setFormData(experience);
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

  const FormField = useCallback(
    ({ label, children }: { label: string; children: React.ReactNode }) => (
      <div className="space-y-2">
        <Label>{label}</Label>
        {children}
      </div>
    ),
    []
  );

  const ExperienceDisplay = useCallback(
    ({ experience, index }: { experience: IExperience; index: number }) => (
      <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{experience.title}</h3>
            <p className="text-gray-600">{experience.company}</p>
            <p className="text-sm text-gray-500">
              {formatDate(experience.startDate)} -{" "}
              {formatDate(experience.endDate)}
            </p>
            <p className="text-sm text-gray-500">{experience.location}</p>
            <p className="text-sm text-gray-600">{experience.description}</p>
          </div>
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleStartEdit(index, experience)}
              className="hover:bg-gray-100"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    ),
    [handleStartEdit, isOwnProfile]
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
        {user?.profile?.Experience?.map((experience, index) => (
          <ExperienceDisplay
            key={`experience-${index}`}
            experience={experience}
            index={index}
          />
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingIndex !== null ? "Edit Experience" : "Add Experience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveExperience} className="space-y-4 mt-4">
              <FormField label="Title">
                <Input
                  value={formData.title || ""}
                  onChange={handleInputChange("title")}
                  required
                />
              </FormField>

              <FormField label="Employment Type">
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

              <FormField label="Company">
                <Input
                  value={formData.company || ""}
                  onChange={handleInputChange("company")}
                  required
                />
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date">
                  <DatePickerDemo
                    value={formData.startDate ?? null}
                    onChange={handleDateChange("startDate")}
                  />
                </FormField>

                <FormField label="End Date">
                  <DatePickerDemo
                    value={formData.endDate ?? null}
                    onChange={handleDateChange("endDate")}
                  />
                </FormField>
              </div>

              <FormField label="Location">
                <Input
                  value={formData.location || ""}
                  onChange={handleInputChange("location")}
                />
              </FormField>

              <FormField label="Description">
                <Textarea
                  value={formData.description || ""}
                  onChange={handleInputChange("description")}
                  placeholder="Describe your experience"
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

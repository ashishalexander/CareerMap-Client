// lib/formValidation.ts

import { useState } from "react";

interface FormData {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  role: "user" | "recruiter";
  password: string;
  confirmPassword: string;
}

const useFormValidation = (initialState: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [errors, setErrors] = useState<Record<keyof FormData, string>>(
    {} as Record<keyof FormData, string>
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validators = {
    firstName: (value: string) => {
      if (!value.trim()) return "First name is required";
      if (value.length < 2) return "First name must be at least 2 characters";
      return "";
    },
    lastName: (value: string) => {
      if (!value.trim()) return "Last name is required";
      if (value.length < 2) return "Last name must be at least 2 characters";
      return "";
    },
    email: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) return "Email is required";
      if (!emailRegex.test(value)) return "Invalid email address";
      return "";
    },
    mobile: (value: string) => {
      const mobileRegex = /^\+?\d{10,15}$/;
      if (!value) return "Mobile number is required";
      if (!mobileRegex.test(value)) return "Invalid mobile number";
      return "";
    },
    password: (value: string) => {
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/\d/.test(value)) return "Password must contain at least one number";
      if (!/[a-z]/.test(value))
        return "Password must contain at least one lowercase letter";
      if (!/[A-Z]/.test(value))
        return "Password must contain at least one uppercase letter";
      return "";
    },
    confirmPassword: (value: string) => {
      if (!value) return "Please confirm your password";
      if (value !== formData.password) return "Passwords do not match";
      return "";
    },
    role: (value: string) => {
      if (!value) return "Please select a role";
      if (value !== "user" && value !== "recruiter")
        return "Invalid role selected";
      return "";
    },
  };

  const validateField = (name: keyof FormData, value: string): string => {
    return validators[name](value);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<keyof FormData, string> = {} as Record<
      keyof FormData,
      string
    >;
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    const error = validateField(name as keyof FormData, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return {
    formData,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
    setIsSubmitting,
  };
};

export { useFormValidation };
export type { FormData };

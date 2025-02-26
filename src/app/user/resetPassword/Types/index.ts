
export interface PasswordRequirements {
    minLength: boolean;
    hasNumber: boolean;
    hasLowercase: boolean;
    hasUppercase: boolean;
  }
  
  export interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
  }
  
  export interface FormErrors {
    password: string[];
    confirmPassword: string;
  }
  
  export interface ResetPasswordResponse {
    success?: boolean;
    message?: string;
  }
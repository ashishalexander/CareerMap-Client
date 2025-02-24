import { User, Mail, Phone, Lock } from 'lucide-react';

export const useFormFields = () => {
  const fields = [
    {
      name: 'firstName' as const,
      label: 'First Name',
      type: 'text',
      placeholder: 'John',
      Icon: User,
    },
    {
      name: 'lastName' as const,
      label: 'Last Name',
      type: 'text',
      placeholder: 'Doe',
      Icon: User,
    },
    {
      name: 'email' as const,
      label: 'Email Address',
      type: 'email',
      placeholder: 'john.doe@example.com',
      Icon: Mail,
    },
    {
      name: 'mobile' as const,
      label: 'Mobile Number',
      type: 'tel',
      placeholder: '+1 (555) 000-0000',
      Icon: Phone,
    },
    {
      name: 'password' as const,
      label: 'Password',
      type: 'password',
      placeholder: '••••••••',
      Icon: Lock,
    },
    {
      name: 'confirmPassword' as const,
      label: 'Confirm Password',
      type: 'password',
      placeholder: '••••••••',
      Icon: Lock,
    },
  ];

  return { fields };
};
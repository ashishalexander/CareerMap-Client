import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusMessageProps {
  successMessage: string | null;
  errorMessage: string | null;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({ successMessage, errorMessage }) => {
  if (!successMessage && !errorMessage) return null;

  if (successMessage) {
    return (
      <div className="p-4 rounded-md bg-green-50 border border-green-200 flex items-start">
        <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
        <p className="text-sm text-green-800">{successMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start">
      <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
      <p className="text-sm text-red-800">{errorMessage}</p>
    </div>
  );
};

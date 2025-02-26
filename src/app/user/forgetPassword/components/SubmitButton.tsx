import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting }) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? (
        <span className="flex items-center">
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
          Sending Reset Link...
        </span>
      ) : (
        'Send Reset Link'
      )}
    </button>
  );
};
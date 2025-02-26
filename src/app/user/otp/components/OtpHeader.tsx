import { CheckCircle2 } from 'lucide-react';

export const OtpHeader: React.FC = () => {
  return (
    <div className="text-center">
      <div className="inline-flex p-4 bg-emerald-100 rounded-full mb-4">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">
        Authentication Required
      </h1>
      <p className="mt-3 text-gray-600">
        We&apos;ve sent a 4-digit code to your registered email. Please
        enter it below.
      </p>
    </div>
  );
};
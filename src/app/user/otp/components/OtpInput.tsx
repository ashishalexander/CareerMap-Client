import React from 'react';
import { Timer, Send } from 'lucide-react';

interface OtpInputProps {
  otp: string[];
  timer: number;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  handleChange: (element: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  handleResend: () => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  otp,
  timer,
  inputRefs,
  handleChange,
  handleKeyDown,
  handleResend,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <label className="text-sm font-medium text-gray-700">
        Enter Verification Code
      </label>
      <div className="flex justify-center space-x-4">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            className="w-16 h-16 text-center text-2xl font-bold border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
          />
        ))}
      </div>
      <div className="flex justify-center">
        {timer > 0 ? (
          <div className="flex items-center text-gray-600 space-x-2">
            <Timer className="w-5 h-5 text-emerald-500" />
            <span className="text-sm">
              Resend available in{" "}
              <span className="font-bold">{timer}s</span>
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors duration-300"
          >
            <Send className="w-4 h-4 mr-2" />
            Resend Code
          </button>
        )}
      </div>
    </div>
  );
};

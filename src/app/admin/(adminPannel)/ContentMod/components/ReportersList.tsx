import React from 'react';
import { Reporter } from '../Types/index';
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ReportersListProps {
  reporters: Reporter[];
}

export const ReportersList: React.FC<ReportersListProps> = ({ reporters }) => (
  <div className="mt-3 text-sm text-gray-500">
    <p>
      <span className="font-medium">Reported By:</span>{' '}
      <span className="flex items-center gap-2">
        {reporters.slice(0, 3).map((reporter) => (
          <div key={reporter._id} className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={reporter.profile.profilePicture} />
            </Avatar>
            <div>
              <span className="font-medium">{reporter.email.split('@')[0]}</span>
            </div>
          </div>
        ))}
        {reporters.length > 3 && (
          <span className="text-gray-500">
            +{reporters.length - 3} more
          </span>
        )}
      </span>
    </p>
  </div>
);
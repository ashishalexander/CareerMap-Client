import React from 'react';
import { MapPin, Briefcase, PenSquare } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Iuser } from '@/const/Iuser';

export const UserProfile: React.FC<{ user: Iuser }> = ({ user }) => {
  return (
    <Card className="mb-4">
      <div className="relative">
        <img
          src={user?.profile?.bannerImage || 'https://devtool.tech/api/placeholder/800/300'}
          alt={`${user?.firstName} ${user?.lastName}'s banner image`}
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="absolute top-24 left-4">
          <img
            src={user?.profile?.profilePicture || 'https://devtool.tech/api/placeholder/80/80'}
            alt={'profile picture'}
            className="w-20 h-20 rounded-full border-4 border-white"
          />
        </div>
      </div>

      <CardContent className="pt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-medium text-base">{`${user?.firstName} ${user?.lastName}`}</h3>
            <p className="text-gray-500">{user?.profile?.headline || user?.role}</p>
          </div>
        </div>

        <p className="mb-4">{user?.profile?.about}</p>

        <div className="flex flex-col items-start gap-2  text-gray-500">
          <span className="flex items-center gap-2 text-sm">
            <MapPin size={16} />
            {user?.profile?.location || 'Not provided'}
          </span>
          <span className="flex items-center gap-2 text-sm">
            <Briefcase size={16} />
            {user?.profile?.company || 'Not provided'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
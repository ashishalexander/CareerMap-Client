'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Users, CheckCircle } from 'lucide-react';
import { users } from '../types/network';
import Link from 'next/link';

interface ConnectionCardProps {
  user: users;
  onConnect: (userId: string) => void;
}

export function ConnectionCard({ user, onConnect }: ConnectionCardProps) {
  const handleConnectClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking connect button
    onConnect(user._id);
  };

  return (
    <Link 
      href={`/user/ProfileDynamicRouting/${user._id}`} 
      className="block transition-opacity hover:opacity-95"
      prefetch={true}
    >
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
        {/* Banner Image */}
        <div className="h-24 bg-gray-100 relative">
          {user.profile.bannerImage ? (
            <img 
              src={user.profile.bannerImage} 
              alt={`${user.firstName}'s banner`} 
              className="w-full h-full object-cover absolute inset-0"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-200 to-blue-400 opacity-50"></div>
          )}
        </div>

        {/* Profile Content */}
        <CardContent className="p-6 pt-0 relative">
          {/* Profile Image */}
          <div 
            className="
              -mt-8 mb-3 h-16 w-16 rounded-full border-4 border-white 
              bg-gray-100 flex items-center justify-center overflow-hidden
              shadow-md group-hover:shadow-lg transition-shadow
            "
          >
            {user.profile.profilePicture ? (
              <img 
                src={user.profile.profilePicture} 
                alt={user.firstName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <Users className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {/* User Details */}
          <div>
            <h3 className="font-semibold text-lg">{user.firstName+" "+user.lastName}</h3>
            <p className="text-sm text-gray-600 mb-1">{user.profile.headline}</p>
            {user.profile.company && (
              <p className="text-sm text-gray-500 mb-1">{user.profile.company}</p>
            )}
            {user.profile.location && (
              <p className="text-sm text-gray-500 mb-1">{user.profile.location}</p>
            )}

            {/* Action Buttons with Connection Status */}
            <div className="flex gap-2">
              {user.connectionStatus === 'pending' ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1 flex-1 cursor-default"
                  disabled
                >
                  <CheckCircle className="h-4 w-4 text-yellow-700 animate-pulse" />
                  Requested
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={handleConnectClick}
                  className="flex items-center gap-1 flex-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Connect
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 flex-1"
              >
                <Users className="h-4 w-4" />
                View Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, UserX, Users } from 'lucide-react';
import { User } from '../types/network';

interface ConnectionCardProps {
  user: User;
  onConnect: (userId: string) => void;
  onIgnore: (userId: string) => void;
}

export function ConnectionCard({ user, onConnect, onIgnore }: ConnectionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <Users className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.title}</p>
              {user.company && (
                <p className="text-sm text-gray-500">{user.company}</p>
              )}
              {user.location && (
                <p className="text-sm text-gray-500">{user.location}</p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                {user.mutualConnections} mutual connections
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="default" 
              size="sm"
              onClick={() => onConnect(user.id)}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              Connect
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onIgnore(user.id)}
              className="flex items-center gap-1"
            >
              <UserX className="h-4 w-4" />
              Ignore
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


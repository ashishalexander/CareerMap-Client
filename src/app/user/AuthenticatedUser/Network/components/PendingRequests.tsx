import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PendingRequestDetails } from '../types/network';
import { formatDistanceToNow } from 'date-fns';
import { UserPlus2, X } from 'lucide-react';

interface PendingRequestsProps {
  requests: PendingRequestDetails[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function PendingRequests({ requests, onAccept, onReject }: PendingRequestsProps) {
  if (requests.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Network Requests</h2>
      <div className="space-y-6">
        {requests?.map((request) => (
          <Card key={request._id} className="border border-gray-200 hover:border-gray-300 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20 rounded">
                  {request.profilePicture ? (
                    <AvatarImage 
                      src={request.profilePicture} 
                      alt={`${request.firstName} ${request.lastName}`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                      {request.firstName[0]}{request.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-gray-900 hover:underline cursor-pointer">
                        {request.firstName} {request.lastName}
                      </h3>
                      
                      {request.headline && (
                        <p className="text-base text-gray-600 font-medium">
                          {request.headline}
                        </p>
                      )}
                      
                      <div className="flex flex-col gap-1 text-sm text-gray-500">
                        {request.company && (
                          <span>{request.company}</span>
                        )}
                        {request.location && (
                          <span>{request.location}</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 pt-2">
                        Requested {formatDistanceToNow(new Date(request.sentAt))} ago
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        variant="default"
                        size="lg"
                        className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6"
                        onClick={() => onAccept(request._id)}
                      >
                        <UserPlus2 className="w-4 h-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        size="lg"
                        className="border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6"
                        onClick={() => onReject(request._id)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Ignore
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PendingRequests;
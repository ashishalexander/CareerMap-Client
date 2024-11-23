'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConnectionRequest } from '../types/network';

interface PendingRequestsProps {
  requests: ConnectionRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function PendingRequests({ requests, onAccept, onReject }: PendingRequestsProps) {
  if (requests.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{request.name}</p>
                  <p className="text-sm text-gray-500">{request.title}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => onAccept(request.id)}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => onReject(request.id)}>Reject</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


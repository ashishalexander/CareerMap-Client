export interface User {
    id: string;
    name: string;
    title: string;
    profileImage?: string;
    company?: string;
    location?: string;
    connectionStatus: 'none' | 'pending' | 'connected';
    mutualConnections: number;
  }

export interface ConnectionRequest {
name: string;
title: string;
id: string;
sender: User;
sentAt: string;
status: 'pending' | 'accepted' | 'rejected';
}
  
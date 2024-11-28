export interface User {
    _id: string;
    name: string;
    title: string;
    firstname:string;
    profileImage?: string;
    bannerImage?:string;
    company?: string;
    bio?:string
    location?: string;
    connectionStatus: 'none' | 'pending' | 'connected';
    mutualConnections: number;
  }

export interface ConnectionRequest {
name: string;
title: string;
_id: string;
sender: User;
sentAt: string;
status: 'pending' | 'accepted' | 'rejected';
}

export interface userprofile {
  headline: string;
  profilePicture: string;
  bannerImage: string;
  location: string;
  company: string;
}

export interface users {
  _id: string;
  firstName: string;
  lastName: string;
  profile: userprofile;
}

export interface SuggestionsResponse {
  suggestions: users[];
  nextPage: number | null;
  total: number;
}

export interface FetchRequestResponse{
  requests:PendingRequestDetails[]
}

export interface PendingRequestDetails {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string | null;
  headline?: string | null;
  location?: string | null;
  company?: string | null;
  sentAt: Date;
}
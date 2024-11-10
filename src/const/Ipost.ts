import { Iuser } from "./Iuser";

export interface Ipost {
  id: string;
  author: Iuser;
  content: string;
  mediaUrls?:  {
    type: 'image' | 'video';
    url: string;
  }[];
  likes: Ilike[];
  comments: Icomment[];
  shares: Ishare[];
  repostedFrom?: Ipost;
  createdAt: Date;
  updatedAt?: Date;
  isPinned?: boolean;
}

export interface Icomment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  replies?: Icomment[]; // Nested comments if supporting threaded replies
}

export interface Ilike {
  userId: string;
  likedAt: Date;
}

export interface Ishare {
  userId: string;
  sharedAt: Date;
}

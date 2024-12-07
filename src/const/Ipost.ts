import { Iuser } from "./Iuser";

export interface IpostCreate {
  author: string;
  text?:string;
  media?: {
    type: 'image'; 
    file:File;   
    description?: string; 
  };
  createdAt: Date;

}

export interface Icomment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Ilike {
  userId: string;
  likedAt: Date;
}

interface author{
  _id:string;
  firstName:string;
  lastName:string;
  profile:{
    profilePicture:string
  }
}

export interface IPost {
  _id:string;
  author: author; 
  text?: string;
  media?: {
    type: 'image'; 
    url: string;
    description?: string; 
  }[];
  likes: Ilike[];
  comments: Icomment[];
  createdAt: string; 
  updatedAt: string; 
}
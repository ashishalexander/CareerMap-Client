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


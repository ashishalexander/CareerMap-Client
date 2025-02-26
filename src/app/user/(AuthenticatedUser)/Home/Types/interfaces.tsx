// Types
export interface IProfile {
    profilePicture?: string;
    headline?:string;
}
  
 export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    role?: string;
    profile: IProfile;
  }
  
 export  interface ILike {
    userId: string;
  }
  
 export interface IComment {
    _id: string;
    content: string;
    user: IUser;
    createdAt: string;
  }
  
export   interface IMedia {
    type: string;
    url: string;
    description?: string;
  }
  
 export  interface IPost {
    _id: string;
    text: string;
    author: IUser;
    likes: ILike[];
    comments: IComment[];
    media?: IMedia[];
    createdAt: string;
  }
  
  export interface PostResponse {
    posts: IPost[];
    nextPage?: number;
  }
  
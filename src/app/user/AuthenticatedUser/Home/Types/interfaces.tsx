// Types
interface IProfile {
    profilePicture?: string;
}
  
  interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    role?: string;
    profile: IProfile;
  }
  
  interface ILike {
    userId: string;
  }
  
  interface IComment {
    _id: string;
    content: string;
    user: IUser;
    createdAt: string;
  }
  
  interface IMedia {
    type: string;
    url: string;
    description?: string;
  }
  
  interface IPost {
    _id: string;
    text: string;
    author: IUser;
    likes: ILike[];
    comments: IComment[];
    media?: IMedia[];
    createdAt: string;
  }
  
  interface PostResponse {
    posts: IPost[];
    nextPage?: number;
  }
  
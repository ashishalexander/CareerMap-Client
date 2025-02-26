import { Iuser } from "@/const/Iuser";

export interface SignInCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthState {
    user: Iuser | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
  }
export interface MediaItem {
    type: string;
    url: string;
    _id: string;
  }
  
  export interface Profile {
    profilePicture: string;
  }
  
  export interface Reporter {
    _id: string;
    email: string;
    profile: Profile;
  }
  
  export interface Post {
    _id: string;
    text: string;
    media?: MediaItem[];
    isDeleted: boolean;
  }
  
  export interface Report {
    _id: string;
    reason: string;
    details?: string;
    timestamp: string;
    status: 'pending' | 'reviewed' | 'ignored' | 'action_taken';
    postId: Post;
    reportedBy: Reporter;
    adminResponse?: string;
  }
  
  export interface ConsolidatedReport {
    postId: Post;
    reports: Report[];
    totalReports: number;
    uniqueReasons: string[];
  }
  
  export interface Filters {
    status: string;
    page: number;
    limit: number;
  }
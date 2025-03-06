import api from '../../../../lib/axios-config';
import { PostResponse } from '../Types/interfaces';

export interface ReportPostData {
    postId: string;
    userId: string;
    reason: string;
    details?: string;
    timestamp?: string;
  }

export const postApi = {
  /**
   * Create a new user post
   * @param userId - The ID of the user creating the post
   * @param postData - FormData containing post information
   * @returns Promise resolving to the created post
   */
  createPost: (userId: string, postData: FormData) => {
    return api.post(`/api/users/activity/new-post/${userId}`, postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Create a new job post
   * @param userId - The ID of the recruiter creating the job post
   * @param jobPostData - Job post data object
   * @returns Promise resolving to the created job post
   */
  createJobPost: (userId: string, jobPostData: any) => {
    return api.post(`/api/users/activity/JobPost/${userId}`, {
      ...jobPostData,
      recruiter: userId
    });
  },

  /**
   * Add a comment to a post
   * @param postId - The ID of the post to comment on
   * @param content - The comment content
   * @param userId - The ID of the user adding the comment
   * @returns Promise resolving to the added comment
   */
  addComment: (postId: string, content: string, userId: string) => {
    return api.post(`/api/users/Feeds/${postId}/comment`, {
      content,
      userId
    });
  },

   /**
   * Report a post
   * @param reportData - The data for reporting a post
   * @returns Promise resolving to the report submission result
   */
   reportPost: (reportData: ReportPostData) => {
    return api.post('/api/users/posts/report', {
      ...reportData,
      timestamp: new Date().toISOString()
    });
  },

   /**
   * Toggle like on a post
   * @param postId - The ID of the post
   * @param userId - The ID of the user
   * @param isLiked - Current like status
   * @returns Promise resolving to like action result
   */
   toggleLike: (postId: string, userId: string, isLiked: boolean) => {
    return isLiked 
      ? api.delete(`/api/users/Feeds/${postId}/like/${userId}`)
      : api.post(`/api/users/Feeds/${postId}/like/${userId}`);
  },

  /**
   * Fetch posts for a user's feed
   * @param userId - The ID of the user
   * @param page - Page number for pagination
   * @param limit - Number of posts per page
   * @returns Promise resolving to post response
   */
  fetchPosts: (userId: string, page: number = 1, limit: number = 10): Promise<any> => {
    return api.get<PostResponse>(`/api/users/home/feeds/${userId}`, {
      params: {
        page,
        limit
      }
    });
  },

};

export default postApi;
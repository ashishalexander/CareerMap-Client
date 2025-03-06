import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IPost, IUser } from '../Types/interfaces';
import postApi from '../service';

interface CommentSectionProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPost;
  user: IUser;
}



const addComment = async ({ postId, content, userId }: { postId: string; content: string; userId: string }) => {
  try {
    const response = await postApi.addComment(postId, content, userId);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const CommentSection: React.FC<CommentSectionProps> = ({ isOpen, onClose, post, user }) => {
  const [newComment, setNewComment] = useState('');
  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: addComment,
    onMutate: async ({ postId, content }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', user._id] });
      const previousPosts = queryClient.getQueryData(['posts', user._id]);

      queryClient.setQueryData(['posts', user._id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((p: IPost) => 
              p._id === postId 
                ? {
                    ...p,
                    comments: [...p.comments, {
                      _id: `temp-${Date.now()}`,
                      content,
                      author: user,
                      createdAt: new Date().toISOString()
                    }]
                  }
                : p
            )
          }))
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      console.error('Comment mutation error:', err);
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', user._id], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', user._id] });
    }
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
       commentMutation.mutate({
        postId: post._id,
        content: newComment.trim(),
        userId: user._id
      });
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div 
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out bg-white border border-gray-100 rounded-b-xl",
        isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Comments ({post.comments.length})</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close comments"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4">
          {post.comments.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
          ) : (
            post.comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={comment.user?.profile?.profilePicture} 
                    alt={`${comment.user?.firstName}'s avatar`} 
                  />
                  <AvatarFallback>
                    {comment.user?.firstName[0]}
                    {comment.user?.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">
                      {comment.user?.firstName} {comment.user?.lastName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={user.profile.profilePicture} 
                alt={`${user.firstName}'s avatar`} 
              />
              <AvatarFallback>
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={commentMutation.isPending}
            />
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit"
              size="sm"
              disabled={!newComment.trim() || commentMutation.isPending}
            >
              {commentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Comment'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
import { useAppSelector, RootState } from '../../../../store/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageCircle, Send, Trash2 } from 'lucide-react';
import api from '@/app/lib/axios-config';
import { IPost } from "../../../../../const/Ipost";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ActivityProfileComponentProps {
  isOwnProfile: boolean;
}

const ActivityProfileComponent: React.FC<ActivityProfileComponentProps> = ({ isOwnProfile }) => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const user = useAppSelector((state: RootState) => state.auth.user);

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await api.get(`/api/users/profile/activity/${user?._id}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id) {
      fetchUserPosts();
    }
  }, [fetchUserPosts]);

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      await api.delete(`/api/posts/delete/${postToDelete}`);
      
      // Remove the deleted post from the list
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete));
      
      // Close dialogs
      setIsDeleteDialogOpen(false);
      setIsPostDialogOpen(false);
      setSelectedPost(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/api/posts/comment/${postId}`, {
        userId: user?._id,
        text: newComment
      });

      // Update the selected post with new comments
      if (selectedPost) {
        setSelectedPost({
          ...selectedPost,
          comments: response.data.comments
        });
      }

      // Update the posts list
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );

      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await api.post(`/api/posts/like/${postId}/${user?._id}`);
      
      // Update posts with the liked post
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data : post
        )
      );

      // Update selected post if it's the same post
      if (selectedPost && selectedPost._id === postId) {
        setSelectedPost(response.data);
      }
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const PostPreview: React.FC<{ post: IPost }> = ({ post }) => (
    <div 
      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-3 cursor-pointer relative"
      onClick={() => {
        setSelectedPost(post);
        setIsPostDialogOpen(true);
      }}
    >
      <div className="flex items-start space-x-3">
        <Avatar>
          <AvatarImage src={user?.profile?.profilePicture || '/default-avatar.png'} />
          <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{user?.firstName}</h4>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setPostToDelete(post._id);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4 text-black" />
              </Button>
            )}
          </div>
          
          <p className="mt-2 text-gray-700 line-clamp-2">{post.text}</p>
          
          {post.media && post.media.length > 0 && (
            <div className="mt-3 max-h-40 overflow-hidden">
              {post.media.map((mediaItem, index) => (
                mediaItem.type === 'image' && (
                  <img 
                    key={index}
                    src={mediaItem.url} 
                    alt={mediaItem.description}
                    className="max-w-full rounded-lg object-cover"
                  />
                )
              ))}
            </div>
          )}
          
          <div className="flex items-center mt-3 space-x-4 text-gray-600">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLikePost(post._id);
              }}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{post.likes.length} Likes</span>
            </Button>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments.length} Comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FullPostView = () => {
    if (!selectedPost) return null;

    return (
      <div className="flex h-[700px]">
        {/* Media Section */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          {selectedPost.media && selectedPost.media.length > 0 && (
            <img 
              src={selectedPost.media[0].url} 
              alt={selectedPost.media[0].description}
              className="max-h-full max-w-full object-contain"
            />
          )}
        </div>

        {/* Content and Comments Section */}
        <div className="w-1/2 flex flex-col p-6">
          {/* Post Content */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar>
              <AvatarImage src={user?.profile?.profilePicture || '/default-avatar.png'} />
              <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{user?.firstName}</h4>
              <p className="text-xs text-gray-500">{formatDate(selectedPost.createdAt)}</p>
            </div>
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto"
                onClick={() => {
                  setPostToDelete(selectedPost._id);
                  setIsDeleteDialogOpen(true);
                }}
              >
              </Button>
            )}
          </div>

          <p className="text-gray-700 mb-4">{selectedPost.text}</p>

          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost"
              onClick={() => handleLikePost(selectedPost._id)}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{selectedPost.likes.length} Likes</span>
            </Button>
          </div>

          {/* Comments Section */}
          <div className="flex-1 overflow-y-auto border-t pt-4">
            <h4 className="font-semibold mb-2">Comments</h4>
            {selectedPost.comments.length === 0 ? (
              <p className="text-gray-500 text-center">No comments yet</p>
            ) : (
              <ScrollArea className="h-[350px] pr-4">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      {/* <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.userId?.profilePicture || '/default-avatar.png'} />
                        <AvatarFallback>{comment.userId?.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar> */}
                      {/* <span className="font-semibold text-sm">{comment.userId?.firstName}</span> */}
                    </div>
                    <p className="text-gray-700 text-sm">{comment.content}</p>
                  </div>
                ))}
              </ScrollArea>
            )}
          </div>

          {/* Comment Input */}
          <div className="mt-4 flex items-center space-x-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="resize-none h-20"
            />
            <Button 
              size="icon" 
              variant="default"
              onClick={() => handleAddComment(selectedPost._id)}
              disabled={!newComment.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">No activity yet</p>
          ) : (
            posts.map((post) => (
              <PostPreview key={post._id} post={post} />
            ))
          )}

          <Dialog 
            open={isPostDialogOpen} 
            onOpenChange={(open) => {
              setIsPostDialogOpen(open);
              if (!open) setSelectedPost(null);
            }}
          >
            <DialogContent className="max-w-[1000px] h-[700px] p-0 overflow-hidden">
              {selectedPost && <FullPostView />}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ActivityProfileComponent;
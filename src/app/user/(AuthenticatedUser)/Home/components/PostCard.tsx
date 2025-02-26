import React, { useEffect, useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageSquare, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import api from '../../../../lib/axios-config';
import { useRouter } from 'next/navigation';
import { CommentSection } from './PostComment';
import { cn } from '@/lib/utils';
import { ReportModal } from './ReportPostModal';
import { PostResponse,IPost,IUser } from '../Types/interfaces';



const fetchPosts = async ({ pageParam = 1, userId }: { pageParam: number; userId: string }): Promise<PostResponse> => {
  try {
    const response = await api.get<PostResponse>(`/api/users/home/feeds/${userId}`, {
      params: {
        page: pageParam,
        limit: 10
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

const toggleLike = async ({ postId, isLiked, userId }: { postId: string; isLiked: boolean; userId: string }) => {
  try {
    const response = isLiked 
      ? await api.delete(`/api/users/Feeds/${postId}/like/${userId}`)
      : await api.post(`/api/users/Feeds/${postId}/like/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

interface PostFeedProps {
  user: IUser;
}

export const PostFeed: React.FC<PostFeedProps> = ({ user }) => {
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [reportingPostId, setReportingPostId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  // Authentication check
  useEffect(() => {
    if (!user) {
      router.push('/user/singIn');
    }
  }, [user, router]);

  // if (!user?._id) {
  //   return null;
  // }

  // Posts Query
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts', user?._id ],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, userId: user._id }),
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined,
    initialPageParam: 1,
    enabled: !!user?._id,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onMutate: async ({ postId, isLiked }) => {
      await queryClient.cancelQueries({ queryKey: ['posts', user?._id ] });
      const previousPosts = queryClient.getQueryData(['posts', user?._id ]);

      // Optimistically update the cache
      queryClient.setQueryData(['posts', user?._id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            posts: page.posts.map((post: IPost) => 
              post._id === postId 
                ? {
                    ...post,
                    likes: isLiked
                      ? post.likes.filter((like) => like.userId !== user._id)
                      : [...post.likes, { userId: user._id }]
                  }
                : post
            )
          }))
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      console.error('Like mutation error:', err);
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', user._id], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', user._id] });
    }
  });

  const handleLike = (post: IPost) => {
    console.log('Like button clicked', {
      postId: post._id,
      userId: user._id,
      isCurrentlyLiked: post.likes.some(like => like.userId === user._id)
    });

    likeMutation.mutate({
      postId: post._id,
      isLiked: post.likes.some(like => like.userId === user._id),
      userId: user._id
    });
  };

  // Loading Skeleton
  const renderSkeleton = () => (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[250px] w-full mt-6 rounded-lg" />
      </CardContent>
    </Card>
  );

  // Error State
  if (error) {
    return (
      <div className="text-center text-red-500 p-6 bg-red-50 rounded-lg">
        <p className="mb-4">Error loading posts</p>
        <button 
          onClick={() => fetchNextPage()}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Get flattened posts from all pages
  const posts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <div className="container mx-auto max-w-xl py-6">
      {posts.map((post) => (
        <Card
          key={post._id}
          className="mb-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6">
            {/* Post Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={
                    post.author.profile.profilePicture ||
                    "https://placehold.jp/30x40.png"
                  }
                  alt={`${post.author.firstName}'s profile`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="font-semibold text-lg">
                    {`${post.author.firstName} ${post.author.lastName}`}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {post.author.profile.headline || post.author.role}
                  </p>
                </div>
              </div>

              {/* Post Options */}
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <MoreVertical className="text-gray-500 hover:text-gray-700" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setReportingPostId(post._id)}
                  >
                    Report Post
                  </DropdownMenuItem>{" "}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <ReportModal
              isOpen={reportingPostId !== null}
              onClose={() => setReportingPostId(null)}
              postId={reportingPostId || ""}
              userId={user._id}
            />

            {/* Post Content */}
            <p className="text-gray-800 mb-6 leading-relaxed">{post.text}</p>

            {/* Media Section */}
            {post.media && post.media.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-4">
                {post.media.map((media, mediaIndex) => (
                  <div key={mediaIndex} className="rounded-lg overflow-hidden">
                    {media.type === "image" ? (
                      <div>
                        <img
                          src={media.url}
                          alt={media.description || "Post media"}
                          className="w-full object-cover max-h-[450px] rounded-lg"
                        />
                        {media.description && (
                          <p className="text-sm text-gray-600 mt-2 px-2">
                            {media.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <video
                        src={media.url}
                        controls
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between border-t pt-4">
              <button
                onClick={() => handleLike(post)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
              >
                <Heart
                  size={20}
                  className={`group-hover:scale-110 transition-transform ${
                    post.likes.some((like) => like.userId === user._id)
                      ? "fill-current text-red-500"
                      : ""
                  }`}
                />
                <span>{post.likes.length}</span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentPostId(
                    activeCommentPostId === post._id ? null : post._id
                  )
                }
                className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group"
              >
                <MessageSquare
                  size={20}
                  className={cn(
                    "group-hover:scale-110 transition-transform",
                    activeCommentPostId === post._id ? "text-blue-500" : ""
                  )}
                />
                <span>{post.comments.length}</span>
              </button>
            </div>
          </CardContent>
          <CommentSection
            isOpen={activeCommentPostId === post._id}
            onClose={() => setActiveCommentPostId(null)}
            post={post}
            user={user}
          />
        </Card>
      ))}

      {/* Loading States */}
      {isFetching && !isFetchingNextPage && (
        <>
          {renderSkeleton()}
          {renderSkeleton()}
        </>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center py-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More Posts"}
          </button>
        </div>
      )}

      {/* End of Feed Message */}
      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          You&apos;ve reached the end of your feed
        </div>
      )}
    </div>
  );
}; 
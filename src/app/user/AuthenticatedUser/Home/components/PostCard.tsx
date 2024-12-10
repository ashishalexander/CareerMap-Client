import React, { useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Share2, MessageSquare, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Ilike, IPost } from '@/const/Ipost';
import api from '../../../../lib/axios-config'
import { RootState, useAppSelector } from '../../../../store/store'
import { useRouter } from 'next/navigation';
import { Iuser } from '@/const/Iuser';

// API Functions
const fetchPosts = async ({ pageParam = 1, userId }: { pageParam: number, userId: string }) => {
  const response = await api.get(`/api/users/home/feeds/${userId}`, {
    params: {
      page: pageParam,
      limit: 10
    }
  });
  return response.data;
};

const likePost = async (postId: string) => {
  const response = await api.post(`/api/posts/${postId}/like`);
  return response.data;
};

export const PostFeed: React.FC<{user:Iuser}> = ({user}) => {
  const queryClient = useQueryClient();
  // const user = useAppSelector((state: RootState) => state.auth.user);
  const router = useRouter()

  useEffect(()=>{
    if(!user){
      router.push('/user/singIn')
    }
  },[user,router])

  let userId = user?._id
  if (!userId) {
    return null
  }
  // Infinite Query for Posts
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: ({ pageParam }) => fetchPosts({ pageParam, userId }),
    getNextPageParam: (lastPage, pages) => lastPage.nextPage || undefined,
    initialPageParam: 1,
    enabled: !!userId
  });

  // Like Post Mutation
  const likeMutation = useMutation({
    mutationFn: likePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts'] });
      
      const previousPosts = queryClient.getQueryData(['posts']);
      
      queryClient.setQueryData(['posts'], (oldData: any) => {
        const newData = { ...oldData };
        newData.pages = newData.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: IPost) => 
            post._id === postId 
              ? { 
                  ...post, 
                  likes: [...post.likes, { userId: 'current-user-id' }] 
                } 
              : post
          )
        }));
        return newData;
      });

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts'], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });

  // Render Loading Skeleton
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

  // Render Error State
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

  // Flatten posts from infinite query
  const posts = data?.pages.flatMap(page => page.posts) || [];

  return (
    <div className="container mx-auto max-w-xl  py-6">
      {posts.map((post) => (
        <Card key={post._id} className="mb-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            {/* Post Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <img 
                  src={post.author.profile.profilePicture || 'https://via.placeholder.com/50'} 
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
                  <DropdownMenuItem className="cursor-pointer">Report Post</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">Hide Post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Post Content */}
            <p className="text-gray-800 mb-6 leading-relaxed">{post.text}</p>

            {/* Media Section */}
            {post.media?.length > 0 && (
              <div className="mb-6 grid grid-cols-1 gap-4">
                {post.media.map((media:{type:string,url:string,description:string}, mediaIndex:number) => (
                  <div key={mediaIndex} className="rounded-lg overflow-hidden">
                    {media.type === 'image' ? (
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
                onClick={() => likeMutation.mutate(post.id)}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group"
              >
                <Heart 
                  size={20} 
                  className={`group-hover:scale-110 transition-transform ${
                    post.likes.some((like:Ilike) => like.userId === 'current-user-id') 
                      ? 'fill-current text-red-500' 
                      : ''
                  }`}
                />
                <span>{post.likes.length}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors group">
                <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                <span>{post.comments.length}</span>
              </button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Loading Indicators */}
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
            {isFetchingNextPage ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
          You've reached the end of your feed
        </div>
      )}
    </div>
  );
};
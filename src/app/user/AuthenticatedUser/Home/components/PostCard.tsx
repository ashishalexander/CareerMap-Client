import React from 'react';
import { Heart, Share2, MessageSquare } from 'lucide-react';
import { Ipost } from '@/const/Ipost';
import { Card, CardContent } from '@/components/ui/card';

// Post Card Component
export const PostCard: React.FC<{ post: Ipost }> = ({ post }) => {
  return (
    <Card className="mb-4 border rounded-lg shadow-sm">
      <CardContent>
        {/* Author Section */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={post.author.profile.profilePicture || 'https://via.placeholder.com/40x40.png/cccccc/000000?Text=User'} 
            alt={`${post.author.firstName} `} 
            className="w-10 h-10 rounded-full" 
          />
          <div>
            <h3 className="font-semibold text-gray-800">{`${post.author.firstName} ${post.author.lastName}`}</h3>
            <p className="text-sm text-gray-500">{post.author.profile.headline || post.author.role}</p>
          </div>
        </div>

        {/* Post Content */}
        <p className="mb-4 text-gray-700">{post.content}</p>

        {/* Media Section */}
        {post.mediaUrls && (
          <div className="mb-4">
            {post.mediaUrls.map((media, index) => (
              media.type === 'image' ? (
                <img 
                  key={index} 
                  src={media.url} 
                  alt="Post media" 
                  className="rounded w-full h-auto max-h-[300px] object-cover" 
                  style={{ width: '600px', height: '800px' }} // Set fixed dimensions

                />
              ) : (
                <video 
                  key={index} 
                  src={media.url} 
                  controls 
                  className="rounded w-full max-h-[300px] object-cover"
                  style={{ width: '600px', height: '800px' }} // Set fixed dimensions

                />
              )
            ))}
          </div>
        )}

        

        {/* Action Buttons */}
        <div className="flex items-center gap-6 pt-4 border-t">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Heart size={20} />
            <span>{post.likes.length}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Share2 size={20} />
            <span>{post.shares.length}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <MessageSquare size={20} />
            <span>{post.comments.length}</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

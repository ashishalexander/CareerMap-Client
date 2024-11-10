import React, { useState } from 'react';
import { Camera, Video, Briefcase } from 'lucide-react';

export const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <img src="/api/placeholder/40/40" alt="User avatar" className="rounded-full" />
        <input
          type="text"
          placeholder="Start a post"
          className="w-full rounded-full border px-4 py-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded">
          <Camera size={20} />
          <span>Photo</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded">
          <Video size={20} />
          <span>Video</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 p-2 rounded">
          <Briefcase size={20} />
          <span>Job</span>
        </button>
      </div>
    </div>
  );
};
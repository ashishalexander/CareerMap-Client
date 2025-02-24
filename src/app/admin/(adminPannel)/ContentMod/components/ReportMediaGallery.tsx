import React from 'react';
import { MediaItem } from '../Types/index';

interface ReportMediaGalleryProps {
  media: MediaItem[];
  isDeleted: boolean;
}

export const ReportMediaGallery: React.FC<ReportMediaGalleryProps> = ({ media, isDeleted }) => (
  <div className="mt-2 grid grid-cols-2 gap-2">
    {media.map((mediaItem) => (
      <img 
        key={mediaItem._id}
        src={mediaItem.url} 
        alt={`${mediaItem.type} content`}
        className={`max-h-40 rounded object-cover w-full ${isDeleted ? "opacity-50" : ""}`}
      />
    ))}
  </div>
);
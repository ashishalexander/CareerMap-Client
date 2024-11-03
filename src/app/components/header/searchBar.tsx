import { Search } from 'lucide-react';
import React from 'react';

export const SearchBar = () => (
  <div className="ml-4 flex-1 max-w-lg">
    <div className="relative">
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:bg-white focus:border-gray-300"
      />
    </div>
  </div>
);
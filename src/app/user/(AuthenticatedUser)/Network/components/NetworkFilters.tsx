'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface NetworkFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterChange: () => void;
}

export function NetworkFilters({ searchTerm, onSearchChange, onFilterChange }: NetworkFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
      <Button onClick={onFilterChange} variant="outline">
        Filters
      </Button>
    </div>
  );
}


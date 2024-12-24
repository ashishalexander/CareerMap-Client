"use client"
import React from 'react';
import { RootState, useAppSelector } from '../../store/store'; // Adjust the import path as needed
import { CareerMapLogo } from './logo';
import { SearchBar } from './searchBar';
import { Navigation } from './Navigation';
import { UserMenu } from './userMenu';
import { Crown } from 'lucide-react';

const Header = () => {
  const user = useAppSelector((state:RootState) => state.auth.user);
  const isPremium = user?.subscription?.isActive;
  const planType = user?.subscription?.planType;

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <CareerMapLogo />
            <SearchBar />
          </div>
          <Navigation />
          <div className="flex items-center justify-end flex-1 gap-2">
            {isPremium && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-medium">
                <Crown size={16} />
                <span>{planType}</span>
              </div>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
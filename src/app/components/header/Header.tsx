"use client"
import React from 'react';
import { CareerMapLogo } from './logo';
import { SearchBar } from './searchBar';
import { Navigation } from './Navigation';
import { UserMenu } from './userMenu';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <CareerMapLogo />
            <SearchBar />
          </div> 
          <Navigation />
          <div className="flex items-center justify-end flex-1">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
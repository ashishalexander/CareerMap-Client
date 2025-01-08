'use client'
import React from 'react';
import { RootState, useAppSelector } from '../../store/store';
import { CareerMapLogo } from './logo';
import { SearchBar } from './searchBar';
import { Navigation } from './Navigation';
import { UserMenu } from './userMenu';
import { Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const Header = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
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
            {isPremium ? (
              <Link href="/user/AuthenticatedUser/Premium">
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 px-3 py-1.5 rounded-full text-sm font-medium hover:from-amber-300 hover:to-yellow-500 transition-colors cursor-pointer">
                  <Crown size={16} />
                  <span>{planType}</span>
                </div>
              </Link>
            ) : (
              <Link href="/user/AuthenticatedUser/Premium">
                <Button 
                  variant="outline"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-600 border-blue-200"
                >
                  <Sparkles size={16} className="text-blue-500" />
                  <span>Upgrade to Premium</span>
                </Button>
              </Link>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
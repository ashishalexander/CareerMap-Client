// userMenu.tsx
"use client"
import React, { useCallback} from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from '../../store/slices/authSlice';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RootState } from '@/app/store/store';
import api from '../../lib/axios-config';

// Separate menu items component for better memoization
const MenuItems = React.memo(({ isRecruiter, onSignOut }: { 
  isRecruiter: boolean; 
  onSignOut: () => void;
}) => (
  <>
    <DropdownMenuItem asChild>
      <Link href="/user/Profile">View Profile</Link>
    </DropdownMenuItem>
    {isRecruiter? (
      <DropdownMenuItem asChild>
        <Link href="/user/JobApplicationReview">Applications Received</Link>  
      </DropdownMenuItem>
    ):(
      <DropdownMenuItem asChild>
        <Link href="/user/AppliedJobs">Applied Jobs</Link>
      </DropdownMenuItem>
    )}
    <DropdownMenuItem asChild>
      <Link href="/user/SubscriptionDash">Subscription Details</Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={onSignOut}>
      Sign Out
    </DropdownMenuItem>
  </>
));

MenuItems.displayName = 'MenuItems';

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => ({
    firstName: state.auth.user?.firstName,
    email: state.auth.user?.email,
    role: state.auth.user?.role,
    profilePicture: state.auth.user?.profile?.profilePicture
  }));
  const router = useRouter();
  const handleSignOut = useCallback(async () => {
    try {
      await api.get('/api/users/logout');
      dispatch(signOut());
      router.push('/user/signIn');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, [dispatch, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profilePicture} alt={user.firstName} />
          <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.firstName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <MenuItems 
          isRecruiter={user.role === 'recruiter'} 
          onSignOut={handleSignOut}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default React.memo(UserMenu);
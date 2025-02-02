"use client"
import React,{useEffect,} from 'react';
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
import api from '../../lib/axios-config'

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/user/signIn');
    }
  }, [user,router]);

  
  const handleSignOut = async () => {
    try {
      await api.get('/api/users/logout')
      dispatch(signOut());
      router.push('/user/signIn')
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (!user) {
    return null; 
  }
  const isRecruiter = user.role === 'recruiter'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.profile?.profilePicture} alt={user.firstName} />
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
        <DropdownMenuItem asChild>
          <Link href="/user/AuthenticatedUser/Profile">View Profile</Link>
        </DropdownMenuItem>
        {isRecruiter && (
          <DropdownMenuItem asChild>
            <Link href="/user/AuthenticatedUser/JobApplicationReview">Applications Received</Link>  
          </DropdownMenuItem>
        )}
         <DropdownMenuItem asChild>
          <Link href="/user/AuthenticatedUser/SubscriptionDash">Subscription Details</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
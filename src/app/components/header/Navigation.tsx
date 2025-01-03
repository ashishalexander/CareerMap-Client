// src/components/Navigation.tsx
"use client"
import Link from 'next/link';
import { Home, Users, Briefcase, MessageSquare, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import { NotificationIcon } from '../../user/AuthenticatedUser/Notifications/NotificaitonIcon';

interface NavItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
  isActive: boolean;
  isNotification?: boolean;
}

const NavItem = ({ icon: Icon, text, href, isActive, isNotification }: NavItemProps) => (
  <Link 
    href={href} 
    className={`flex flex-col items-center px-3 ${
      isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {isNotification ? (
      <NotificationIcon  />
    ) : (
      <Icon className="h-6 w-6" />
    )}
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export const Navigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { icon: Home, text: 'Home', href: '/user/AuthenticatedUser/Home' },
    { icon: Users, text: 'Network', href: '/user/AuthenticatedUser/Network' },
    { icon: Briefcase, text: 'Jobs', href: '/user/AuthenticatedUser/Jobs' },
    { icon: MessageSquare, text: 'Messages', href: '/messages' },
    { icon: Bell, text: 'Notifications', href: '/user/AuthenticatedUser/Notifications', isNotification: true }
  ];

  return (
    <nav className="hidden md:flex items-center justify-center flex-1 ml-[115px] space-x-5">
      {navItems.map((item) => (
        <NavItem 
          key={item.href}
          {...item}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  );
};
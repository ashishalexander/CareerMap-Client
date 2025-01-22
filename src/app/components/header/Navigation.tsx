import React from 'react';
import Link from 'next/link';
import { Home, Users, Briefcase, MessageSquare, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../../store/store';
import { NotificationIcon } from '../../user/AuthenticatedUser/Notifications/NotificationIcon';

interface NavItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
  isActive: boolean;
  hasNewNotifications?: boolean;
}

const NavItem = ({ icon: Icon, text, href, isActive, hasNewNotifications }: NavItemProps) => (
  <Link
    href={href}
    className={`flex flex-col items-center px-3 ${
      isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {text === 'Notifications' && hasNewNotifications? (
      <NotificationIcon />
    ) : (
      <Icon className="h-6 w-6" />
    )}
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export const Navigation = () => {
  const pathname = usePathname();
  const hasNewNotifications = useAppSelector((state) => state.notificat.hasNewNotifications);

  const navItems = [
    { icon: Home, text: 'Home', href: '/user/AuthenticatedUser/Home' },
    { icon: Users, text: 'Network', href: '/user/AuthenticatedUser/Network' },
    { icon: Briefcase, text: 'Jobs', href: '/user/AuthenticatedUser/Jobs' },
    { icon: MessageSquare, text: 'Messages', href: '/user/AuthenticatedUser/Messaging' },
    {
      icon: Bell,
      text: 'Notifications',
      href: '/user/AuthenticatedUser/Notifications',
      hasNewNotifications,
    },
  ];

  return (
    <nav className="hidden md:flex items-center justify-center flex-1 ml-[115px] space-x-5">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          {...item}
          isActive={pathname === item.href}
          hasNewNotifications={item.text === 'Notifications' ? hasNewNotifications : undefined}
        />
      ))}
    </nav>
  );
};

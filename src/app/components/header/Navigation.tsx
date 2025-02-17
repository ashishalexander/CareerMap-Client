'use client'

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Home, Users, Briefcase, MessageSquare, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '../../store/store';
import { NotificationIcon } from '../../user/(AuthenticatedUser)/Notifications/NotificationIcon';

// Move NavItem interface and static data outside component
interface NavItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
  isActive: boolean;
  hasNewNotifications?: boolean;
}

// Memoize NavItem component
const NavItem = React.memo(({ icon: Icon, text, href, isActive, hasNewNotifications }: NavItemProps) => (
  <Link
    href={href}
    className={`flex flex-col items-center px-3 ${
      isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {text === 'Notifications' && hasNewNotifications ? (
      <NotificationIcon />
    ) : (
      <Icon className="h-6 w-6" />
    )}
    <span className="text-xs mt-1">{text}</span>
  </Link>
));

// Define static nav items outside component
const BASE_NAV_ITEMS = [
  { icon: Home, text: 'Home', href: '/user/Home' },
  { icon: Users, text: 'Network', href: '/user/Network' },
  { icon: Briefcase, text: 'Jobs', href: '/user/Jobs' },
  { icon: MessageSquare, text: 'Messages', href: '/user/Messaging' },
  { icon: Bell, text: 'Notifications', href: '/user/Notifications' },
] as const;

// Add display name for React.memo
NavItem.displayName = 'NavItem';

export const Navigation = () => {
  const pathname = usePathname();
  const hasNewNotifications = useAppSelector((state) => state.notificat.hasNewNotifications);

  // Memoize nav items with dynamic data
  const navItems = useMemo(() => 
    BASE_NAV_ITEMS.map(item => ({
      ...item,
      hasNewNotifications: item.text === 'Notifications' ? hasNewNotifications : undefined
    })),
    [hasNewNotifications]
  );

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

// Export memoized Navigation component
export default React.memo(Navigation);
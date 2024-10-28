'use client';
import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Sidebar item configuration
const sidebarItems = [
  { 
    icon: <Home size={20} />, 
    label: 'Dashboard', 
    route: '/admin/adminPannel/dashboard'
  },
  { 
    icon: <Users size={20} />, 
    label: 'User Management', 
    route: '/admin/adminPannel/userManagement'
  },
  { 
    icon: <Settings size={20} />, 
    label: 'Recruiter Management', 
    route: '/admin/adminPannel/recruiterManagement'
  },
  { 
    icon: <LogOut size={20} />, 
    label: 'Logout', 
    route: '/logout'
  }
];

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  route: string;
  isActive: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, route, isActive }) => {
  return (
    <li>
      <Link
        href={route}
        aria-current={isActive ? 'page' : undefined}
        aria-label={label}
        className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-gray-300 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-200'
        }`}
      >
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-100 w-64 min-h-screen pt-4 px-4 border-r border-gray-200">
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              route={item.route}
              isActive={pathname === item.route}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
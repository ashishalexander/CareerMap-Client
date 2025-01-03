'use client';
import React from 'react';
import { Home, Users, Settings, LogOut, Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '../../store/store'; // Import useAppDispatch
import { logoutAdmin } from '../../store/slices/adminSlice'; // Import the logout action

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
    icon: <Bell size={20} />, 
    label: 'Notifications', 
    route: '/admin/adminPannel/Notifications'
  },
  { 
    icon: <LogOut size={20} />, 
    label: 'Logout', 
    route: '', // Remove route for logout item
    onClick: 'logout' // Special identifier for logout
  },  
];

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  route: string;
  isActive: boolean;
  onClick?: (e:React.MouseEvent) => void; // Optional onClick handler for logout
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, route, isActive, onClick }) => {
  return (
    <li>
      <Link
        href={route || '#'} // Prevent navigation if no route
        aria-current={isActive ? 'page' : undefined}
        aria-label={label}
        className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-all duration-200 ${
          isActive 
            ? 'bg-gray-300 text-blue-600' 
            : 'text-gray-700 hover:bg-gray-200'
        }`}
        onClick={onClick} // Pass onClick to Link component
      >
        <span className="w-5 h-5">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch(); // Use the custom dispatch hook

  // Handle logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior

    // Dispatch the logout action
    dispatch(logoutAdmin());
    
    // Clear session storage
    sessionStorage.removeItem("adminAccessToken");

    // Redirect to login page after logout
    window.location.href = '/admin/signIn'; // Or use Next.js router to navigate
  };

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
              onClick={item.label === 'Logout' ? handleLogout : undefined} // Attach logout handler to Logout item
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

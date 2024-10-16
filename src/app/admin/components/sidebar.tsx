import React from 'react';
import { Home, Users, Settings, LogOut } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
}

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-100 w-64 min-h-screen pt-4 px-4">
      <nav>
        <ul className="space-y-2">
          <SidebarItem icon={<Home size={20} />} text="Dashboard" />
          <SidebarItem icon={<Users size={20} />} text="User Management" />
          <SidebarItem icon={<Settings size={20} />} text="Admin Management" />
          <SidebarItem icon={<LogOut size={20} />} text="Logout" />
        </ul>
      </nav>
    </aside>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text }) => {
  return (
    <li>
      <a
        href="#"
        className="flex items-center space-x-3 text-gray-700 p-2 rounded-lg font-medium hover:bg-gray-200 focus:bg-gray-200 focus:shadow-outline"
      >
        {icon}
        <span>{text}</span>
      </a>
    </li>
  );
};

export default Sidebar;

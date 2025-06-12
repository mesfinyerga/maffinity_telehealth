import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  Brain,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Consultations', href: '/consultations', icon: MessageSquare },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'AI Analysis', href: '/ai-analysis', icon: Brain },
  ];

  const bottomNavigation = [
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Stethoscope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                TeleHealth
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Doctor Portal</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.name : ''}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {/* User Info */}
        {isOpen && user && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  Dr. {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="space-y-2">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${!isOpen && 'justify-center'}`}
                title={!isOpen ? item.name : ''}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.name}</span>}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={logout}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ${!isOpen && 'justify-center'}`}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


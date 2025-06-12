import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Home, Brain, Calendar, MessageCircle, User } from 'lucide-react';

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    {
      path: '/home',
      icon: Home,
      label: t('home')
    },
    {
      path: '/ai-triage',
      icon: Brain,
      label: t('aiTriage')
    },
    {
      path: '/appointments',
      icon: Calendar,
      label: t('appointments')
    },
    {
      path: '/consultations',
      icon: MessageCircle,
      label: t('consultations')
    },
    {
      path: '/profile',
      icon: User,
      label: t('profile')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


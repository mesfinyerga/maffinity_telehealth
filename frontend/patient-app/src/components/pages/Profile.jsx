import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  User, 
  Edit, 
  Settings, 
  Bell, 
  Globe, 
  Moon, 
  Sun, 
  LogOut,
  ChevronRight,
  Heart,
  FileText,
  Shield
} from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { icon: User, label: 'Edit Profile', action: () => {} },
        { icon: Heart, label: 'Medical History', action: () => {} },
        { icon: FileText, label: 'Medical Records', action: () => {} }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: Globe, 
          label: t('language'), 
          value: language === 'en' ? 'English' : 'አማርኛ',
          action: () => setShowLanguageModal(true)
        },
        { 
          icon: theme === 'dark' ? Sun : Moon, 
          label: t('theme'), 
          value: theme === 'dark' ? 'Dark' : 'Light',
          action: toggleTheme
        },
        { icon: Bell, label: t('notifications'), action: () => {} }
      ]
    },
    {
      title: 'Security & Privacy',
      items: [
        { icon: Shield, label: 'Privacy Settings', action: () => {} },
        { icon: Settings, label: 'Account Settings', action: () => {} }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('profile')}
          </h1>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                {user?.phone}
              </p>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <Edit size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sections */}
      <div className="px-4 space-y-6">
        {profileSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {section.title}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value && (
                      <span className="text-gray-500 dark:text-gray-400 text-sm">
                        {item.value}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 py-6">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2"
        >
          <LogOut size={20} />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Language
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  changeLanguage('en');
                  setShowLanguageModal(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  language === 'en'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => {
                  changeLanguage('am');
                  setShowLanguageModal(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  language === 'am'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                አማርኛ (Amharic)
              </button>
            </div>
            <button
              onClick={() => setShowLanguageModal(false)}
              className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


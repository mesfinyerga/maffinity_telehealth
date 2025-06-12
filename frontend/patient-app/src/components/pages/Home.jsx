import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Bell, 
  Calendar, 
  Brain, 
  FileText, 
  Phone, 
  Heart,
  Activity,
  Clock,
  MapPin,
  Sun,
  Moon
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t('goodMorning'));
    } else if (hour < 18) {
      setGreeting(t('goodAfternoon'));
    } else {
      setGreeting(t('goodEvening'));
    }
  }, [t]);

  const quickActions = [
    {
      icon: Calendar,
      title: t('bookAppointment'),
      subtitle: 'Schedule with a doctor',
      color: 'bg-blue-500',
      path: '/appointments'
    },
    {
      icon: Brain,
      title: t('startHealthCheck'),
      subtitle: 'AI-powered assessment',
      color: 'bg-purple-500',
      path: '/ai-triage'
    },
    {
      icon: FileText,
      title: t('viewRecords'),
      subtitle: 'Medical history & reports',
      color: 'bg-green-500',
      path: '/profile'
    },
    {
      icon: Phone,
      title: t('emergencyContact'),
      subtitle: 'Call emergency services',
      color: 'bg-red-500',
      action: () => window.open('tel:911')
    }
  ];

  const healthStats = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: '72 bpm',
      status: 'normal',
      color: 'text-green-600'
    },
    {
      icon: Activity,
      label: 'Blood Pressure',
      value: '120/80',
      status: 'normal',
      color: 'text-green-600'
    },
    {
      icon: Clock,
      label: 'Last Checkup',
      value: '2 weeks ago',
      status: 'due soon',
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {greeting}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              {t('howAreYouFeeling')}
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              Tap "Start Health Check" for a quick AI assessment
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('quickActions')}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => action.path ? window.location.href = action.path : action.action?.()}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                {action.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {action.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Health Overview */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Health Overview
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            {healthStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {stat.label}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      {stat.status}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  Appointment Scheduled
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Dr. Sarah Johnson - Tomorrow at 2:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  AI Health Check Completed
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Low risk assessment - 2 days ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location & Weather */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin size={16} />
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </div>
              <p className="text-2xl font-bold">24°C</p>
              <p className="text-sm opacity-90">Partly Cloudy</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Air Quality</p>
              <p className="text-lg font-semibold">Good</p>
              <p className="text-xs opacity-75">AQI: 45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


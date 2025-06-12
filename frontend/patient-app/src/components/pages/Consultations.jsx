import { useLanguage } from '../../contexts/LanguageContext';
import { MessageCircle, Video, Phone, MoreVertical } from 'lucide-react';

export default function Consultations() {
  const { t } = useLanguage();

  const consultations = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      lastMessage: 'Thank you for the consultation. Please take the prescribed medication.',
      timestamp: '2 hours ago',
      unread: 0,
      status: 'completed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      lastMessage: 'I\'ve reviewed your test results. Let\'s schedule a follow-up.',
      timestamp: '1 day ago',
      unread: 2,
      status: 'active'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('consultations')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Your ongoing conversations with doctors
          </p>
        </div>
      </div>

      {/* Consultations List */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <div key={consultation.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {consultation.doctor}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {consultation.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {consultation.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {consultation.unread}
                    </span>
                  )}
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {consultation.lastMessage}
              </p>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center space-x-2">
                  <MessageCircle size={16} />
                  <span>Message</span>
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                  <Video size={16} />
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                  <Phone size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// Placeholder components for remaining pages
import { useLanguage } from '../../contexts/LanguageContext';
import { Calendar, Plus, Clock, MapPin, User } from 'lucide-react';

export default function Appointments() {
  const { t } = useLanguage();

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      date: '2024-12-07',
      time: '14:00',
      type: 'Video Consultation',
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      date: '2024-12-10',
      time: '10:30',
      type: 'In-Person',
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('appointments')}
            </h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('upcomingAppointments')}
        </h2>
        
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {appointment.doctor}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.specialty}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}>
                  {appointment.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{new Date(appointment.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{appointment.type}</span>
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium">
                  Join Call
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                  Reschedule
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book New Appointment */}
      <div className="px-4 py-6">
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium">
          {t('scheduleNew')}
        </button>
      </div>
    </div>
  );
}


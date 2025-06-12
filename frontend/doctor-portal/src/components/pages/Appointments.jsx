import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Video,
  MessageSquare,
  Phone,
  Plus,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Sample appointments data
  useEffect(() => {
    const sampleAppointments = [
      {
        id: 1,
        patient: {
          name: 'John Doe',
          age: 35,
          avatar: 'JD',
          phone: '+251911234567',
          email: 'john.doe@email.com'
        },
        date: '2024-12-06',
        time: '09:00',
        duration: 30,
        type: 'video',
        status: 'scheduled',
        complaint: 'Persistent headaches and fatigue',
        notes: 'Follow-up appointment for migraine treatment'
      },
      {
        id: 2,
        patient: {
          name: 'Jane Smith',
          age: 28,
          avatar: 'JS',
          phone: '+251922345678',
          email: 'jane.smith@email.com'
        },
        date: '2024-12-06',
        time: '10:30',
        duration: 45,
        type: 'chat',
        status: 'in-progress',
        complaint: 'Skin rash and allergic reactions',
        notes: 'New patient consultation'
      },
      {
        id: 3,
        patient: {
          name: 'Mike Johnson',
          age: 42,
          avatar: 'MJ',
          phone: '+251933456789',
          email: 'mike.johnson@email.com'
        },
        date: '2024-12-06',
        time: '14:00',
        duration: 30,
        type: 'phone',
        status: 'completed',
        complaint: 'Diabetes follow-up and medication review',
        notes: 'Regular check-up for diabetes management'
      },
      {
        id: 4,
        patient: {
          name: 'Sarah Wilson',
          age: 31,
          avatar: 'SW',
          phone: '+251944567890',
          email: 'sarah.wilson@email.com'
        },
        date: '2024-12-06',
        time: '15:30',
        duration: 30,
        type: 'video',
        status: 'scheduled',
        complaint: 'Pregnancy consultation - 20 weeks',
        notes: 'Routine prenatal check-up'
      },
      {
        id: 5,
        patient: {
          name: 'David Brown',
          age: 55,
          avatar: 'DB',
          phone: '+251955678901',
          email: 'david.brown@email.com'
        },
        date: '2024-12-07',
        time: '09:30',
        duration: 45,
        type: 'video',
        status: 'scheduled',
        complaint: 'Chest pain and shortness of breath',
        notes: 'Urgent consultation requested'
      }
    ];
    setAppointments(sampleAppointments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'in-progress':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.complaint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = appointment.date === selectedDate;
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const handleStartConsultation = (appointmentId) => {
    // Navigate to consultation page
    console.log('Starting consultation for appointment:', appointmentId);
  };

  const handleReschedule = (appointmentId) => {
    console.log('Rescheduling appointment:', appointmentId);
  };

  const handleCancel = (appointmentId) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' }
          : apt
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointments</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your patient appointments and consultations
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients or complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {filteredAppointments.length} appointment(s) found
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No appointments found for the selected criteria</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Patient Avatar */}
                    <div className="bg-blue-500 text-white rounded-full h-12 w-12 flex items-center justify-center text-sm font-medium">
                      {appointment.patient.avatar}
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {appointment.patient.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          {getTypeIcon(appointment.type)}
                          <span className="text-sm capitalize">{appointment.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time} ({appointment.duration} min)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>Age {appointment.patient.age}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                        <strong>Complaint:</strong> {appointment.complaint}
                      </p>
                      
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {appointment.status === 'scheduled' && (
                      <button
                        onClick={() => handleStartConsultation(appointment.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Start Consultation
                      </button>
                    )}
                    
                    {appointment.status === 'in-progress' && (
                      <button
                        onClick={() => handleStartConsultation(appointment.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Continue
                      </button>
                    )}

                    <div className="relative">
                      <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;


import { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  MessageSquare,
  Brain,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 8,
    totalPatients: 156,
    activeConsultations: 3,
    pendingAnalysis: 5,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled with John Doe',
      time: '10 minutes ago',
      icon: Calendar,
      color: 'text-blue-500',
    },
    {
      id: 2,
      type: 'consultation',
      message: 'Consultation completed with Jane Smith',
      time: '25 minutes ago',
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      id: 3,
      type: 'ai-analysis',
      message: 'AI analysis ready for Patient #1234',
      time: '1 hour ago',
      icon: Brain,
      color: 'text-purple-500',
    },
    {
      id: 4,
      type: 'urgent',
      message: 'Urgent consultation request from Mike Johnson',
      time: '2 hours ago',
      icon: AlertCircle,
      color: 'text-red-500',
    },
  ]);

  // Sample data for charts
  const appointmentData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 15 },
    { name: 'Wed', appointments: 8 },
    { name: 'Thu', appointments: 14 },
    { name: 'Fri', appointments: 16 },
    { name: 'Sat', appointments: 6 },
    { name: 'Sun', appointments: 4 },
  ];

  const consultationData = [
    { name: 'Jan', consultations: 45 },
    { name: 'Feb', consultations: 52 },
    { name: 'Mar', consultations: 48 },
    { name: 'Apr', consultations: 61 },
    { name: 'May', consultations: 55 },
    { name: 'Jun', consultations: 67 },
  ];

  const patientTypeData = [
    { name: 'New Patients', value: 35, color: '#3B82F6' },
    { name: 'Follow-up', value: 45, color: '#10B981' },
    { name: 'Emergency', value: 12, color: '#EF4444' },
    { name: 'Routine Check', value: 28, color: '#F59E0B' },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'text-blue-500' }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 dark:bg-gray-700 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, Dr. Smith. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
          icon={Calendar}
          trend="up"
          trendValue="+12%"
          color="text-blue-500"
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          trend="up"
          trendValue="+8%"
          color="text-green-500"
        />
        <StatCard
          title="Active Consultations"
          value={stats.activeConsultations}
          icon={MessageSquare}
          color="text-purple-500"
        />
        <StatCard
          title="Pending AI Analysis"
          value={stats.pendingAnalysis}
          icon={Brain}
          trend="down"
          trendValue="-3%"
          color="text-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Appointments */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Appointments
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Consultations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Consultations
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consultationData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="consultations" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Types */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Patient Types
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={patientTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {patientTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {patientTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


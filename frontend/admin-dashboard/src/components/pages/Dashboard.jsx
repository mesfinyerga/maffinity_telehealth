import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Heart, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Brain,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalUsers: 12847,
    totalDoctors: 342,
    totalPatients: 12505,
    activeConsultations: 89,
    todayAppointments: 156,
    systemHealth: 99.9
  });

  // Mock data for charts
  const userGrowthData = [
    { name: 'Jan', users: 8500, doctors: 200, patients: 8300 },
    { name: 'Feb', users: 9200, doctors: 220, patients: 8980 },
    { name: 'Mar', users: 10100, doctors: 250, patients: 9850 },
    { name: 'Apr', users: 11200, doctors: 280, patients: 10920 },
    { name: 'May', users: 12000, doctors: 310, patients: 11690 },
    { name: 'Jun', users: 12847, doctors: 342, patients: 12505 }
  ];

  const consultationData = [
    { name: 'Mon', consultations: 45, completed: 42, cancelled: 3 },
    { name: 'Tue', consultations: 52, completed: 48, cancelled: 4 },
    { name: 'Wed', consultations: 38, completed: 35, cancelled: 3 },
    { name: 'Thu', consultations: 61, completed: 58, cancelled: 3 },
    { name: 'Fri', consultations: 73, completed: 69, cancelled: 4 },
    { name: 'Sat', consultations: 89, completed: 84, cancelled: 5 },
    { name: 'Sun', consultations: 67, completed: 63, cancelled: 4 }
  ];

  const aiUsageData = [
    { name: 'Symptom Checker', value: 45, color: '#3b82f6' },
    { name: 'Image Analysis', value: 30, color: '#10b981' },
    { name: 'Triage Assistant', value: 25, color: '#f59e0b' }
  ];

  const recentActivities = [
    { id: 1, type: 'user_registration', message: 'New patient registered: Sarah Johnson', time: '2 minutes ago', icon: Users },
    { id: 2, type: 'consultation', message: 'Video consultation completed by Dr. Michael Chen', time: '5 minutes ago', icon: UserCheck },
    { id: 3, type: 'ai_analysis', message: 'AI diagnostic analysis completed for chest X-ray', time: '8 minutes ago', icon: Brain },
    { id: 4, type: 'appointment', message: 'Appointment scheduled for tomorrow at 2:00 PM', time: '12 minutes ago', icon: Calendar },
    { id: 5, type: 'system', message: 'System backup completed successfully', time: '1 hour ago', icon: CheckCircle }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected on API server', time: '15 minutes ago' },
    { id: 2, type: 'info', message: 'Scheduled maintenance window: Sunday 2:00 AM - 4:00 AM', time: '2 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your telehealth platform.</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-input rounded-lg bg-background text-foreground"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+12.5%</span>
                <span className="text-sm text-muted-foreground ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Doctors</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalDoctors}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+8.2%</span>
                <span className="text-sm text-muted-foreground ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalPatients.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-500">+15.3%</span>
                <span className="text-sm text-muted-foreground ml-1">vs last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
              <p className="text-2xl font-bold text-foreground">{stats.todayAppointments}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-500">-3.1%</span>
                <span className="text-sm text-muted-foreground ml-1">vs yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="doctors" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Consultation Analytics */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Consultations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consultationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="completed" fill="#10b981" />
              <Bar dataKey="cancelled" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Usage Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">AI Services Usage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={aiUsageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {aiUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {aiUsageData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">System Alerts</h3>
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.type === 'warning' 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      alert.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : 'text-blue-800 dark:text-blue-200'
                    }`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* System Health */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-800 dark:text-green-200">System Health</span>
              </div>
              <span className="text-lg font-bold text-green-800 dark:text-green-200">{stats.systemHealth}%</span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">All systems operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


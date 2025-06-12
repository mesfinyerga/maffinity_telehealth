import { Search, Filter, MoreVertical, Edit, Trash2, UserPlus } from 'lucide-react';

const Users = () => {
  const users = [
    { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@telehealth.com', role: 'Doctor', status: 'Active', lastLogin: '2 hours ago' },
    { id: 2, name: 'John Doe', email: 'john.doe@email.com', role: 'Patient', status: 'Active', lastLogin: '1 day ago' },
    { id: 3, name: 'Dr. Michael Chen', email: 'michael.chen@telehealth.com', role: 'Doctor', status: 'Active', lastLogin: '30 minutes ago' },
    { id: 4, name: 'Jane Smith', email: 'jane.smith@email.com', role: 'Patient', status: 'Inactive', lastLogin: '1 week ago' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User Management</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center space-x-2">
          <UserPlus size={16} />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full bg-background border border-input rounded-lg"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-input rounded-lg">
              <Filter size={16} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Last Login</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="p-4 font-medium text-foreground">{user.name}</td>
                  <td className="p-4 text-muted-foreground">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Doctor' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{user.lastLogin}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-accent rounded">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 hover:bg-accent rounded text-destructive">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Doctors = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Doctor Management</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">Doctor management interface will be implemented here.</p>
    </div>
  </div>
);

const Patients = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Patient Management</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">Patient management interface will be implemented here.</p>
    </div>
  </div>
);

const Appointments = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Appointment Management</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">Appointment management interface will be implemented here.</p>
    </div>
  </div>
);

const Analytics = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">Analytics and reporting interface will be implemented here.</p>
    </div>
  </div>
);

const AIInsights = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">AI Insights</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">AI insights and performance metrics will be implemented here.</p>
    </div>
  </div>
);

const SystemHealth = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">System Health</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">System health monitoring interface will be implemented here.</p>
    </div>
  </div>
);

const AuditLogs = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">Audit logs and compliance tracking will be implemented here.</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
    <div className="bg-card border border-border rounded-lg p-6">
      <p className="text-muted-foreground">System configuration and settings will be implemented here.</p>
    </div>
  </div>
);

export { Users, Doctors, Patients, Appointments, Analytics, AIInsights, SystemHealth, AuditLogs, Settings };


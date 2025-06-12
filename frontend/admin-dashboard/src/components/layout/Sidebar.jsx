import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Heart, 
  Calendar, 
  BarChart3, 
  Brain, 
  Activity, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Stethoscope
} from 'lucide-react';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'All Users' },
    { path: '/doctors', icon: UserCheck, label: 'Doctors' },
    { path: '/patients', icon: Heart, label: 'Patients' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/ai-insights', icon: Brain, label: 'AI Insights' },
    { path: '/system-health', icon: Activity, label: 'System Health' },
    { path: '/audit-logs', icon: FileText, label: 'Audit Logs' },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">TeleHealth</h1>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  } ${!isOpen && 'justify-center'}`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon size={20} />
                  {isOpen && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-sidebar-accent rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-sidebar-accent-foreground">System Status</span>
            </div>
            <p className="text-xs text-sidebar-accent-foreground/60">All systems operational</p>
            <div className="flex items-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-sidebar-accent-foreground/60">99.9% uptime</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;


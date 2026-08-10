import React from 'react';
import { 
  LayoutDashboard, MapPin, ClipboardList, Shield, 
  Cpu, Activity, PlusCircle, FileText, Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const role = user?.role || 'CITIZEN';

  // Define nav items per role
  const allNavItems = {
    CITIZEN: [
      { id: 'MY_COMPLAINTS', label: 'My Complaints', icon: FileText },
      { id: 'SUBMIT_COMPLAINT', label: 'Submit Complaint', icon: PlusCircle },
      { id: 'MAP', label: 'Live Map', icon: MapPin },
    ],
    OFFICER: [
      { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
      { id: 'COMPLAINTS', label: 'Assigned Queue', icon: ClipboardList },
      { id: 'MAP', label: 'Live Complaint Map', icon: MapPin },
    ],
    ADMIN: [
      { id: 'OVERVIEW', label: 'Analytics Dashboard', icon: LayoutDashboard },
      { id: 'MAP', label: 'Live Complaint Map', icon: MapPin },
      { id: 'COMPLAINTS', label: 'Complaints Queue', icon: ClipboardList },
      { id: 'ADMIN', label: 'Admin Management', icon: Shield },
      { id: 'USERS', label: 'User Management', icon: Users },
      { id: 'AI_DIAGNOSTICS', label: 'AI Diagnostics', icon: Cpu },
    ],
  };

  const roleColors = {
    CITIZEN: 'from-emerald-600 to-teal-600',
    OFFICER: 'from-sky-600 to-indigo-600',
    ADMIN: 'from-rose-600 to-purple-600',
  };

  const roleLabels = {
    CITIZEN: '🏘 Citizen',
    OFFICER: '🛡 Field Officer',
    ADMIN: '⚙ Administrator',
  };

  const navItems = allNavItems[role] || allNavItems.CITIZEN;
  const gradientClass = roleColors[role] || roleColors.CITIZEN;

  return (
    <aside className="w-64 glass-card border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Role badge */}
        <div className={`px-3 py-2 rounded-xl bg-gradient-to-r ${gradientClass} text-white text-xs font-bold flex items-center space-x-2`}>
          <span>{roleLabels[role]}</span>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-r ${gradientClass} text-white shadow-md shadow-sky-500/20` 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Status */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-900/40 to-indigo-950/60 border border-sky-500/30 text-sky-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center space-x-1.5 text-sky-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Engine Status</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">ONLINE</span>
          </div>
          <p className="text-[11px] opacity-80 leading-relaxed">
            YOLOv8 + ResNet50 Classifier active. Duplicate detection operational.
          </p>
        </div>
      </div>

      {/* Footer user info */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{user?.full_name || user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

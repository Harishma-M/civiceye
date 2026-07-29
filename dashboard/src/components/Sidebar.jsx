import React from 'react';
import { 
  LayoutDashboard, MapPin, ClipboardList, Shield, 
  Cpu, FileSpreadsheet, Activity, Building2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'OVERVIEW', label: 'Overview Analytics', icon: LayoutDashboard },
    { id: 'MAP', label: 'Live Complaint Map', icon: MapPin },
    { id: 'COMPLAINTS', label: 'Complaints Queue', icon: ClipboardList, badge: '6' },
    { id: 'ADMIN', label: 'Admin Management', icon: Shield, adminOnly: true },
    { id: 'AI_DIAGNOSTICS', label: 'AI Model Diagnostics', icon: Cpu },
  ];

  return (
    <aside className="w-64 glass-card border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              if (item.adminOnly && user.role !== 'ADMIN') return null;
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-500/20' 
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

        {/* System Status Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-900/40 to-indigo-950/60 border border-sky-500/30 text-sky-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center space-x-1.5 text-sky-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>AI Engine Status</span>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">ONLINE</span>
          </div>
          <p className="text-[11px] opacity-80 leading-relaxed">
            YOLOv8 + ResNet50 Classifier active. 30m Haversine duplicate detection engine operational.
          </p>
        </div>
      </div>

      {/* Footer Profile Info */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <div className="text-xs">
            <p className="font-bold text-slate-800 dark:text-slate-200">{user.department}</p>
            <p className="text-[10px] text-slate-400">Badge: {user.badge}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Eye, Sun, Moon, Bell, Search, Shield, Smartphone, 
  UserCheck, ChevronDown, CheckCircle2, AlertTriangle 
} from 'lucide-react';

export const Navbar = ({ onOpenCitizenApp }) => {
  const { user, switchRole } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-sm">
      {/* Brand & App Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-tr from-sky-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-md flex items-center justify-center">
          <Eye className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
              CivicEye
            </h1>
            <span className="bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-sky-300 dark:border-sky-800">
              AI v2.6
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Smart Public Complaint Management Platform
          </p>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center relative w-96">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by Tracking Code (e.g. CIV-2026-1001), Location or Category..." 
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-all"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Open Citizen Mobile App Simulator */}
        <button
          onClick={onOpenCitizenApp}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          title="Open Live Citizen Mobile App Simulator"
        >
          <Smartphone className="w-4 h-4 animate-bounce" />
          <span>Launch Citizen App</span>
        </button>

        {/* Dark/Light Mode Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotif(!showNotif)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-3">
                <span className="font-bold text-slate-800 dark:text-slate-100">Live Alerts & AI Logs</span>
                <span className="text-[10px] text-sky-500 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Critical Hazard Alert</p>
                    <p className="text-[11px] opacity-90">Open Sewage Drain CIV-2026-1005 flagged near school area.</p>
                    <span className="text-[9px] opacity-75">5 mins ago</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2.5 p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/40 text-sky-800 dark:text-sky-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">AI Verification Passed</p>
                    <p className="text-[11px] opacity-90">96.5% Pothole confidence score on CIV-2026-1001.</p>
                    <span className="text-[9px] opacity-75">18 mins ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-sky-500 transition-all"
          >
            <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-lg object-cover ring-2 ring-sky-500/50" />
            <div className="text-left hidden lg:block pr-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">{user.name}</p>
              <p className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">{user.role} VIEW</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 text-xs z-50">
              <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 mb-1">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Switch Portal Role</p>
              </div>
              <button 
                onClick={() => { switchRole('OFFICER'); setShowRoleDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-all ${user.role === 'OFFICER' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-4 h-4" />
                  <span>Officer Portal</span>
                </div>
                {user.role === 'OFFICER' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
              </button>
              <button 
                onClick={() => { switchRole('ADMIN'); setShowRoleDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-all ${user.role === 'ADMIN' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Administrator Portal</span>
                </div>
                {user.role === 'ADMIN' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
              </button>
              <button 
                onClick={() => { switchRole('CITIZEN'); setShowRoleDropdown(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between font-medium transition-all ${user.role === 'CITIZEN' ? 'bg-sky-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>Citizen View</span>
                </div>
                {user.role === 'CITIZEN' && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

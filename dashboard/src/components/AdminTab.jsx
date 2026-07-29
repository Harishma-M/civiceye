import React, { useState } from 'react';
import { 
  Shield, Users, Building2, Cpu, FileSpreadsheet, 
  Settings, CheckCircle, AlertTriangle, Plus 
} from 'lucide-react';

export const AdminTab = ({ departments }) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState('DEPTS');
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "TrackingCode,Category,Priority,Status,Department,Latitude,Longitude\n"
      + "CIV-2026-1001,Pothole,CRITICAL,IN_PROGRESS,Highways Department,13.0827,80.2707\n"
      + "CIV-2026-1002,Garbage,MEDIUM,SUBMITTED,Municipality,13.0850,80.2750\n"
      + "CIV-2026-1003,Water Leakage,HIGH,ACCEPTED,Water Supply Board,13.0780,80.2650\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "civiceye_audit_report_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Admin Top Controls */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Administrator Control Center</h3>
            <p className="text-xs text-slate-400">Manage municipal departments, officers, AI configurations, and audit exports</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Audit CSV Report</span>
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveAdminSubTab('DEPTS')}
          className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-all ${
            activeAdminSubTab === 'DEPTS' ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold' : 'border-transparent text-slate-400'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Departments ({departments.length})</span>
        </button>
        <button
          onClick={() => setActiveAdminSubTab('OFFICERS')}
          className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-all ${
            activeAdminSubTab === 'OFFICERS' ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold' : 'border-transparent text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Government Officers (14)</span>
        </button>
        <button
          onClick={() => setActiveAdminSubTab('SYSTEM')}
          className={`pb-3 px-4 flex items-center space-x-2 border-b-2 transition-all ${
            activeAdminSubTab === 'SYSTEM' ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold' : 'border-transparent text-slate-400'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>System & Security</span>
        </button>
      </div>

      {/* Subtab Content: Departments */}
      {activeAdminSubTab === 'DEPTS' && (
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Registered Municipal Departments</h4>
            <button 
              onClick={() => setShowAddDeptModal(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Department</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div key={dept.id} className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold">Active</span>
                </div>
                <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{dept.name}</h5>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Assigned: <strong className="text-slate-800 dark:text-slate-200">{dept.assigned}</strong></p>
                  <p>Resolved: <strong className="text-emerald-600">{dept.resolved}</strong></p>
                  <p>Avg SLA: <strong className="text-slate-800 dark:text-slate-200">{dept.avg_time} hrs</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab Content: System */}
      {activeAdminSubTab === 'SYSTEM' && (
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Security & Infrastructure Health</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border space-y-2">
              <div className="flex items-center space-x-2 text-emerald-500 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>JWT Authentication & Password Hashing</span>
              </div>
              <p className="text-slate-500">HS256 Encryption with 7-day token expiration operational.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border space-y-2">
              <div className="flex items-center space-x-2 text-emerald-500 font-bold">
                <CheckCircle className="w-4 h-4" />
                <span>Duplicate Geolocation Radius</span>
              </div>
              <p className="text-slate-500">Haversine distance math configured to 30.0 meters.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

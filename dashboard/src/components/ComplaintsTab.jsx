import React, { useState } from 'react';
import { 
  CheckCircle2, Clock, Upload, UserPlus, Filter, 
  Search, ShieldAlert, FileText, QrCode, ArrowRight, Eye 
} from 'lucide-react';

export const ComplaintsTab = ({ complaints, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [notes, setNotes] = useState('');
  const [workImageUrl, setWorkImageUrl] = useState('');

  const filtered = complaints.filter(c => {
    const matchesSearch = c.tracking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenUpdate = (comp) => {
    setSelectedComplaint(comp);
    setNewStatus(comp.status);
    setWorkerName(comp.field_worker || '');
    setNotes('');
    setWorkImageUrl('');
    setShowUpdateModal(true);
  };

  const handleSaveStatus = () => {
    if (selectedComplaint) {
      onUpdateStatus(selectedComplaint.id, {
        status: newStatus,
        field_worker: workerName,
        notes: notes,
        work_image_url: workImageUrl || 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600'
      });
      setShowUpdateModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full sm:w-80 relative">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by Tracking Code, Issue or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          />
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400 font-medium">Status Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses ({complaints.length})</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WORKER_ASSIGNED">Worker Assigned</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WORK_COMPLETED">Work Completed</option>
            <option value="CITIZEN_VERIFIED">Citizen Verified</option>
          </select>
        </div>
      </div>

      {/* Complaints Queue Table */}
      <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Tracking Code & Issue</th>
                <th className="py-3.5 px-4">Category & AI Score</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Current Status</th>
                <th className="py-3.5 px-4">Assigned Department</th>
                <th className="py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filtered.map((comp) => (
                <tr key={comp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-start space-x-3">
                      <img src={comp.image_url} alt="Thumbnail" className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-300 dark:ring-slate-700" />
                      <div>
                        <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-[11px] bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded">
                          {comp.tracking_code}
                        </span>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{comp.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">{comp.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{comp.category}</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        AI Verified ({comp.ai_confidence}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      comp.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300' :
                      comp.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {comp.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      comp.status === 'CITIZEN_VERIFIED' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' :
                      comp.status === 'WORK_COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                      comp.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {comp.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {comp.department}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleOpenUpdate(comp)}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] shadow-sm flex items-center space-x-1"
                    >
                      <span>Manage</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Officer Status Update & Work Upload Modal */}
      {showUpdateModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded">
                  {selectedComplaint.tracking_code}
                </span>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">Officer Action Portal</h3>
              </div>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Before / After Preview */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">CITIZEN REPORTED PHOTO</p>
                <img src={selectedComplaint.image_url} alt="Before" className="w-full h-32 object-cover rounded-xl border" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 mb-1">WORK COMPLETION PHOTO</p>
                {selectedComplaint.after_image_url ? (
                  <img src={selectedComplaint.after_image_url} alt="After" className="w-full h-32 object-cover rounded-xl border border-emerald-500" />
                ) : (
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
                    <Upload className="w-5 h-5 mb-1" />
                    <span>Upload completion image</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 font-bold text-slate-800 dark:text-slate-200"
                >
                  <option value="SUBMITTED">SUBMITTED</option>
                  <option value="ACCEPTED">ACCEPTED (Officer Verified)</option>
                  <option value="WORKER_ASSIGNED">WORKER_ASSIGNED (Dispatched)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (On-site work)</option>
                  <option value="WORK_COMPLETED">WORK_COMPLETED (Resolved)</option>
                  <option value="CITIZEN_VERIFIED">CITIZEN_VERIFIED (Closed & Rated)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assign Field Worker / Unit</label>
                <input
                  type="text"
                  placeholder="e.g. Worker Team Alpha / Electrical Unit 4"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Work Completion Photo URL</label>
                <input
                  type="text"
                  placeholder="https://... (Image URL of resolved work)"
                  value={workImageUrl}
                  onChange={(e) => setWorkImageUrl(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Officer Progress Notes</label>
                <textarea
                  rows="2"
                  placeholder="Enter remarks regarding site work..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-lg hover:shadow-sky-500/20"
              >
                Save Progress & Notify Citizen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

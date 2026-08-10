import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/OverviewTab';
import { MapViewTab } from './components/MapViewTab';
import { ComplaintsTab } from './components/ComplaintsTab';
import { AdminTab } from './components/AdminTab';
import { AIDiagnosticsTab } from './components/AIDiagnosticsTab';
import { CitizenAppModal } from './components/CitizenAppModal';
import { Login } from './components/Login';
import api from './services/api';
import { PlusCircle, FileText, MapPin, CheckCircle, Clock, AlertTriangle, List } from 'lucide-react';

// ─── Citizen: My Complaints tab ───────────────────────────────────────────────
const MyCitizenComplaints = ({ complaints, onNewComplaint }) => {
  const statusColors = {
    PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    IN_PROGRESS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    RESOLVED: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  const statusIcons = {
    PENDING: <Clock className="w-3.5 h-3.5" />,
    IN_PROGRESS: <AlertTriangle className="w-3.5 h-3.5" />,
    RESOLVED: <CheckCircle className="w-3.5 h-3.5" />,
    REJECTED: <AlertTriangle className="w-3.5 h-3.5" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Complaints</h1>
          <p className="text-slate-400 text-sm mt-1">Track all the issues you have reported</p>
        </div>
        <button
          onClick={onNewComplaint}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: complaints.length, color: 'from-slate-700 to-slate-800' },
          { label: 'Pending', count: complaints.filter(c => c.status === 'PENDING').length, color: 'from-yellow-900/60 to-yellow-800/40' },
          { label: 'In Progress', count: complaints.filter(c => c.status === 'IN_PROGRESS').length, color: 'from-blue-900/60 to-blue-800/40' },
          { label: 'Resolved', count: complaints.filter(c => c.status === 'RESOLVED').length, color: 'from-emerald-900/60 to-emerald-800/40' },
        ].map(s => (
          <div key={s.label} className={`p-4 rounded-2xl bg-gradient-to-br ${s.color} border border-white/10`}>
            <p className="text-3xl font-bold text-white">{s.count}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Complaints list */}
      {complaints.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <List className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No complaints yet</p>
          <p className="text-sm mt-1">Tap "New Complaint" to report a civic issue</p>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map(c => (
            <div key={c.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-white text-sm">{c.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.address || 'Location not specified'}</p>
                </div>
                <span className={`flex items-center space-x-1 text-[10px] font-bold px-2 py-1 rounded-full border ${statusColors[c.status] || statusColors.PENDING}`}>
                  {statusIcons[c.status]}
                  <span>{c.status?.replace('_', ' ')}</span>
                </span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                <span className="bg-slate-700 px-2 py-0.5 rounded">{c.category}</span>
                <span>#{c.tracking_code}</span>
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Citizen: Submit Complaint tab ────────────────────────────────────────────
const SubmitComplaintTab = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    address: '',
    latitude: '13.0827',
    longitude: '80.2707',
    image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = ['Pothole', 'Street Light', 'Garbage', 'Water Leak', 'Sewage', 'Illegal Parking', 'Noise Pollution', 'Other'];

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category) return;
    setLoading(true);
    try {
      await onSubmit(form);
      setSuccess(true);
      setForm({ title: '', description: '', category: 'Pothole', address: '', latitude: '13.0827', longitude: '80.2707', image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to submit complaint. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Submit a Complaint</h1>
        <p className="text-slate-400 text-sm mt-1">Report a civic issue in your area</p>
      </div>

      {success && (
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/30 text-emerald-300">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Complaint submitted successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800/60 rounded-2xl p-6 border border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Issue Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. Large pothole on main road" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
            placeholder="Describe the issue in detail..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Address / Location</label>
          <input name="address" value={form.address} onChange={handleChange}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            placeholder="e.g. 12 Anna Salai, Chennai" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Latitude</label>
            <input name="latitude" value={form.latitude} onChange={handleChange} type="number" step="any"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Longitude</label>
            <input name="longitude" value={form.longitude} onChange={handleChange} type="number" step="any"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-60 shadow-lg">
          {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
            <><PlusCircle className="w-4 h-4" /><span>Submit Complaint</span></>
          )}
        </button>
      </form>
    </div>
  );
};

// ─── User Management stub (Admin only) ────────────────────────────────────────
const UsersTab = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-white">User Management</h1>
    <div className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700 text-center text-slate-500">
      <p className="text-sm">User management panel coming soon.</p>
    </div>
  </div>
);

// ─── Main App Content ─────────────────────────────────────────────────────────
const AppContent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  const role = user?.role || 'CITIZEN';

  // Default tab per role
  const defaultTab = role === 'CITIZEN' ? 'MY_COMPLAINTS' : 'OVERVIEW';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showCitizenAppModal, setShowCitizenAppModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const tab = user.role === 'CITIZEN' ? 'MY_COMPLAINTS' : 'OVERVIEW';
      setActiveTab(tab);
      fetchData(user);
    }
  }, [isAuthenticated, user?.id]);

  const fetchData = async (u) => {
    const currentUser = u || user;
    if (!currentUser) return;
    setDataLoading(true);
    try {
      const compUrl = currentUser.role === 'CITIZEN'
        ? `/complaints/?citizen_id=${currentUser.id}`
        : `/complaints/`;
      const [compRes, deptRes] = await Promise.all([
        api.get(compUrl),
        api.get('/admin/departments').catch(() => ({ data: [] })),
      ]);
      setComplaints(compRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-3">
        <div className="w-10 h-10 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading CivicEye...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleAddComplaint = async (newComp) => {
    try {
      const payload = {
        title: newComp.title || 'Civic Complaint',
        description: newComp.description || '',
        category: newComp.category || 'Pothole',
        latitude: parseFloat(newComp.latitude) || 13.0827,
        longitude: parseFloat(newComp.longitude) || 80.2707,
        address: newComp.address || 'Detected GPS Location',
        zone_name: newComp.zone_name || 'Zone 1',
        image_url: newComp.image_url || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600',
      };
      const res = await api.post('/complaints/', payload);
      setComplaints(prev => [res.data, ...prev]);
    } catch (error) {
      console.error('Error adding complaint', error);
      alert('Failed to submit complaint to database. Make sure the server is running.');
    }
  };

  const handleUpdateStatus = async (id, updateData) => {
    try {
      const res = await api.put(`/complaints/${id}/status`, updateData);
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
    } catch (error) {
      console.error('Error updating status', error);
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar onOpenCitizenApp={() => setShowCitizenAppModal(true)} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto min-h-[calc(100vh-65px)]">
          {dataLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* CITIZEN TABS */}
              {activeTab === 'MY_COMPLAINTS' && (
                <MyCitizenComplaints
                  complaints={complaints}
                  onNewComplaint={() => setActiveTab('SUBMIT_COMPLAINT')}
                />
              )}
              {activeTab === 'SUBMIT_COMPLAINT' && (
                <SubmitComplaintTab onSubmit={async (form) => {
                  await handleAddComplaint(form);
                  setActiveTab('MY_COMPLAINTS');
                }} />
              )}

              {/* SHARED TABS */}
              {activeTab === 'OVERVIEW' && (
                <OverviewTab complaints={complaints} departments={departments} />
              )}
              {activeTab === 'MAP' && (
                <MapViewTab
                  complaints={complaints}
                  onSelectComplaint={() => setActiveTab('COMPLAINTS')}
                />
              )}
              {activeTab === 'COMPLAINTS' && (
                <ComplaintsTab
                  complaints={complaints}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}

              {/* ADMIN TABS */}
              {activeTab === 'ADMIN' && <AdminTab departments={departments} />}
              {activeTab === 'AI_DIAGNOSTICS' && <AIDiagnosticsTab />}
              {activeTab === 'USERS' && <UsersTab />}
            </>
          )}
        </main>
      </div>

      {showCitizenAppModal && (
        <CitizenAppModal
          onClose={() => setShowCitizenAppModal(false)}
          onAddComplaint={handleAddComplaint}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

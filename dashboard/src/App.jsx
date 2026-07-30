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

const AppContent = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showCitizenAppModal, setShowCitizenAppModal] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      // If citizen, fetch only their complaints, else fetch all
      const compUrl = user.role === 'CITIZEN' ? `/complaints/?citizen_id=${user.id}` : `/complaints/`;
      const [compRes, deptRes] = await Promise.all([
        api.get(compUrl),
        api.get('/admin/departments')
      ]);
      setComplaints(compRes.data);
      setDepartments(deptRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  }

  // If not authenticated, show the Login/Signup page
  if (!isAuthenticated) {
    return <Login />;
  }

  const handleAddComplaint = async (newComp) => {
    try {
      const res = await api.post('/complaints/', newComp);
      setComplaints(prev => [res.data, ...prev]);
    } catch (error) {
      console.error("Error adding complaint", error);
      alert("Failed to submit complaint.");
    }
  };

  const handleUpdateStatus = async (id, updateData) => {
    try {
      const res = await api.put(`/complaints/${id}/status`, updateData);
      setComplaints(prev => prev.map(c => c.id === id ? res.data : c));
    } catch (error) {
      console.error("Error updating status", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar onOpenCitizenApp={() => setShowCitizenAppModal(true)} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {dataLoading ? (
            <div className="flex justify-center items-center h-64 text-slate-500">Loading data...</div>
          ) : (
            <>
              {activeTab === 'OVERVIEW' && <OverviewTab complaints={complaints} departments={departments} />}
              {activeTab === 'MAP' && (
                <MapViewTab 
                  complaints={complaints} 
                  onSelectComplaint={(c) => setActiveTab('COMPLAINTS')} 
                />
              )}
              {activeTab === 'COMPLAINTS' && (
                <ComplaintsTab 
                  complaints={complaints} 
                  onUpdateStatus={handleUpdateStatus} 
                />
              )}
              {activeTab === 'ADMIN' && <AdminTab departments={departments} />}
              {activeTab === 'AI_DIAGNOSTICS' && <AIDiagnosticsTab />}
            </>
          )}
        </main>
      </div>

      {/* Citizen App Simulator Modal */}
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

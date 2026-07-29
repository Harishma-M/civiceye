import React, { useState, useMemo } from 'react';
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
import { MOCK_COMPLAINTS, MOCK_DEPARTMENTS } from './services/mockData';

const AppContent = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [showCitizenAppModal, setShowCitizenAppModal] = useState(false);

  // If not authenticated, show the Login/Signup page
  if (!isAuthenticated) {
    return <Login />;
  }

  // Isolate data based on user role
  const visibleComplaints = complaints.filter(c => {
    if (user.role === 'CITIZEN') {
      return c.reported_by.id === user.id;
    }
    // Admin and Officer see all (in a real app, Officer would see department specific)
    return true;
  });

  const handleAddComplaint = (newComp) => {
    // Add the user to the reported_by field
    const compWithUser = {
      ...newComp,
      reported_by: {
        id: user.id,
        name: user.name,
        contact: user.email,
        trust_score: 95
      }
    };
    setComplaints(prev => [compWithUser, ...prev]);
  };

  const handleUpdateStatus = (id, updateData) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: updateData.status,
          field_worker: updateData.field_worker || c.field_worker,
          after_image_url: updateData.work_image_url || c.after_image_url,
          history: [
            ...c.history,
            {
              status: updateData.status,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
              notes: updateData.notes || `Status updated to ${updateData.status}`,
              updated_by: 'Officer Portal'
            }
          ]
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Navbar onOpenCitizenApp={() => setShowCitizenAppModal(true)} />
      
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'OVERVIEW' && <OverviewTab complaints={visibleComplaints} departments={departments} />}
          {activeTab === 'MAP' && (
            <MapViewTab 
              complaints={visibleComplaints} 
              onSelectComplaint={(c) => {
                setActiveTab('COMPLAINTS');
              }} 
            />
          )}
          {activeTab === 'COMPLAINTS' && (
            <ComplaintsTab 
              complaints={visibleComplaints} 
              onUpdateStatus={handleUpdateStatus} 
            />
          )}
          {activeTab === 'ADMIN' && <AdminTab departments={departments} />}
          {activeTab === 'AI_DIAGNOSTICS' && <AIDiagnosticsTab />}
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

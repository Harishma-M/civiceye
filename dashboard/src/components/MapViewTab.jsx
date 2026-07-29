import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Filter, MapPin, AlertCircle, Clock, CheckCircle2, ShieldCheck, ExternalLink, QrCode } from 'lucide-react';

// Custom Marker Icons
const createCustomIcon = (colorHex) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${colorHex}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px ${colorHex};"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const statusColors = {
  SUBMITTED: '#ef4444',        // Red
  OFFICER_NOTIFIED: '#ef4444', // Red
  ACCEPTED: '#eab308',         // Yellow
  WORKER_ASSIGNED: '#eab308',  // Yellow
  IN_PROGRESS: '#eab308',      // Yellow
  WORK_COMPLETED: '#10b981',   // Green
  CITIZEN_VERIFIED: '#3b82f6'  // Blue
};

export const MapViewTab = ({ complaints, onSelectComplaint }) => {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState(complaints[0]);

  const filteredComplaints = complaints.filter(c => {
    if (filterCategory !== 'ALL' && c.category !== filterCategory) return false;
    if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    return true;
  });

  const categories = ['ALL', ...new Set(complaints.map(c => c.category))];

  return (
    <div className="space-y-4">
      {/* Map Control Header */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-sky-500" />
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Live Spatial Complaint Map</h3>
            <p className="text-xs text-slate-400">Real-time GPS complaint markers & 30m duplicate detection radius</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-300"></span><span className="text-slate-600 dark:text-slate-300">Pending (Red)</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-300"></span><span className="text-slate-600 dark:text-slate-300">In Progress (Yellow)</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-300"></span><span className="text-slate-600 dark:text-slate-300">Completed (Green)</span></span>
          <span className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-sky-500 ring-2 ring-sky-300"></span><span className="text-slate-600 dark:text-slate-300">Verified (Blue)</span></span>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>)}
          </select>

          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Map & Detail Drawer Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg relative">
          <MapContainer 
            center={[13.0827, 80.2707]} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredComplaints.map((c) => {
              const markerColor = statusColors[c.status] || '#ef4444';
              return (
                <React.Fragment key={c.id}>
                  <Marker 
                    position={[c.latitude, c.longitude]} 
                    icon={createCustomIcon(markerColor)}
                    eventHandlers={{
                      click: () => setSelectedComplaint(c)
                    }}
                  >
                    <Popup>
                      <div className="p-1 font-sans text-xs">
                        <p className="font-bold text-slate-800">{c.tracking_code}</p>
                        <p className="text-slate-600 font-semibold">{c.title}</p>
                        <p className="text-[10px] text-sky-600 font-medium">{c.category} • {c.priority}</p>
                      </div>
                    </Popup>
                  </Marker>
                  {/* 30m Haversine duplicate detection radius circle */}
                  <Circle 
                    center={[c.latitude, c.longitude]} 
                    radius={30} 
                    pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.15 }} 
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Complaint Inspector Card */}
        {selectedComplaint ? (
          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-y-auto space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded">
                  {selectedComplaint.tracking_code}
                </span>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{selectedComplaint.title}</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                selectedComplaint.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' : 'bg-amber-100 text-amber-700'
              }`}>
                {selectedComplaint.priority}
              </span>
            </div>

            {/* Complaint Image */}
            <div className="relative rounded-xl overflow-hidden group">
              <img src={selectedComplaint.image_url} alt="Civic Issue" className="w-full h-40 object-cover" />
              <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-bold flex items-center space-x-1">
                <span>AI Confidence: {selectedComplaint.ai_confidence}%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Description</p>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <p className="text-slate-400 font-medium text-[10px]">Category</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{selectedComplaint.category}</p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  <p className="text-slate-400 font-medium text-[10px]">Department</p>
                  <p className="font-bold text-sky-600 dark:text-sky-400 truncate">{selectedComplaint.department}</p>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-slate-400 font-medium text-[10px]">Location Address</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{selectedComplaint.address}</p>
                </div>
                <img src={selectedComplaint.qr_code_url} alt="QR Code" className="w-10 h-10 rounded border" />
              </div>
            </div>

            <button
              onClick={() => onSelectComplaint(selectedComplaint)}
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
            >
              <span>Manage in Officer Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="glass-card p-6 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
            Select a marker on the map to inspect details
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  AlertCircle, CheckCircle2, Clock, Flame, ThumbsUp, 
  TrendingUp, Building, PieChart as PieIcon, BarChart3 
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export const OverviewTab = ({ complaints, departments }) => {
  const total = complaints.length;
  const resolved = complaints.filter(c => ['WORK_COMPLETED', 'CITIZEN_VERIFIED'].includes(c.status)).length;
  const pending = complaints.filter(c => ['SUBMITTED', 'OFFICER_NOTIFIED'].includes(c.status)).length;
  const inProgress = complaints.filter(c => ['ACCEPTED', 'WORKER_ASSIGNED', 'IN_PROGRESS'].includes(c.status)).length;
  const critical = complaints.filter(c => c.priority === 'CRITICAL').length;

  // Chart 1: Monthly Trend
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Reported Issues',
        data: [140, 165, 210, 185, 240, 290, total * 15],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Resolved Issues',
        data: [132, 158, 198, 179, 226, 274, resolved * 15],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart 2: Category Breakdown
  const categoryCounts = complaints.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [
      {
        data: Object.values(categoryCounts),
        backgroundColor: [
          '#ef4444', '#f59e0b', '#3b82f6', '#10b981', 
          '#8b5cf6', '#ec4899', '#64748b'
        ],
        borderWidth: 0
      }
    ]
  };

  // Chart 3: Department Performance
  const barData = {
    labels: departments.map(d => d.code),
    datasets: [
      {
        label: 'Assigned',
        data: departments.map(d => d.assigned),
        backgroundColor: '#3b82f6'
      },
      {
        label: 'Resolved',
        data: departments.map(d => d.resolved),
        backgroundColor: '#10b981'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-sky-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Complaints</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{total * 34}</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14% this month
            </span>
          </div>
          <div className="p-3 bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 rounded-xl">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-emerald-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resolved & Verified</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{resolved * 28}</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center mt-1">
              91.4% resolution rate
            </span>
          </div>
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-amber-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">In-Progress</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{inProgress * 6}</h3>
            <span className="text-[10px] text-amber-500 font-semibold flex items-center mt-1">
              <Clock className="w-3 h-3 mr-0.5" /> Avg SLA 18.5 hrs
            </span>
          </div>
          <div className="p-3 bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-rose-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Priority</p>
            <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{critical * 4}</h3>
            <span className="text-[10px] text-rose-500 font-semibold flex items-center mt-1">
              <Flame className="w-3 h-3 mr-0.5" /> 6-hour emergency SLA
            </span>
          </div>
          <div className="p-3 bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 rounded-xl">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl border-l-4 border-l-indigo-500 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Citizen Rating</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">4.8 / 5</h3>
            <span className="text-[10px] text-indigo-500 font-semibold flex items-center mt-1">
              <ThumbsUp className="w-3 h-3 mr-0.5" /> 96% positive feedback
            </span>
          </div>
          <div className="p-3 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <ThumbsUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Line Chart */}
        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Complaint Resolution Trends</h3>
              <p className="text-xs text-slate-400">Monthly reported vs resolved civic issues</p>
            </div>
            <span className="text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 px-2.5 py-1 rounded-lg border border-sky-200 dark:border-sky-800">
              2026 Analytics
            </span>
          </div>
          <div className="h-64">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Category Doughnut Chart */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Complaint Categories</h3>
              <PieIcon className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-400 mb-4">12-Class AI classification breakdown</p>
          </div>
          <div className="h-52 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      {/* Department Performance Bar Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Department Workload</h3>
            <Building className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-60">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="lg:col-span-2 glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Municipal Department Efficiency</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-2">Department Name</th>
                  <th className="pb-2">Assigned</th>
                  <th className="pb-2">Resolved</th>
                  <th className="pb-2">Resolution Rate</th>
                  <th className="pb-2">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {departments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{dept.name}</td>
                    <td className="py-3 font-medium text-slate-600 dark:text-slate-400">{dept.assigned}</td>
                    <td className="py-3 font-medium text-emerald-600 dark:text-emerald-400">{dept.resolved}</td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${dept.rate}%` }} />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{dept.rate}%</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-slate-500">{dept.avg_time} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

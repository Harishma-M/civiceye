import React from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export const AIDiagnosticsTab = () => {
  const classes = [
    { name: 'Road Damage', accuracy: 96.2, samples: 412 },
    { name: 'Pothole', accuracy: 97.4, samples: 530 },
    { name: 'Garbage', accuracy: 95.8, samples: 620 },
    { name: 'Street Light', accuracy: 98.1, samples: 380 },
    { name: 'Water Leakage', accuracy: 94.5, samples: 290 },
    { name: 'Open Drain', accuracy: 93.8, samples: 210 },
    { name: 'Illegal Dumping', accuracy: 95.1, samples: 340 },
    { name: 'Broken Traffic Signal', accuracy: 97.8, samples: 180 },
    { name: 'Fallen Tree', accuracy: 98.9, samples: 150 },
    { name: 'Public Toilet Damage', accuracy: 92.4, samples: 120 },
    { name: 'Sewage Overflow', accuracy: 93.2, samples: 270 },
    { name: 'Others', accuracy: 91.0, samples: 95 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-tr from-sky-600 to-indigo-600 text-white rounded-xl shadow-md">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">YOLOv8 & PyTorch Computer Vision Diagnostics</h3>
            <p className="text-xs text-slate-400">Model accuracy metrics, 12-class breakdown, and manual review flags</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
          <Zap className="w-4 h-4" />
          <span>Overall Accuracy: 95.7%</span>
        </div>
      </div>

      {/* 12-Class Grid */}
      <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">12-Class Image Classification Performance</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classes.map((cls) => (
            <div key={cls.name} className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{cls.name}</span>
                <span className="font-mono text-emerald-500 font-bold">{cls.accuracy}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full" style={{ width: `${cls.accuracy}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 text-right">{cls.samples} validation images</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

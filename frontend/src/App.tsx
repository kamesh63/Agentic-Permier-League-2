import React from 'react';
import { useFitnessStore } from './stores/fitnessStore';
import Dashboard from './components/Dashboard';
import Workouts from './components/Workouts';
import Nutrition from './components/Nutrition';
import Progress from './components/Progress';

const tabs = [
  { id: 'dashboard' as const, label: 'Dashboard', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>) },
  { id: 'workouts' as const, label: 'Workouts', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M6.5 6.5l11 11M6.5 17.5l11-11M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>) },
  { id: 'nutrition' as const, label: 'Nutrition', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>) },
  { id: 'progress' as const, label: 'Progress', icon: (<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>) },
];

export default function App() {
  const { activeTab, setActiveTab, userXP, streak, getLevel, getXPInCurrentLevel } = useFitnessStore();
  const level = getLevel();
  const xpInLevel = getXPInCurrentLevel();
  const xpPct = (xpInLevel / 500) * 100;

  return (
    <div className="layout-root">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <div className="sidebar-title">FitSense</div>
            <div className="sidebar-subtitle">AI Platform</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {tabs.map((tab) => (
            <button key={tab.id} className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <span className="sidebar-link-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-level-card">
          <div className="sidebar-level-header">
            <span>Level {level}</span>
            <span className="sidebar-streak">🔥 {streak}d</span>
          </div>
          <div className="sidebar-xp-bar">
            <div className="sidebar-xp-fill" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="sidebar-xp-label">{xpInLevel}/500 XP · Total: {userXP}</div>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-scroll">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'workouts' && <Workouts />}
          {activeTab === 'nutrition' && <Nutrition />}
          {activeTab === 'progress' && <Progress />}
        </div>
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { CandidatePipeline } from './components/candidates/CandidatePipeline';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { InternshipDirectory } from './components/internships/InternshipDirectory';
import { TaskManager } from './components/tasks/TaskManager';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { LeaveManagement } from './components/leave/LeaveManagement';
import { PerformanceEscalation } from './components/performance/PerformanceEscalation';
import { CompletionManager } from './components/completion/CompletionManager';
import { SystemReports } from './components/reports/SystemReports';
import { AuditTrail } from './components/audit/AuditTrail';
import { SystemSettings } from './components/settings/SystemSettings';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Dynamic Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
          {currentTab === 'candidates' && <CandidatePipeline />}
          {currentTab === 'onboarding' && <OnboardingView />}
          {currentTab === 'internships' && <InternshipDirectory />}
          {currentTab === 'tasks' && <TaskManager />}
          {currentTab === 'attendance' && <AttendanceTracker />}
          {currentTab === 'leaves' && <LeaveManagement />}
          {currentTab === 'performance' && <PerformanceEscalation />}
          {currentTab === 'completion' && <CompletionManager />}
          {currentTab === 'reports' && <SystemReports />}
          {currentTab === 'audit' && <AuditTrail />}
          {currentTab === 'settings' && <SystemSettings />}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

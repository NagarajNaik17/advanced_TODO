import React from 'react';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Goals from './pages/Goals';
import CalendarPage from './pages/Calendar';
import Statistics from './pages/Statistics';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

function App() {
  const { activePage, toast } = useApp();

  // Route resolver mapping nested folders to specific viewModes
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      
      // Task Management Router
      case 'tasks-all':
        return <Tasks viewMode="all" />;
      case 'tasks-daily':
        return <Tasks viewMode="daily" />;
      case 'tasks-weekly':
        return <Tasks viewMode="weekly" />;
      case 'tasks-monthly':
        return <Tasks viewMode="monthly" />;
      case 'tasks-custom':
        return <Tasks viewMode="custom" />;
      
      // Habit Management Router
      case 'habits-daily':
        return <Habits viewMode="daily" />;
      case 'habits-weekly':
        return <Habits viewMode="weekly" />;
      case 'habits-monthly':
        return <Habits viewMode="monthly" />;
        
      case 'goals':
        return <Goals />;
      case 'calendar':
        return <CalendarPage />;
      case 'statistics':
        return <Statistics />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Toast notification UI
  const renderToast = () => {
    if (!toast) return null;

    const { message, type } = toast;
    const styles = {
      success: 'bg-emerald-950/90 border-emerald-500/30 text-emerald-400',
      error: 'bg-rose-950/90 border-rose-500/30 text-rose-400',
      info: 'bg-primary-950/90 border-primary-500/30 text-primary-400'
    };

    const icons = {
      success: <CheckCircle size={16} className="text-emerald-400" />,
      error: <AlertCircle size={16} className="text-rose-400" />,
      info: <Info size={16} className="text-primary-400" />
    };

    return (
      <div className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-slideIn
        ${styles[type] || styles.info}
      `}>
        {icons[type]}
        <span className="text-xs font-bold tracking-wide">{message}</span>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-darkBg text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Workspace */}
      <main className="flex-1 h-screen overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
        <div className="max-w-7xl mx-auto pb-16">
          {renderPage()}
        </div>
      </main>

      {/* Dynamic Toast overlay alerts */}
      {renderToast()}
    </div>
  );
}

export default App;

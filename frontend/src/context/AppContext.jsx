import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const AppProvider = ({ children }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [quote, setQuote] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [habitHistory, setHabitHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Theme System State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Apply and persist Theme
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Check achievements response and notify
  const handleAchievements = (newAchievements) => {
    if (newAchievements && newAchievements.length > 0) {
      newAchievements.forEach((ach) => {
        showToast(`🏆 Achievement Unlocked: ${ach.title}!`, 'success');
      });
      fetchAchievements();
    }
  };

  // --- API Fetches ---
  
  const fetchTasks = async (filters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${API_BASE}/tasks?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_BASE}/goals`);
      if (!response.ok) throw new Error('Failed to fetch goals');
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const fetchQuote = async (isRandom = false) => {
    try {
      const endpoint = isRandom ? 'random' : 'today';
      const response = await fetch(`${API_BASE}/quotes/${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      setQuote(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE}/achievements`);
      if (!response.ok) throw new Error('Failed to fetch achievements');
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      if (!response.ok) throw new Error('Failed to fetch statistics');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHabitHistory = async (taskId) => {
    try {
      let url = `${API_BASE}/tasks/habithistory`;
      if (taskId) {
        url += `?taskId=${taskId}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch habit history');
      const data = await response.json();
      setHabitHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  // --- Task Actions ---

  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to create task');
      const newTask = await response.json();
      setTasks(prev => [newTask, ...prev]);
      showToast('Task created successfully', 'success');
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!response.ok) throw new Error('Failed to update task');
      const { task: updatedTask, unlockedAchievements } = await response.json();
      
      if (updatedTask.archived) {
        setTasks(prev => prev.filter(t => t._id !== id));
      } else {
        setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
      }

      showToast('Task updated successfully', 'success');
      handleAchievements(unlockedAchievements);
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t._id !== id));
      showToast('Task deleted successfully', 'success');
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update status');
      const { task: updatedTask, unlockedAchievements } = await response.json();
      
      // If task was archived (non-repeatable completed), remove it from active lists
      if (updatedTask.archived) {
        setTasks(prev => prev.filter(t => t._id !== id));
      } else {
        setTasks(prev => prev.map(t => t._id === id ? updatedTask : t));
      }
      
      showToast(`Task marked as ${status.replace('_', ' ')}`, 'success');
      handleAchievements(unlockedAchievements);
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  // --- Goal Actions ---

  const createGoal = async (goalData) => {
    try {
      const response = await fetch(`${API_BASE}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      if (!response.ok) throw new Error('Failed to create goal');
      const newGoal = await response.json();
      setGoals(prev => [newGoal, ...prev]);
      showToast('Goal created successfully', 'success');
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const updateGoal = async (id, goalData) => {
    try {
      const response = await fetch(`${API_BASE}/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      if (!response.ok) throw new Error('Failed to update goal');
      const { goal: updatedGoal, unlockedAchievements } = await response.json();
      setGoals(prev => prev.map(g => g._id === id ? updatedGoal : g));
      showToast('Goal updated', 'success');
      handleAchievements(unlockedAchievements);
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const deleteGoal = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/goals/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(prev => prev.filter(g => g._id !== id));
      showToast('Goal deleted', 'success');
      fetchStats();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  // Load initial global data
  useEffect(() => {
    fetchTasks();
    fetchGoals();
    fetchQuote();
    fetchAchievements();
    fetchStats();
  }, []);

  return (
    <AppContext.Provider value={{
      activePage,
      setActivePage,
      tasks,
      goals,
      quote,
      achievements,
      stats,
      habitHistory,
      loading,
      toast,
      theme,
      toggleTheme,
      showToast,
      fetchTasks,
      fetchGoals,
      fetchQuote,
      fetchAchievements,
      fetchStats,
      fetchHabitHistory,
      createTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      createGoal,
      updateGoal,
      deleteGoal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

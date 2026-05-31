import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import TaskCard from '../components/TaskCard';
import { Plus, Search, Filter, ArrowUpDown, X, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

const Tasks = ({ viewMode = 'all' }) => {
  const { tasks, createTask, updateTask, fetchTasks } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, repeatable, non-repeatable
  const [filterStatus, setFilterStatus] = useState('all'); // all, not_started, partially_done, completed
  const [sortBy, setSortBy] = useState('createdAt'); // createdAt, dueDate, title
  
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [type, setType] = useState('non-repeatable');
  const [category, setCategory] = useState('daily');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().add(7, 'day').format('YYYY-MM-DD'));

  // Fetch tasks. We pass query params to the backend
  useEffect(() => {
    const filters = {
      sort: sortBy
    };
    if (search) filters.search = search;
    if (filterType !== 'all') filters.type = filterType;
    if (filterStatus !== 'all') filters.status = filterStatus;
    
    // If daily/weekly/monthly specific views, send category query filter
    if (viewMode === 'daily' || viewMode === 'weekly' || viewMode === 'monthly') {
      filters.category = viewMode;
    }

    fetchTasks(filters);
  }, [viewMode, search, filterType, filterStatus, sortBy]);

  // Frontend filter tasks based on view mode (to handle custom duration toggles perfectly)
  const getFilteredTasks = () => {
    return tasks.filter(task => {
      if (viewMode === 'all') return true;
      if (viewMode === 'custom') return task.isCustomDuration;
      // For daily, weekly, monthly, filter tasks that are NOT custom duration
      return task.category === viewMode && !task.isCustomDuration;
    });
  };

  const filteredTasksList = getFilteredTasks();

  const getPageHeaders = () => {
    switch (viewMode) {
      case 'daily':
        return { title: 'Daily Tasks', desc: 'Routines and habits expected to be completed within a day.' };
      case 'weekly':
        return { title: 'Weekly Tasks', desc: 'Tasks expected to be completed within a week.' };
      case 'monthly':
        return { title: 'Monthly Tasks', desc: 'Tasks expected to be completed within a month.' };
      case 'custom':
        return { title: 'Custom Duration Tasks', desc: 'Multi-day projects and long-term milestones.' };
      default:
        return { title: 'All Tasks Workspace', desc: 'Comprehensive list of all your active routines and projects.' };
    }
  };

  const headers = getPageHeaders();

  // Open modal for creation prefilled
  const handleOpenCreate = () => {
    setEditingTask(null);
    setTitle('');
    setType(viewMode === 'daily' || viewMode === 'weekly' ? 'repeatable' : 'non-repeatable');
    setCategory(viewMode === 'all' || viewMode === 'custom' ? 'daily' : viewMode);
    setIsCustomDuration(viewMode === 'custom');
    setStartDate(dayjs().format('YYYY-MM-DD'));
    setEndDate(dayjs().add(7, 'day').format('YYYY-MM-DD'));
    setShowModal(true);
  };

  // Open modal for edit
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setType(task.type);
    setCategory(task.category);
    setIsCustomDuration(task.isCustomDuration);
    if (task.startDate) setStartDate(dayjs(task.startDate).format('YYYY-MM-DD'));
    if (task.endDate) setEndDate(dayjs(task.endDate).format('YYYY-MM-DD'));
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      title,
      type,
      category,
      isCustomDuration,
      startDate: isCustomDuration ? new Date(startDate) : undefined,
      endDate: isCustomDuration ? new Date(endDate) : undefined
    };

    if (editingTask) {
      updateTask(editingTask._id, taskData);
    } else {
      createTask(taskData);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            {headers.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{headers.desc}</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-accent-purple hover:from-primary-500 hover:to-accent-purple/90 text-white font-semibold shadow-glow hover:shadow-glow/80 active:scale-95 transition-all duration-200"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-lightCard dark:bg-darkCard/40 border border-lightBorder dark:border-darkBorder/30 p-4 rounded-2xl">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-lightText dark:text-darkText placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="repeatable">Repeatable</option>
            <option value="non-repeatable">One-time</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="not_started">Not Started</option>
            <option value="partially_done">Partially Done</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-600 dark:text-slate-300 focus:outline-none"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      {filteredTasksList.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
          <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="font-semibold text-lg">No tasks found</p>
          <p className="text-xs text-slate-500 mt-1">Get started by creating a new task or adjust your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasksList.map((task) => (
            <TaskCard 
              key={task._id} 
              task={task} 
              onEdit={handleOpenEdit} 
            />
          ))}
        </div>
      )}

      {/* Creation/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel-glow p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-lightBorder dark:border-darkBorder/40 pb-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {editingTask ? 'Edit Task Details' : 'Create New Task'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-slate-800 dark:text-slate-200">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read atomic habits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder focus:outline-none focus:border-primary-500 text-lightText dark:text-darkText placeholder-slate-400 dark:placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Task Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-600 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="non-repeatable">One-time Task</option>
                    <option value="repeatable">Repeatable (Habit)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-slate-600 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Custom Duration Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="customDuration"
                  checked={isCustomDuration}
                  onChange={(e) => setIsCustomDuration(e.target.checked)}
                  className="rounded bg-slate-50 dark:bg-darkBg border-lightBorder dark:border-darkBorder text-primary-600 focus:ring-primary-500 h-4 w-4"
                />
                <label htmlFor="customDuration" className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase cursor-pointer select-none">
                  Set Custom Duration Timeline
                </label>
              </div>

              {/* Custom Dates */}
              {isCustomDuration && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-darkBg/60 border border-lightBorder dark:border-darkBorder/30 rounded-xl">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-lightText dark:text-darkText"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded bg-slate-50 dark:bg-darkBg border border-lightBorder dark:border-darkBorder text-lightText dark:text-darkText"
                    />
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-lightBorder dark:border-darkBorder/40">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-lg border border-lightBorder dark:border-darkBorder hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                >
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

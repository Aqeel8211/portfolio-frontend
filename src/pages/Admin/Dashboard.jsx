import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FolderIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  EnvelopeIcon,
  PlusIcon,
  EyeIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    education: 0,
    achievements: 0,
    messages: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projects, skills, experiences, education, achievements, messages] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/experiences'),
        api.get('/education'),
        api.get('/achievements'),
        api.get('/contact/messages'),
      ]);

      const messagesData = messages.data;
      const unreadCount = messagesData.filter(m => !m.isRead).length;
      
      setStats({
        projects: projects.data.length,
        skills: skills.data.length,
        experiences: experiences.data.length,
        education: education.data.length,
        achievements: achievements.data.length,
        messages: messagesData.length,
        unreadMessages: unreadCount,
      });
      
      // Get last 3 messages
      setRecentMessages(messagesData.slice(-3).reverse());
      
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/contact/messages/${id}/read`);
      fetchData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const statCards = [
    { 
      title: 'Projects', 
      value: stats.projects, 
      icon: <FolderIcon className="h-6 w-6" />, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      link: '/admin/projects',
      trend: '+2',
      trendUp: true
    },
    { 
      title: 'Skills', 
      value: stats.skills, 
      icon: <CodeBracketIcon className="h-6 w-6" />, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      link: '/admin/skills',
      trend: '+3',
      trendUp: true
    },
    { 
      title: 'Experience', 
      value: stats.experiences, 
      icon: <BriefcaseIcon className="h-6 w-6" />, 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      link: '/admin/experience',
      trend: '0',
      trendUp: null
    },
    { 
      title: 'Education', 
      value: stats.education, 
      icon: <AcademicCapIcon className="h-6 w-6" />, 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-600 dark:text-amber-400',
      link: '/admin/education',
      trend: '-1',
      trendUp: false
    },
    { 
      title: 'Achievements', 
      value: stats.achievements, 
      icon: <TrophyIcon className="h-6 w-6" />, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400',
      link: '/admin/achievements',
      trend: '+1',
      trendUp: true
    },
    { 
      title: 'Messages', 
      value: stats.messages, 
      icon: <EnvelopeIcon className="h-6 w-6" />, 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400',
      link: '/admin/messages',
      badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : null,
      trend: '+5',
      trendUp: true
    },
  ];

  const quickActions = [
    { title: 'Add Project', link: '/admin/projects/new', icon: <PlusIcon className="h-4 w-4" />, color: 'hover:border-blue-500' },
    { title: 'Add Skill', link: '/admin/skills/new', icon: <PlusIcon className="h-4 w-4" />, color: 'hover:border-purple-500' },
    { title: 'Add Experience', link: '/admin/experience/new', icon: <PlusIcon className="h-4 w-4" />, color: 'hover:border-emerald-500' },
    { title: 'View Messages', link: '/admin/messages', icon: <EyeIcon className="h-4 w-4" />, color: 'hover:border-red-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid - 2 columns on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {statCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`${card.bgColor} rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer group border border-gray-100 dark:border-gray-800`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${card.textColor}`}>
                  {card.icon}
                </div>
                {card.trend && (
                  <div className={`flex items-center gap-0.5 text-xs ${
                    card.trendUp === true ? 'text-green-600' : card.trendUp === false ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {card.trendUp === true && <ArrowTrendingUpIcon className="h-3 w-3" />}
                    {card.trendUp === false && <ArrowTrendingDownIcon className="h-3 w-3" />}
                    {card.trendUp === null && <MinusIcon className="h-3 w-3" />}
                    <span>{card.trend}</span>
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{card.title}</div>
              {card.badge && (
                <span className="inline-block mt-2 px-1.5 py-0.5 text-[10px] font-medium rounded bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                  {card.badge}
                </span>
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Two Column Layout - Recent Messages & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Messages - Takes 2/3 on desktop */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
              View all
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message.id} className="px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{message.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{message.subject}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleDateString()} at {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!message.isRead && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="ml-3 px-2 py-1 text-[10px] font-medium rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 transition-colors flex-shrink-0"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center">
                <EnvelopeIcon className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No messages yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions - Takes 1/3 on desktop */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-white transition-all duration-200 ${action.color}`}
                >
                  {action.icon}
                  {action.title}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Summary Stats */}
          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Content Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Total Content Items</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.projects + stats.skills + stats.experiences + stats.education + stats.achievements}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Unread Messages</span>
                <span className={`font-semibold ${stats.unreadMessages > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                  {stats.unreadMessages}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-100 dark:border-gray-800">
                <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Bar */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-4 py-2 flex items-center justify-between border border-green-100 dark:border-green-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-green-700 dark:text-green-300">System Online</span>
        </div>
        <span className="text-[10px] text-green-600 dark:text-green-400">All systems operational</span>
      </div>
    </div>
  );
};

export default Dashboard;
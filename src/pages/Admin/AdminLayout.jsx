import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  FolderIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  EnvelopeIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true for desktop
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check screen size for responsive behavior - runs only on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop (>=768px), sidebar should ALWAYS be open
      // On mobile, sidebar should be closed by default
      setIsSidebarOpen(!mobile);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []); // Empty dependency array - only runs on mount

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('adminToken');
    const username = localStorage.getItem('adminUsername');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUser({ username });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    navigate('/admin/login');
  };

  const goBackToPortfolio = () => {
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: <HomeIcon className="h-5 w-5" />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <FolderIcon className="h-5 w-5" />, label: 'Projects' },
    { path: '/admin/skills', icon: <CodeBracketIcon className="h-5 w-5" />, label: 'Skills' },
    { path: '/admin/experience', icon: <BriefcaseIcon className="h-5 w-5" />, label: 'Experience' },
    { path: '/admin/education', icon: <AcademicCapIcon className="h-5 w-5" />, label: 'Education' },
    { path: '/admin/achievements', icon: <TrophyIcon className="h-5 w-5" />, label: 'Achievements' },
    { path: '/admin/certifications', icon: <TrophyIcon className="h-5 w-5" />, label: 'Certifications' },
    { path: '/admin/messages', icon: <EnvelopeIcon className="h-5 w-5" />, label: 'Messages' },
  ];

  if (!user) return null;

  // Overlay for mobile when sidebar is open
  const renderOverlay = () => {
    if (isMobile && isSidebarOpen) {
      return (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
      {renderOverlay()}
      
      {/* Sidebar */}
      <motion.div
        initial={{ width: isSidebarOpen ? 256 : 0 }}
        animate={{ width: isSidebarOpen ? 256 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed md:relative h-full bg-white dark:bg-gray-800 shadow-lg z-30 overflow-hidden ${
          isSidebarOpen ? 'left-0' : '-left-full md:left-0'
        }`}
        style={{ width: isSidebarOpen ? 256 : 0 }}
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            {isSidebarOpen && (
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h2>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>

          <nav className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={`flex items-center p-2 sm:p-3 rounded-lg transition-colors text-sm sm:text-base ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="w-full flex items-center p-2 sm:p-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm sm:text-base"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </nav>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300 w-full"
        style={{ 
          marginLeft: !isMobile && isSidebarOpen ? 256 : 0,
          paddingLeft: isMobile ? 0 : 0
        }}
      >
        {/* Mobile Header: Menu Button (left) + Back Button (right) */}
        <div className="md:hidden sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <button
            onClick={goBackToPortfolio}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Back to Portfolio"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm">Back to Portfolio</span>
          </button>
        </div>

        {/* Desktop Back Button (top left of content) */}
        <div className="hidden md:block p-4 pb-0">
          <button
            onClick={goBackToPortfolio}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Portfolio
          </button>
        </div>
        
        {/* Page Content */}
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
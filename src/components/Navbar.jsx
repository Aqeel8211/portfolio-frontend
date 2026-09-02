import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();
  const settingsRef = useRef(null);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  // Check and apply dark mode on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
    setIsSettingsOpen(false);
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (location.pathname === '/') {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.clientHeight;
          if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
          }
        });
        if (current && current !== activeSection) {
          setActiveSection(current);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, location.pathname]);

  // ── FIXED: scroll with navbar offset so headings never hide under navbar ──
  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const navbarHeight = 64;   // matches h-16
      const extraPadding = 16;   // 16px breathing room above the heading
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - navbarHeight - extraPadding,
        behavior: 'smooth',
      });
      setActiveSection(href.replace('#', ''));
    }
    setIsOpen(false);
    setIsSettingsOpen(false);
  };

  const isActive = (href) => {
    if (location.pathname !== '/') return false;
    return activeSection === href.replace('#', '');
  };

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0"
            >
              MA
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center space-x-5 lg:space-x-7">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className={`relative text-sm lg:text-base font-medium whitespace-nowrap transition-colors ${
                    isActive(item.href)
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Desktop settings */}
            <div className="hidden md:block relative flex-shrink-0" ref={settingsRef}>
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-opacity shadow-md"
                aria-label="Settings"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <button
                      onClick={toggleDarkMode}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">{isDarkMode ? '☀️' : '🌙'}</span>
                      <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700" />
                    <a
                      href="/admin/login"
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="text-lg">🔒</span>
                      <span className="font-medium">Admin Login</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger — always on top */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-[9999] relative"
              aria-label="Toggle menu"
            >
              {isOpen
                ? <XMarkIcon className="h-6 w-6" />
                : <Bars3Icon className="h-6 w-6" />
              }
            </button>

          </div>
        </div>
      </nav>

      {/* ── Mobile menu overlay + panel ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.28, ease: 'easeInOut' }}
              className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] z-[9995] bg-white dark:bg-gray-900 shadow-2xl md:hidden flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MA
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto py-4 px-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 px-3 mb-2">
                  Navigation
                </p>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                      isActive(item.href)
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {isActive(item.href) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 flex-shrink-0" />
                    )}
                    {item.name}
                  </a>
                ))}

                {/* Divider */}
                <div className="border-t border-gray-100 dark:border-gray-800 my-4 mx-3" />

                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 px-3 mb-2">
                  Settings
                </p>

                {/* Dark mode toggle */}
                <button
                  onClick={() => { toggleDarkMode(); setIsOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mb-0.5"
                >
                  <span className="text-base">{isDarkMode ? '☀️' : '🌙'}</span>
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>

                {/* Admin login */}
                <a
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-base">🔒</span>
                  Admin Login
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
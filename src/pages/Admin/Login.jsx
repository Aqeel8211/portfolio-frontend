import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { username, password }
      );

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUsername', response.data.username);
      
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 sm:mx-0"
      >
        {/* Back Button - Top Left */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors group"
          aria-label="Back to Portfolio"
        >
          <ArrowLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs sm:text-sm font-medium">Back to Portfolio</span>
        </button>

        <div className="text-center mb-6 sm:mb-8 mt-4 sm:mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
            Enter your credentials to access the dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm sm:text-base"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
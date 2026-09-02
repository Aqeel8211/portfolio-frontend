import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await api.get('/achievements');
      setAchievements(response.data);
    } catch (error) {
      toast.error('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;

    try {
      await api.delete(`/achievements/${id}`);
      toast.success('Achievement deleted successfully');
      fetchAchievements();
    } catch (error) {
      toast.error('Failed to delete achievement');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Achievements</h1>
        <Link
          to="/admin/achievements/new"
          className="flex items-center justify-center px-4 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Achievement
        </Link>
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[650px] md:min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {achievements.map((achievement) => (
              <motion.tr
                key={achievement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {/* Image Column */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {achievement.imageUrl ? (
                    <img 
                      src={achievement.imageUrl} 
                      alt={achievement.title} 
                      className="h-8 w-8 sm:h-10 sm:w-10 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-[10px] sm:text-xs text-gray-500">No img</span>
                    </div>
                  )}
                </td>
                
                {/* Title Column */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <div className="text-sm font-medium max-w-[120px] sm:max-w-none truncate">
                    {achievement.title}
                  </div>
                </td>
                
                {/* Description Column - Hidden on mobile */}
                <td className="hidden md:table-cell px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 max-w-[180px] lg:max-w-[250px] truncate">
                    {achievement.description || '-'}
                  </div>
                </td>
                
                {/* Year Column */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span className="text-sm">{achievement.year || '-'}</span>
                </td>
                
                {/* Display Order Column */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {achievement.displayOrder}
                </td>
                
                {/* Actions Column */}
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/achievements/edit/${achievement.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3 inline-block"
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(achievement.id)}
                    className="text-red-600 hover:text-red-900 inline-block"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {achievements.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">No achievements found. Click "Add Achievement" to create one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsList;
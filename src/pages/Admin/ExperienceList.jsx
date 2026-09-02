import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ExperienceList = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experiences');
      setExperiences(response.data);
    } catch (error) {
      toast.error('Failed to load experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;

    try {
      await api.delete(`/experiences/${id}`);
      toast.success('Experience deleted successfully');
      fetchExperiences();
    } catch (error) {
      toast.error('Failed to delete experience');
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Work Experience</h1>
        <Link
          to="/admin/experience/new"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Experience
        </Link>
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[650px] md:min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {experiences.map((exp) => (
              <motion.tr
                key={exp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-sm font-medium">{exp.position}</div>
                  <div className="text-xs sm:text-sm text-gray-500 max-w-[150px] sm:max-w-[200px] truncate">
                    {exp.description?.substring(0, 50)}...
                  </div>
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {exp.company}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {exp.duration}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {exp.isCurrent ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Current</span>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/experience/edit/${exp.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3"
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {experiences.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No experiences found. Click "Add Experience" to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExperienceList;
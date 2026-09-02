import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">Projects</h1>
        <Link
          to="/admin/projects/new"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Project
        </Link>
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[700px] md:min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <motion.tr
                key={project.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-sm font-medium">{project.title}</div>
                  <div className="text-xs sm:text-sm text-gray-500 max-w-[150px] sm:max-w-[250px] truncate">
                    {project.description?.substring(0, 50)}...
                  </div>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {project.category}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {project.date}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {project.isFeatured ? (
                    <span className="text-yellow-600 text-sm">★ Featured</span>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/admin/projects/edit/${project.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3 inline-block"
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-900 inline-block"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {projects.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No projects found. Click "Add Project" to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CertificationsList = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await api.get('/certifications/all');
      setCertifications(response.data);
    } catch (error) {
      toast.error('Failed to load certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification?')) return;

    try {
      await api.delete(`/certifications/${id}`);
      toast.success('Certification deleted successfully');
      fetchCertifications();
    } catch (error) {
      toast.error('Failed to delete certification');
    }
  };

  const handleToggleVisibility = async (id, currentStatus) => {
    try {
      const cert = certifications.find(c => c.id === id);
      await api.put(`/certifications/${id}`, { ...cert, isVisible: !currentStatus });
      toast.success(`Certification ${!currentStatus ? 'visible' : 'hidden'}`);
      fetchCertifications();
    } catch (error) {
      toast.error('Failed to update visibility');
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Certifications & Achievements
        </h1>
        <Link
          to="/admin/certifications/new"
          className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all w-full sm:w-auto"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Certification
        </Link>
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full min-w-[700px] md:min-w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issuer</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
              <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {certifications.map((cert) => (
              <motion.tr
                key={cert.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-3 sm:px-6 py-3 sm:py-4">
                  <div className="text-sm font-medium">{cert.title}</div>
                  {cert.description && (
                    <div className="text-xs sm:text-sm text-gray-500 max-w-[150px] sm:max-w-[200px] truncate">
                      {cert.description.substring(0, 50)}...
                    </div>
                  )}
                </td>
                <td className="hidden sm:table-cell px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {cert.issuer || '-'}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {cert.date || '-'}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                  {cert.isVisible ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Visible</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Hidden</span>
                  )}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm">
                  {cert.displayOrder}
                </td>
                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleToggleVisibility(cert.id, cert.isVisible)}
                    className="text-gray-600 hover:text-gray-900 mr-1 sm:mr-2"
                    title={cert.isVisible ? 'Hide' : 'Show'}
                  >
                    {cert.isVisible ? (
                      <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                    ) : (
                      <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                    )}
                  </button>
                  <Link
                    to={`/admin/certifications/edit/${cert.id}`}
                    className="text-blue-600 hover:text-blue-900 mr-2 sm:mr-3"
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                  </Link>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {certifications.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No certifications found. Click "Add Certification" to create one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsList;
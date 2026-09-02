import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CertificationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    description: '',
    date: '',
    certificateUrl: '',
    imageUrl: '',
    credentialId: '',
    credentialUrl: '',
    displayOrder: 0,
    isVisible: true,
  });

  useEffect(() => {
    if (id) {
      fetchCertification();
    }
  }, [id]);

  const fetchCertification = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/certifications/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load certification');
      navigate('/admin/certifications');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/certifications/${id}`, formData);
        toast.success('Certification updated successfully!');
      } else {
        await api.post('/certifications', formData);
        toast.success('Certification created successfully!');
      }
      navigate('/admin/certifications');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        {id ? 'Edit Certification' : 'Add New Certification'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="e.g., Internship Completion Certificate"
          />
        </div>

        {/* Issuer */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Issuer</label>
          <input
            type="text"
            name="issuer"
            value={formData.issuer}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="e.g., Tech Solutions Inc."
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="Describe the certification or achievement"
          />
        </div>

        {/* Date and Display Order - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Display Order</label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>
        </div>

        {/* Certificate URL */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Certificate URL (PDF or Image)</label>
          <input
            type="text"
            name="certificateUrl"
            value={formData.certificateUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="/images/certificates/certificate.pdf"
          />
          <p className="text-xs text-gray-500 mt-1">Upload file to public/images/certificates/ folder</p>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Thumbnail/Logo URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="/images/certificates/company-logo.png"
          />
        </div>

        {/* Credential ID and Verification URL - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Credential ID</label>
            <input
              type="text"
              name="credentialId"
              value={formData.credentialId}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="e.g., CERT-12345"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Verification URL</label>
            <input
              type="url"
              name="credentialUrl"
              value={formData.credentialUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="https://verify.example.com/certificate"
            />
          </div>
        </div>

        {/* Show on Portfolio Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">Show on Portfolio</span>
          </label>
        </div>

        {/* Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all w-full sm:w-auto"
          >
            {loading ? 'Saving...' : (id ? 'Update Certification' : 'Create Certification')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/certifications')}
            className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificationForm;
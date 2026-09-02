import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AchievementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    iconName: 'FaMedal',
    year: '',
    displayOrder: 0,
    date: '',
    imageUrl: '',
  });

  useEffect(() => {
    if (id) {
      fetchAchievement();
    }
  }, [id]);

  const fetchAchievement = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/achievements/${id}`);
      const data = response.data;
      setFormData({
        id: data.id,
        title: data.title || '',
        description: data.description || '',
        iconName: data.iconName || 'FaMedal',
        year: data.year || '',
        displayOrder: data.displayOrder || 0,
        date: data.date ? data.date.split('T')[0] : '',
        imageUrl: data.imageUrl || '',
      });
    } catch (error) {
      toast.error('Failed to load achievement');
      navigate('/admin/achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      id: formData.id,
      title: formData.title,
      description: formData.description,
      iconName: formData.iconName,
      year: formData.year,
      displayOrder: parseInt(formData.displayOrder) || 0,
      date: formData.date && formData.date !== '' ? formData.date : null,
      imageUrl: formData.imageUrl || null,
    };

    console.log("Submitting:", dataToSubmit);

    try {
      if (id) {
        await api.put(`/achievements/${id}`, dataToSubmit);
        toast.success('Achievement updated successfully!');
      } else {
        await api.post('/achievements', dataToSubmit);
        toast.success('Achievement created successfully!');
      }
      navigate('/admin/achievements');
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data || 'Failed to save achievement');
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
        {id ? 'Edit Achievement' : 'Add New Achievement'}
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
            placeholder="e.g., PM Laptop Scheme Recipient"
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
            placeholder="Describe your achievement"
          />
        </div>

        {/* Icon and Year - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Icon Name</label>
            <select
              name="iconName"
              value={formData.iconName}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            >
              <option value="FaMedal">Medal</option>
              <option value="FaTrophy">Trophy</option>
              <option value="FaAward">Award</option>
              <option value="FaStar">Star</option>
              <option value="FaCertificate">Certificate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="e.g., 2024"
            />
          </div>
        </div>

        {/* Image URL Field */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Image URL (Photo)</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="/images/achievements/pm-laptop-ceremony.jpg"
          />
          <p className="text-xs text-gray-500 mt-1">Upload photo to public/images/achievements/ folder</p>
          {formData.imageUrl && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg border"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
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
          </div>
        </div>

        {/* Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all w-full sm:w-auto"
          >
            {loading ? 'Saving...' : (id ? 'Update Achievement' : 'Create Achievement')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/achievements')}
            className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AchievementForm;
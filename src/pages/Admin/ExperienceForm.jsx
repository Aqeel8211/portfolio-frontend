import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ExperienceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    duration: '',
    description: '',
    achievements: '',
    technologies: '',
    displayOrder: 0,
    startDate: '',
    endDate: '',
    isCurrent: false,
  });

  useEffect(() => {
    if (id) {
      fetchExperience();
    }
  }, [id]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/experiences/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load experience');
      navigate('/admin/experience');
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
        await api.put(`/experiences/${id}`, formData);
        toast.success('Experience updated successfully!');
      } else {
        await api.post('/experiences', formData);
        toast.success('Experience created successfully!');
      }
      navigate('/admin/experience');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save experience');
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
        {id ? 'Edit Experience' : 'Add New Experience'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Company & Position - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="e.g., Tech Solutions Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="e.g., Full Stack Developer Intern"
            />
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Duration *</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="e.g., Jan 2023 - Present"
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
          />
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Achievements (separate with semicolons)</label>
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="Achievement 1; Achievement 2; Achievement 3"
          />
          <p className="text-xs text-gray-500 mt-1">Use semicolons (;) to separate multiple achievements</p>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Technologies (comma-separated)</label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="React, .NET, PostgreSQL"
          />
        </div>

        {/* Start Date & End Date - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={formData.isCurrent}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Current Checkbox */}
        <div className="flex items-center">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-sm font-medium">I currently work here</span>
          </label>
        </div>

        {/* Display Order */}
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

        {/* Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all w-full sm:w-auto"
          >
            {loading ? 'Saving...' : (id ? 'Update Experience' : 'Create Experience')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/experience')}
            className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExperienceForm;
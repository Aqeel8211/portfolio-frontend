import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const EducationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
    description: '',
    achievements: '',
    displayOrder: 0,
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (id) {
      fetchEducation();
    }
  }, [id]);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/education/${id}`);
      const data = response.data;
      
      setFormData({
        id: data.id,
        degree: data.degree || '',
        institution: data.institution || '',
        duration: data.duration || '',
        description: data.description || '',
        achievements: data.achievements || '',
        displayOrder: data.displayOrder || 0,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      toast.error('Failed to load education');
      navigate('/admin/education');
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

  const convertToUTC = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      id: formData.id ? parseInt(formData.id) : 0,
      degree: formData.degree,
      institution: formData.institution,
      duration: formData.duration,
      description: formData.description,
      achievements: formData.achievements,
      displayOrder: parseInt(formData.displayOrder) || 0,
      startDate: formData.startDate ? convertToUTC(formData.startDate).toISOString() : null,
      endDate: formData.endDate ? convertToUTC(formData.endDate).toISOString() : null
    };

    console.log("=== SENDING DATA ===");
    console.log("Full data object:", JSON.stringify(dataToSubmit, null, 2));

    try {
      if (id) {
        await api.put(`/education/${id}`, dataToSubmit);
        toast.success('Education updated successfully!');
      } else {
        await api.post('/education', dataToSubmit);
        toast.success('Education created successfully!');
      }
      navigate('/admin/education');
    } catch (error) {
      console.error("=== ERROR DETAILS ===");
      console.error("Status:", error.response?.status);
      console.error("Response data:", error.response?.data);
      toast.error(error.response?.data?.title || error.response?.data?.message || 'Failed to save education');
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
        {id ? 'Edit Education' : 'Add New Education'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Degree */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Degree *</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="e.g., BS Computer Science"
          />
        </div>

        {/* Institution */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Institution *</label>
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="e.g., University Name"
          />
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
            placeholder="e.g., 2021 - Present"
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
            <p className="text-xs text-gray-500 mt-1">Click calendar to pick date</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if currently studying</p>
          </div>
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
            {loading ? 'Saving...' : (id ? 'Update Education' : 'Create Education')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/education')}
            className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EducationForm;
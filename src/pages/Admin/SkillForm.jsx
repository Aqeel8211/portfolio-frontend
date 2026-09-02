import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SkillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 50,
    displayOrder: 0,
    iconName: '',
  });

  useEffect(() => {
    if (id) {
      fetchSkill();
    }
  }, [id]);

  const fetchSkill = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/skills/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load skill');
      navigate('/admin/skills');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'range' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.put(`/skills/${id}`, formData);
        toast.success('Skill updated successfully!');
      } else {
        await api.post('/skills', formData);
        toast.success('Skill created successfully!');
      }
      navigate('/admin/skills');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save skill');
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
    <div className="max-w-2xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        {id ? 'Edit Skill' : 'Add New Skill'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Skill Name */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Skill Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="e.g., React"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
          >
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="Tools">Tools</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Proficiency Slider */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">
            Proficiency: {formData.proficiency}%
          </label>
          <input
            type="range"
            name="proficiency"
            min="0"
            max="100"
            value={formData.proficiency}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Expert</span>
          </div>
        </div>

        {/* Display Order & Icon Name - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Display Order</label>
            <input
              type="number"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Icon Name (optional)</label>
            <input
              type="text"
              name="iconName"
              value={formData.iconName}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="e.g., CodeBracketIcon"
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
            {loading ? 'Saving...' : (id ? 'Update Skill' : 'Create Skill')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/skills')}
            className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;
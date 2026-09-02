import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    longDescription: '',
    problem: '',
    solution: '',
    role: '',
    technologies: '',
    features: '',
    challenges: '',
    demoUrl: '',
    githubUrl: '',
    imageUrl: '',
    category: 'fullstack',
    date: '',
    isFeatured: false,
  });

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to load project');
      navigate('/admin/projects');
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
        await api.put(`/projects/${id}`, formData);
        toast.success('Project updated successfully!');
      } else {
        await api.post('/projects', formData);
        toast.success('Project created successfully!');
      }
      navigate('/admin/projects');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save project');
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
    <div className="max-w-4xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">
        {id ? 'Edit Project' : 'Add New Project'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
        {/* Title & Date - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Date</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="2024"
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Short Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="2"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Long Description</label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
          />
        </div>

        {/* Problem & Solution - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Problem</label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Solution</label>
            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Role</label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
          />
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
            placeholder="React, .NET 8, PostgreSQL"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Features (separate with semicolons)</label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            placeholder="Feature 1; Feature 2; Feature 3"
          />
        </div>

        {/* Challenges */}
        <div>
          <label className="block text-sm font-medium mb-1 sm:mb-2">Challenges</label>
          <textarea
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
          />
        </div>

        {/* URLs - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Demo URL</label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">GitHub URL</label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="https://github.com/username/repo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
              placeholder="/images/projects/your-image.jpg"
            />
          </div>
        </div>

        {/* Category & Featured - Responsive Grid */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 sm:mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm sm:text-base"
            >
              <option value="fullstack">Full Stack</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm font-medium">Featured Project</span>
            </label>
          </div>
        </div>

        {/* Buttons - Responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all w-full sm:w-auto"
          >
            {loading ? 'Saving...' : (id ? 'Update Project' : 'Create Project')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/projects')}
            className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all w-full sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
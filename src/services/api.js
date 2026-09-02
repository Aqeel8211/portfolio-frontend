import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  config => {
    // Log the request for debugging
    console.log('Starting Request:', config.url);
    
    // Add auth token if available
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle 401 Unauthorized errors - redirect to login
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUsername');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API endpoints (no auth required)
export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const getFeaturedProjects = () => api.get('/projects/featured');
export const getSkills = () => api.get('/skills');
export const getSkillsByCategory = (category) => api.get(`/skills/category/${category}`);
export const getExperiences = () => api.get('/experiences');
export const getCurrentExperiences = () => api.get('/experiences/current');
export const getEducation = () => api.get('/education');
export const getAchievements = () => api.get('/achievements');
export const sendContactMessage = (messageData) => api.post('/contact', messageData);

// Certifications API (Public)
export const getCertifications = () => api.get('/certifications');
export const getCertificationById = (id) => api.get(`/certifications/${id}`);

// Chatbot API - FIXED VERSION
export const sendChatMessage = async (message, sessionId = null) => {
  try {
    // Always generate or retrieve a session ID
    let currentSessionId = sessionId || localStorage.getItem('chatSessionId');
    if (!currentSessionId) {
      currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('chatSessionId', currentSessionId);
    }
    
    // Send both message and sessionId in the request body
    const response = await api.post('/chatbot/chat', {
      message: message,
      sessionId: currentSessionId
    });
    
    // Update session ID if server returns one
    if (response.headers['x-session-id']) {
      localStorage.setItem('chatSessionId', response.headers['x-session-id']);
    }
    
    return response.data;
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
};

// Admin API endpoints (require auth)
export const admin = {
  // Projects
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  
  // Skills
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
  
  // Experiences
  createExperience: (data) => api.post('/experiences', data),
  updateExperience: (id, data) => api.put(`/experiences/${id}`, data),
  deleteExperience: (id) => api.delete(`/experiences/${id}`),
  
  // Education
  createEducation: (data) => api.post('/education', data),
  updateEducation: (id, data) => api.put(`/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/education/${id}`),
  
  // Achievements
  createAchievement: (data) => api.post('/achievements', data),
  updateAchievement: (id, data) => api.put(`/achievements/${id}`, data),
  deleteAchievement: (id) => api.delete(`/achievements/${id}`),
  
  // Messages
  getMessages: () => api.get('/contact/messages'),
  getMessage: (id) => api.get(`/contact/messages/${id}`),
  markMessageAsRead: (id) => api.put(`/contact/messages/${id}/read`),
  deleteMessage: (id) => api.delete(`/contact/messages/${id}`),
  
  // Certifications (Admin - includes hidden items)
  certifications: {
    getAll: () => api.get('/certifications/all'),
    create: (data) => api.post('/certifications', data),
    update: (id, data) => api.put(`/certifications/${id}`, data),
    delete: (id) => api.delete(`/certifications/${id}`),
  },
  
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
};

export default api;
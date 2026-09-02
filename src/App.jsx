import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Chatbot from './components/Chatbot';

// Admin Imports
import AdminLayout from './pages/Admin/AdminLayout';
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import ProjectsList from './pages/Admin/ProjectsList';
import ProjectForm from './pages/Admin/ProjectForm';
import MessagesList from './pages/Admin/MessagesList';
import SkillsList from './pages/Admin/SkillsList';
import SkillForm from './pages/Admin/SkillForm';
import ExperienceList from './pages/Admin/ExperienceList';
import ExperienceForm from './pages/Admin/ExperienceForm';
import EducationList from './pages/Admin/EducationList';
import EducationForm from './pages/Admin/EducationForm';
import AchievementsList from './pages/Admin/AchievementsList';
import AchievementForm from './pages/Admin/AchievementForm';
import CertificationsList from './pages/Admin/CertificationsList';
import CertificationForm from './pages/Admin/CertificationForm';

// Component to conditionally render Chatbot
const ConditionalChatbot = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Only show chatbot on non-admin routes
  if (!isAdminRoute) {
    return <Chatbot />;
  }
  return null;
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="project/:id" element={<ProjectDetail />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<ProjectsList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/edit/:id" element={<ProjectForm />} />
              <Route path="skills" element={<SkillsList />} />
              <Route path="skills/new" element={<SkillForm />} />
              <Route path="skills/edit/:id" element={<SkillForm />} />
              <Route path="experience" element={<ExperienceList />} />
              <Route path="experience/new" element={<ExperienceForm />} />
              <Route path="experience/edit/:id" element={<ExperienceForm />} />
              <Route path="education" element={<EducationList />} />
              <Route path="education/new" element={<EducationForm />} />
              <Route path="education/edit/:id" element={<EducationForm />} />
              <Route path="achievements" element={<AchievementsList />} />
              <Route path="achievements/new" element={<AchievementForm />} />
              <Route path="achievements/edit/:id" element={<AchievementForm />} />
              <Route path="certifications" element={<CertificationsList />} />
              <Route path="certifications/new" element={<CertificationForm />} />
              <Route path="certifications/edit/:id" element={<CertificationForm />} />
              <Route path="messages" element={<MessagesList />} />
            </Route>
          </Routes>
        </AnimatePresence>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        <ConditionalChatbot />
      </Router>
    </HelmetProvider>
  );
}

export default App;
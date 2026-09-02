import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { 
  ArrowTopRightOnSquareIcon, 
  CodeBracketIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { getProjects, getFeaturedProjects } from '../services/api';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getProjects();
      setProjects(response.data);
      setFilteredProjects(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'All Projects' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
  ];

  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.category === filter));
    }
  }, [filter, projects]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Function to get layout classes based on number of projects
  const getLayoutClasses = (projectCount) => {
    if (projectCount === 1) {
      return "flex justify-center";
    } else if (projectCount === 2) {
      return "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto";
    } else if (projectCount === 3) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    } else if (projectCount === 4) {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    } else {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    }
  };

  // Function to handle special positioning for 4th project
  const getProjectWrapperClasses = (index, totalProjects) => {
    if (totalProjects === 4 && index === 3) {
      return "md:col-span-2 lg:col-span-3 flex justify-center mt-4";
    }
    return "";
  };

  if (loading) {
    return (
      <section id="projects" className="py-20">
        <div className="container-padding mx-auto text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20">
        <div className="container-padding mx-auto text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchProjects}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const projectCount = filteredProjects.length;

  return (
    <section id="projects" className="py-20">
      <div className="container-padding mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="section-title">Featured Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Showcasing my best work across full-stack development, with real-world impact
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                  filter === f.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Layout Based on Number of Projects */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={getLayoutClasses(projectCount)}
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className={`bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group ${
                getProjectWrapperClasses(index, projectCount)
              }`}
              style={projectCount === 4 && index === 3 ? { maxWidth: '400px', margin: '0 auto' } : {}}
            >
              {/* Project Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
                {project.imageUrl ? (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {project.title.charAt(0)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/project/${project.id}`}
                    className="bg-white text-gray-900 p-3 rounded-full mx-2 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </Link>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 p-3 rounded-full mx-2 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <CodeBracketIcon className="h-5 w-5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 p-3 rounded-full mx-2 hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  {project.isFeatured && (
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    {project.date}
                  </span>
                  <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-xs font-semibold">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies?.split(',').slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                  {project.technologies?.split(',').length > 3 && (
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded text-xs">
                      +{project.technologies.split(',').length - 3}
                    </span>
                  )}
                </div>
                <Link
                  to={`/project/${project.id}`}
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
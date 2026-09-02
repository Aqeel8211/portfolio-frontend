import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { getProjectById } from '../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await getProjectById(id);
      setProject(response.data);
      setError(null);
    } catch (err) {
      setError('Project not found or failed to load.');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">{error || 'Project Not Found'}</h2>
          <Link to="/" className="text-blue-600 hover:underline text-sm sm:text-base">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{project.title} | Muhammad Aqeel</title>
        <meta name="description" content={project.description} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-20 pb-12 sm:pt-24"
      >
        {/* Back Button */}
        <div className="container-padding mx-auto mb-6 sm:mb-8">
          <Link
            to="/#projects"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors text-sm sm:text-base"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </div>

        {/* Hero Image - Responsive height */}
        <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-r from-blue-600 to-purple-600 mb-8 sm:mb-12">
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl md:text-4xl font-bold px-4 text-center">
              {project.title}
            </div>
          )}
        </div>

        <div className="container-padding mx-auto">
          {/* Responsive Grid: Stack on mobile, side by side on desktop */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Main Content - Left side */}
            <div className="w-full lg:w-2/3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 break-words">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                {project.date && (
                  <span className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {project.date}
                  </span>
                )}
                {project.role && (
                  <span className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {project.role}
                  </span>
                )}
              </div>

              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                {project.longDescription && (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Overview</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                      {project.longDescription}
                    </p>
                  </>
                )}

                {project.problem && (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Problem</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                      {project.problem}
                    </p>
                  </>
                )}

                {project.solution && (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Solution</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                      {project.solution}
                    </p>
                  </>
                )}

                {project.features && (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Key Features</h2>
                    <ul className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                      {project.features.split(';').map((feature, index) => (
                        <li key={index} className="flex items-start text-sm sm:text-base">
                          <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-600 dark:text-gray-400">{feature.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {project.challenges && (
                  <>
                    <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Challenges & Learning</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 leading-relaxed">
                      {project.challenges}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar - Right side, sticky on desktop only */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 sm:p-6 shadow-lg sticky top-24">
                {project.technologies && (
                  <>
                    <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Technologies Used</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {project.technologies.split(',').map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white dark:bg-gray-900 rounded-full text-xs sm:text-sm"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 sm:gap-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 sm:py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:border-blue-600 transition-all duration-300 flex items-center justify-center text-sm sm:text-base"
                    >
                      <CodeBracketIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      View Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectDetail;
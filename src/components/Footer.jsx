import { HeartIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-padding mx-auto py-6">
        {/* Simple Copyright Line */}
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center">
            © {currentYear} Muhammad Aqeel. Made with 
            <HeartIcon className="h-4 w-4 mx-1 text-red-500" /> 
            using React & .NET
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container-padding mx-auto py-4 sm:py-6">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-xs sm:text-sm">
            © {currentYear} Muhammad Aqeel.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
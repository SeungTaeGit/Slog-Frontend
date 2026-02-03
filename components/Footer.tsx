export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-sm text-gray-400 dark:text-gray-600 animate-fadeIn">
      <p>
        &copy; {currentYear} <span className="font-bold text-gray-500 dark:text-gray-400">Lee SeungTae</span>. All rights reserved.
      </p>

      <p className="mt-2 text-xs flex items-center justify-center gap-1.5">
        <span>Powered by</span>

        <a
          href="https://github.com/SeungTaeGit/Slog-Frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors border-b border-gray-300 dark:border-gray-700 hover:border-gray-500"
        >
          Next.js
        </a>

        <span>&</span>

        <a
          href="https://github.com/SeungTaeGit/Slog"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors border-b border-gray-300 dark:border-gray-700 hover:border-gray-500"
        >
          Spring Boot
        </a>
      </p>
    </footer>
  );
}
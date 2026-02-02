export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 text-center text-sm text-gray-400 dark:text-gray-600">
      <p>
        &copy; {currentYear} <span className="font-bold text-gray-500 dark:text-gray-500">Lee SeungTae</span>. All rights reserved.
      </p>
      <p className="mt-1 text-xs">
        Powered by Next.js & Spring Boot
      </p>
    </footer>
  );
}
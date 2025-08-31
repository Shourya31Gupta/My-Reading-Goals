import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `flex items-center gap-2 text-base font-medium px-5 py-3 rounded-xl transition-all duration-300 ${
      location.pathname === path
        ? "text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
        : "text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md border border-transparent hover:border-blue-200"
    }`;

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-lg shadow-slate-900/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-slow">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-3xl font-black">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              My Reading Goals
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-3">
          <Link to="/" className={linkClasses("/")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link to="/add" className={linkClasses("/add")}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Book
          </Link>
        </div>
      </div>
    </nav>
  );
};
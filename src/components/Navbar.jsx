import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext";
import { supabase } from "@/lib/supabaseClient";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const linkClasses = (path) =>
    `flex items-center gap-2 text-sm sm:text-base font-medium px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
      location.pathname === path
        ? "text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
        : "text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md border border-transparent hover:border-blue-200"
    }`;

  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50 shadow-lg shadow-slate-900/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex justify-between items-center flex-nowrap overflow-hidden">
        {/* Logo and Title */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-slow">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xl sm:text-3xl font-black whitespace-nowrap truncate max-w-[180px] sm:max-w-[260px]">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              My Reading Goals
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
          {user && (
            <>
              <Link to="/" className={linkClasses("/")}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline whitespace-nowrap">Home</span>
              </Link>
              <Link to="/add" className={linkClasses("/add")}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline whitespace-nowrap">Add Book</span>
              </Link>
            </>
          )}

          <div className="ml-1.5 sm:ml-2 flex items-center gap-1.5 sm:gap-2 flex-nowrap">
            {!loading && !user && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 text-sm sm:text-base font-medium px-2.5 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-300 text-slate-700 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md border border-transparent hover:border-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H3m0 0l4-4M3 12l4 4m4-10h6a2 2 0 012 2v10a2 2 0 01-2 2h-6" />
                </svg>
                <span className="hidden sm:inline whitespace-nowrap">Login</span>
              </button>
            )}

            {!loading && user && (
              <>
                <div className="hidden md:flex flex-col items-end text-right mr-1">
                  <span className="text-xs text-slate-400">Logged in as</span>
                  <span className="text-sm font-medium text-slate-700 max-w-[160px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/login");
                  }}
                  className="flex items-center gap-2 text-sm sm:text-base font-medium px-2.5 sm:px-4 py-2 rounded-xl transition-all duration-300 text-slate-700 border border-slate-200 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:border-slate-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  <span className="hidden sm:inline whitespace-nowrap">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
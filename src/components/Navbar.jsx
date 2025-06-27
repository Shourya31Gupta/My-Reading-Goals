import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `text-base font-medium px-4 py-2 transition-all duration-200 ${
      location.pathname === path
        ? "text-blue-600 border-b-2 border-blue-600"
        : "text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-400"
    }`;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
       
        <div className="text-2xl font-extrabold text-gray-900 tracking-wide">
          My Reading Goals
        </div>

       
        <div className="flex items-center gap-4">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link to="/add" className={linkClasses("/add")}>
            Add Book
          </Link>
        </div>
      </div>
    </nav>
  );
};
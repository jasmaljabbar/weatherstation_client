import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../redux/reducers/authSlice";

const Navbar_admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  let user = null;
  if (token) {
    user = jwtDecode(token);
    console.log(user.is_admin);
    
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert(`Failed to log out: ${error}`);
    }
  };

  const handleSearch = () => {
    navigate(`/search_results?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="bg-gray-800 z-40 fixed top-0 w-full py-7">
      <div className="container mx-auto md:px-0 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold">
          weather station
          </Link>
          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden lg:flex space-x-8">
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex space-x-8">
              <Link to="/services" className="text-white hover:text-gray-300">
                Services
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Sign Up
              </Link>
              <Link to="/login" className="text-white hover:text-gray-300">
                Log In
              </Link>
            </div>
          )}

          {/* Become a Tasker Button */}
          

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {isOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Services
            </Link>
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Sign Up
                </Link>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Log In
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar_admin;

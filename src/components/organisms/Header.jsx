import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthContext } from "../../App";
import ApperIcon from "@/components/atoms/ApperIcon";
import Button from "@/components/atoms/Button";
import Help from "@/components/pages/Help";
import AuthModal from "@/components/organisms/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };
  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <ApperIcon name="Home" size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                StayFinder
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/explore" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Explore
              </Link>
<button
                onClick={handleWishlistClick}
                className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium relative group"
              >
                <ApperIcon name="Heart" size={16} />
                Saved
                
                {/* Guest tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  <div className="relative">
                    View your saved properties
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              </button>
              <Link 
                to="/help" 
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Help
              </Link>
            </nav>

            {/* User Actions */}
<div className="flex items-center gap-3">
              {/* User Profile/Auth Button */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 border border-gray-300 rounded-full hover:shadow-md transition-all"
                  >
                    <ApperIcon name="Menu" size={16} className="text-gray-600" />
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.firstName?.charAt(0) || user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName || user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.emailAddress || user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <ApperIcon name="LogOut" size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 p-2 border border-gray-300 rounded-full hover:shadow-md transition-all"
                >
                  <ApperIcon name="Menu" size={16} className="text-gray-600" />
                  <ApperIcon name="User" size={20} className="text-gray-600" />
                </button>
              )}
</div>
          </div>
        </div>
      </header>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex justify-around py-2">
            <Link 
              to="/explore" 
              className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="Search" size={20} />
              <span className="text-xs">Explore</span>
            </Link>
            <button
              onClick={handleWishlistClick}
              className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600 hover:text-primary transition-colors relative group"
            >
              <ApperIcon name="Heart" size={20} />
              <span className="text-xs">Saved</span>
              
              {/* Mobile tooltip */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                <div className="relative">
                  View saved properties
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </button>
            <Link 
              to="/help" 
              className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600 hover:text-primary transition-colors"
            >
              <ApperIcon name="HelpCircle" size={20} />
              <span className="text-xs">Help</span>
            </Link>
            {!isAuthenticated ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="User" size={20} />
                <span className="text-xs">Log in</span>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center gap-1 py-2 px-4 text-gray-600 hover:text-primary transition-colors"
              >
                <ApperIcon name="LogOut" size={20} />
                <span className="text-xs">Logout</span>
              </button>
)}
          </nav>
        </div>

      {!isAuthenticated && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
)}
    </>
  );
};

export default Header;
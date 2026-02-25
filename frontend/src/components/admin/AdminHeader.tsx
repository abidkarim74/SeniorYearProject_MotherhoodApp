import { useState } from "react";
import { 
  Menu, 
  User, 
  Settings, 
  LogOut,
  Shield,
  ChevronDown,
  Heart,
  Users,
  Syringe,
  LayoutDashboard,
  MessageCircle
} from "lucide-react";

const AdminHeader = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-white to-[#fff6f6] border-b border-[#e5989b]/20 sticky top-0 z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section - Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-[#fceaea] transition-colors"
            >
              <Menu className="w-5 h-5 text-[#d88a8d]" />
            </button>

            {/* Logo & App Name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-xl flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-gray-800">Nurtura</h1>
                <p className="text-xs text-[#e5989b]">Admin Portal</p>
              </div>
            </div>

          </div>

          {/* Center Section - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <a 
              href="/admin/dashboard" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#d88a8d] hover:bg-[#fceaea] rounded-full transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </a>
            <a 
              href="/admin/users" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#d88a8d] hover:bg-[#fceaea] rounded-full transition-colors"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </a>
            <a 
              href="/admin/community" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#d88a8d] hover:bg-[#fceaea] rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Manage Community
            </a>
            <a 
              href="/admin/vaccinations" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#d88a8d] hover:bg-[#fceaea] rounded-full transition-colors"
            >
              <Syringe className="w-4 h-4" />
              Manage Vaccinations
            </a>
          </div>

          {/* Right Section - Admin Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-[#fceaea] transition-colors border border-transparent hover:border-[#e5989b]/20"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[#e5989b] to-[#d88a8d] rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                  <p className="text-xs text-[#e5989b]">Super Admin</p>
                </div>
                <ChevronDown className="hidden lg:block w-4 h-4 text-[#d88a8d]" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#e5989b]/20 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">Sarah Johnson</p>
                      <p className="text-xs text-[#e5989b] mt-1">sarah@nurtura.com</p>
                    </div>
                    
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fff6f6] transition-colors">
                      <User className="w-4 h-4 text-[#e5989b]" />
                      Profile
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fff6f6] transition-colors">
                      <Settings className="w-4 h-4 text-[#e5989b]" />
                      Settings
                    </a>
                    
                    <hr className="my-2 border-gray-100" />
                    
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ff4d6d] hover:bg-[#fff6f6] transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#e5989b]/20 bg-white p-4 animate-slide-down">
          {/* Mobile Navigation */}
          <nav className="space-y-1">
            <a href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#fff6f6] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#fceaea] rounded-full flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-[#e5989b]" />
              </div>
              <span>Dashboard</span>
            </a>
            <a href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#fff6f6] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#fceaea] rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-[#e5989b]" />
              </div>
              <span>Manage Users</span>
            </a>
            <a href="/admin/community" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#fff6f6] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#fceaea] rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-[#e5989b]" />
              </div>
              <span>Manage Community</span>
            </a>
            <a href="/admin/vaccinations" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-[#fff6f6] rounded-lg transition-colors">
              <div className="w-8 h-8 bg-[#fceaea] rounded-full flex items-center justify-center">
                <Syringe className="w-4 h-4 text-[#e5989b]" />
              </div>
              <span>Manage Vaccinations</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
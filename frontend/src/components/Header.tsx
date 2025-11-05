
// import { Link } from "react-router-dom";
// import { useState, useRef, useEffect } from "react";
// import { Bell, Baby, ChevronDown, User, LogOut } from "lucide-react";

// // Mock auth context for demo
// const useAuth = () => ({
//   logout: async () => console.log("Logging out..."),
//   accessToken: "mock-token"
// });

// const Header = () => {
//   const { logout, accessToken } = useAuth();
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Mock user data - in real app, fetch from API/context
//   const userData = {
//     name: "Sarah Johnson",
//     avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face&auto=format",
//     notifications: 2
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };

//     if (dropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [dropdownOpen]);

//   // Close dropdown on Escape key
//   useEffect(() => {
//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setDropdownOpen(false);
//       }
//     };

//     if (dropdownOpen) {
//       document.addEventListener("keydown", handleEscape);
//     }

//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [dropdownOpen]);

//   const handleLogout = async () => {
//     await logout();
//     setDropdownOpen(false);
//   };

//   if (!accessToken) {
//     return (
//       <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
//         <div className="flex justify-between items-center h-16 px-6 ml-16">
//           <div className="w-full max-w-md h-10 bg-gray-100 animate-pulse rounded-md" />
//         </div>
//       </header>
//     );
//   }

//   return (
//     <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
//       <div className="flex justify-between items-center h-16 px-6 ml-16 md:ml-16 ml-0">
        
//         {/* Search */}
//         <div className="flex-1 max-w-md">
//           <input 
//             type="search"
//             placeholder="Search children, vaccinations..."
//             aria-label="Search"
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
//           />
//         </div>

//         {/* Right side actions */}
//         <div className="flex items-center space-x-3 ml-4">
          
//           {/* Add Child Button */}
//           <Link 
//             to="/add-child"
//             className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-pink-700 transition shadow-sm font-medium"
//           >
//             <Baby className="w-4 h-4 mr-2" /> 
//             <span className="hidden sm:inline">Add Child</span>
//             <span className="sm:hidden">Add</span>
//           </Link>

//           {/* Notifications */}
//           <button 
//             aria-label={`Notifications ${userData.notifications > 0 ? `(${userData.notifications} unread)` : ''}`}
//             className="relative p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition"
//           >
//             <Bell className="w-5 h-5" />
//             {userData.notifications > 0 && (
//               <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
//                 {userData.notifications}
//               </span>
//             )}
//           </button>

//           {/* Profile Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button 
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               aria-expanded={dropdownOpen}
//               aria-haspopup="true"
//               aria-label="User menu"
//               className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition"
//             >
//               <img 
//                 src={userData.avatar} 
//                 alt={userData.name}
//                 className="w-8 h-8 rounded-full border-2 border-gray-200" 
//               />
//               <span className="hidden md:block text-sm font-medium text-gray-700">
//                 {userData.name}
//               </span>
//               <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {/* Dropdown Menu */}
//             {dropdownOpen && (
//               <div 
//                 className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
//                 role="menu"
//               >
//                 {/* User Info */}
//                 <div className="px-4 py-3 border-b border-gray-100">
//                   <p className="text-sm font-medium text-gray-900">{userData.name}</p>
//                   <p className="text-xs text-gray-500 mt-0.5">View Profile</p>
//                 </div>

//                 {/* Menu Items */}
//                 <Link
//                   to="/profile"
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
//                   role="menuitem"
//                   onClick={() => setDropdownOpen(false)}
//                 >
//                   <User className="w-4 h-4 mr-3" />
//                   My Profile
//                 </Link>

//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
//                   role="menuitem"
//                 >
//                   <LogOut className="w-4 h-4 mr-3" />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>

//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;


import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Bell, Baby, ChevronDown, User, LogOut } from "lucide-react";

// Mock auth context for demo
const useAuth = () => ({
  logout: async () => console.log("Logging out..."),
  accessToken: "mock-token"
});

const Header = () => {
  const { logout, accessToken } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock user data - in real app, fetch from API/context
  const userData = {
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face&auto=format",
    notifications: 2
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  if (!accessToken) {
    return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="flex justify-between items-center h-16 px-6 ml-16">
          <div className="w-full max-w-md h-10 bg-gray-100 animate-pulse rounded-md" />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="flex justify-between items-center h-16 px-6 ml-16 md:ml-16 ml-0">
        
        {/* Search */}
        <div className="flex-1 max-w-md">
          <input 
            type="search"
            placeholder="Search children, vaccinations..."
            aria-label="Search"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-3 ml-4">
          
          {/* Add Child Button */}
          <Link 
            to="/add-child"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-pink-700 transition shadow-sm font-medium"
          >
            <Baby className="w-4 h-4 mr-2" /> 
            <span className="hidden sm:inline">Add Child</span>
            <span className="sm:hidden">Add</span>
          </Link>

          {/* Notifications */}
          <button 
            aria-label={`Notifications ${userData.notifications > 0 ? `(${userData.notifications} unread)` : ''}`}
            className="relative p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition"
          >
            <Bell className="w-5 h-5" />
            {userData.notifications > 0 && (
              <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {userData.notifications}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              aria-label="User menu"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition"
            >
              <img 
                src={userData.avatar} 
                alt={userData.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200" 
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {userData.name}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50"
                role="menu"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">View Profile</p>
                </div>

                {/* Menu Items */}
                <Link
                  to="/profile"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
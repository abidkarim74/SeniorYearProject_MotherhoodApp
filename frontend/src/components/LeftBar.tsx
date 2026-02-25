// import { Link, useLocation } from "react-router-dom";
// import {
//   Home,
//   Users,
//   Calendar,
//   MessageCircle,
//   Baby,
//   Settings,
//   LogOut
// } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "../context/authContext";

// const LeftBar = () => {
//   const { logout } = useAuth();
//   const location = useLocation();
//   const [loading, setLoading] = useState(false);

//   const navigationItems = [
//     { path: "/", icon: Home, label: "Dashboard" },
//     { path: "/children", icon: Users, label: "My Children" },
//     { path: "/immunizations", icon: Calendar, label: "Immunizations" },
//     { path: "/community", icon: MessageCircle, label: "Community" },
//   ];

//   const handleLogout = async () => {
//     try {
//       setLoading(true);
//       await logout();
//     } catch (error) {
//       console.error("Logout error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isActive = (path: string) => {
//     return location.pathname === path;
//   };

//   return (
//     <div data-sidebar className="h-full bg-white shadow-lg border-r border-gray-200 flex flex-col w-20 hover:w-64 transition-all duration-300 group">

//       {/* Navigation Items */}
//       <nav className="flex-1 px-3 py-4 space-y-2">
//         {navigationItems.map((item) => {
//           const Icon = item.icon;
//           const active = isActive(item.path);

//           return (
//             <Link
//               key={item.path}
//               to={item.path}
//               className={`flex items-center p-4 rounded-xl transition-all duration-200 relative ${active
//                   ? "bg-[#fceaea] text-[#e5989b] shadow-sm"
//                   : "text-gray-600 hover:bg-[#fceaea] hover:text-[#e5989b]"
//                 }`}
//               title={item.label}
//             >
//               <Icon className={`w-7 h-7 ${active ? 'text-[#e5989b]' : 'text-gray-400 hover:text-[#e5989b]'}`} />
//               <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//                 {item.label}
//               </span>
//             </Link>
//           );
//         })}

//         {/* Add Child Button */}
//         <Link
//           to="/add-child"
//           className="flex items-center p-4 rounded-xl bg-[#e5989b] text-white hover:bg-[#d88a8d] transition-all duration-200 shadow-sm relative"
//           title="Add Child"
//         >
//           <Baby className="w-7 h-7" />
//           <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//             Add Child
//           </span>
//         </Link>
//       </nav>

//       {/* Bottom Section - Settings and Logout */}
//       <div className="p-3 border-t border-gray-200 space-y-2">
//         {/* Settings */}
//         <Link
//           to="/settings"
//           className={`flex items-center p-4 rounded-xl transition-all duration-200 relative ${isActive("/settings")
//               ? "bg-[#fceaea] text-[#e5989b]"
//               : "text-gray-600 hover:bg-[#fceaea] hover:text-[#e5989b]"
//             }`}
//           title="Settings"
//         >
//           <Settings className={`w-7 h-7 ${isActive("/settings") ? 'text-[#e5989b]' : 'text-gray-400 hover:text-[#e5989b]'}`} />
//           <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//             Settings
//           </span>
//         </Link>

//         {/* Logout */}
//         <button
//           onClick={handleLogout}
//           disabled={loading}
//           className="flex items-center w-full p-4 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 relative disabled:opacity-50"
//           title="Logout"
//         >
//           {loading ? (
//             <svg className="animate-spin w-7 h-7 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//           ) : (
//             <LogOut className="w-7 h-7 text-gray-400 hover:text-red-600" />
//           )}
//           <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//             {loading ? "Logging out..." : "Logout"}
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default LeftBar;





import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  MessageCircle,
  Baby,
  Settings,
  LogOut,
  PlayCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/authContext";

const LeftBar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const navigationItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/tutorials", icon: PlayCircle, label: "Video Tutorials" },
    { path: "/children", icon: Users, label: "My Children" },
    { path: "/immunizations", icon: Calendar, label: "Immunizations" },
    { path: "/community", icon: MessageCircle, label: "Community" },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path === "/" ? "/__never__" : path);
  };

  return (
    <div
      data-sidebar
      className="h-full bg-white shadow-lg border-r border-gray-200 flex flex-col w-20 hover:w-64 transition-all duration-300 group"
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-4 rounded-xl transition-all duration-200 relative ${
                active
                  ? "bg-[#fceaea] text-[#e5989b] shadow-sm"
                  : "text-gray-600 hover:bg-[#fceaea] hover:text-[#e5989b]"
              }`}
              title={item.label}
            >
              <Icon
                className={`w-7 h-7 flex-shrink-0 ${
                  active ? "text-[#e5989b]" : "text-gray-400 hover:text-[#e5989b]"
                }`}
              />
              <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Add Child Button */}
        <Link
          to="/add-child"
          className="flex items-center p-4 rounded-xl bg-[#e5989b] text-white hover:bg-[#d88a8d] transition-all duration-200 shadow-sm relative"
          title="Add Child"
        >
          <Baby className="w-7 h-7 flex-shrink-0" />
          <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Add Child
          </span>
        </Link>
      </nav>

      {/* Bottom Section - Settings and Logout */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        {/* Settings */}
        <Link
          to="/settings"
          className={`flex items-center p-4 rounded-xl transition-all duration-200 relative ${
            isActive("/settings")
              ? "bg-[#fceaea] text-[#e5989b]"
              : "text-gray-600 hover:bg-[#fceaea] hover:text-[#e5989b]"
          }`}
          title="Settings"
        >
          <Settings
            className={`w-7 h-7 flex-shrink-0 ${
              isActive("/settings") ? "text-[#e5989b]" : "text-gray-400 hover:text-[#e5989b]"
            }`}
          />
          <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Settings
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center w-full p-4 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 relative disabled:opacity-50"
          title="Logout"
        >
          {loading ? (
            <svg
              className="animate-spin w-7 h-7 flex-shrink-0 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <LogOut className="w-7 h-7 flex-shrink-0 text-gray-400 hover:text-red-600" />
          )}
          <span className="ml-4 font-medium absolute left-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            {loading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LeftBar;
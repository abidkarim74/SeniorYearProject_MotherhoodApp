

import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoutes from "./middleware/protectRoutes";
import GuestRoute from "./middleware/guestRoutes";
import Home from "./pages/Home";
import Header from "./components/Header";
import { useAuth } from "./context/authContext";
import MyChildren from "./pages/Children";
import Vaccinations from "./pages/Vaccinations";
import Community from "./pages/Community";
import AddChild from "./pages/AddChild";
import Sidebar from "./components/Sidebar";

function App() {
  const { accessToken } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar appears only when logged in */}
      {accessToken && <Sidebar />}

      {/* Main content shifts to the right when Sidebar exists */}
      <div className={`flex-1 ${accessToken ? "ml-64" : ""}`}>
        
        {/* Top Header only visible when logged in */}
        {accessToken && <Header />}

        {/* Page content */}
        <div className={`${accessToken ? "pt-20 px-6" : ""}`}>
          <Routes>
            <Route path="/" element={<ProtectedRoutes><Home /></ProtectedRoutes>} />
            <Route path="/children" element={<ProtectedRoutes><MyChildren /></ProtectedRoutes>} />
            <Route path="/add-child" element={<ProtectedRoutes><AddChild /></ProtectedRoutes>} />
            <Route path="/community" element={<ProtectedRoutes><Community /></ProtectedRoutes>} />
            <Route path="/vaccinations" element={<ProtectedRoutes><Vaccinations /></ProtectedRoutes>} />

            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
          </Routes>
        </div>

      </div>
    </div>
  );
}

export default App;



// import React, { useState, useRef, useEffect } from "react";
// import { Baby, Users, Calendar, MessageCircle, Settings, Bell, ChevronDown } from "lucide-react";

// // Mock Router Components (since react-router-dom isn't available in artifacts)
// const RouterContext = React.createContext({ pathname: '/', navigate: (path: string) => {} });

// const Router: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [pathname, setPathname] = useState('/');
//   const navigate = (path: string) => setPathname(path);
//   return (
//     <RouterContext.Provider value={{ pathname, navigate }}>
//       {children}
//     </RouterContext.Provider>
//   );
// };

// const Link: React.FC<{ to: string; className?: string; children: React.ReactNode }> = ({ to, className, children }) => {
//   const { navigate } = React.useContext(RouterContext);
//   return (
//     <a
//       href={to}
//       className={className}
//       onClick={(e) => {
//         e.preventDefault();
//         navigate(to);
//       }}
//     >
//       {children}
//     </a>
//   );
// };

// const useLocation = () => React.useContext(RouterContext);

// const Routes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { pathname } = useLocation();
//   const childArray = React.Children.toArray(children);
  
//   for (const child of childArray) {
//     if (React.isValidElement(child) && child.props.path === pathname) {
//       return <>{child.props.element}</>;
//     }
//   }
//   return null;
// };

// const Route: React.FC<{ path: string; element: React.ReactNode }> = () => null;

// // Sidebar Item Component
// interface SidebarItemProps {
//   to: string;
//   icon: React.ComponentType<any>;
//   label: string;
// }

// const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label }) => {
//   const location = useLocation();
//   const active = location.pathname === to;

//   return (
//     <Link
//       to={to}
//       className={`relative group flex justify-center p-3 rounded-xl transition-colors ${
//         active ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
//       }`}
//     >
//       <Icon className="w-5 h-5" />
//       <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
//         bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-50">
//         {label}
//       </span>
//     </Link>
//   );
// };

// // Menu Items
// const menuItems = [
//   { to: "/", icon: Baby, label: "Dashboard" },
//   { to: "/children", icon: Users, label: "My Children" },
//   { to: "/vaccinations", icon: Calendar, label: "Vaccinations" },
//   { to: "/community", icon: MessageCircle, label: "Community" }
// ];

// // Page Components
// const Home = () => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Children</h3>
//         <p className="text-3xl font-bold text-pink-600">3</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Vaccines</h3>
//         <p className="text-3xl font-bold text-pink-600">2</p>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//         <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
//         <p className="text-3xl font-bold text-pink-600">5</p>
//       </div>
//     </div>
//   </div>
// );

// const MyChildren = () => (
//   <div>
//     <h1 className="text-3xl font-bold text-gray-900 mb-6">My Children</h1>
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <p className="text-gray-600">List of children will appear here...</p>
//     </div>
//   </div>
// );

// const Vaccinations = () => (
//   <div>
//     <h1 className="text-3xl font-bold text-gray-900 mb-6">Vaccinations</h1>
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <p className="text-gray-600">Vaccination schedule will appear here...</p>
//     </div>
//   </div>
// );

// const Community = () => (
//   <div>
//     <h1 className="text-3xl font-bold text-gray-900 mb-6">Community</h1>
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <p className="text-gray-600">Community posts will appear here...</p>
//     </div>
//   </div>
// );

// const AddChild = () => (
//   <div>
//     <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Child</h1>
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <p className="text-gray-600">Add child form will appear here...</p>
//     </div>
//   </div>
// );

// const SettingsPage = () => (
//   <div>
//     <h1 className="text-3xl font-bold text-gray-900 mb-6">Settings</h1>
//     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//       <p className="text-gray-600">Settings options will appear here...</p>
//     </div>
//   </div>
// );

// // Main App Component
// const App: React.FC = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

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

//   const handleLogout = () => {
//     alert("Logging out");
//     setDropdownOpen(false);
//   };

//   return (
//     <Router>
//       <div className="flex h-screen bg-gray-50">
//         {/* Sidebar */}
//         <div className="w-16 bg-white border-r border-gray-200 flex flex-col justify-between py-4 fixed h-full z-40">
//           <div className="flex flex-col mt-6 space-y-2 px-2">
//             {menuItems.map(item => (
//               <SidebarItem key={item.to} {...item} />
//             ))}
//           </div>
//           <div className="flex justify-center mb-6 px-2">
//             <Link
//               to="/settings"
//               className="relative group p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
//             >
//               <Settings className="w-5 h-5" />
//               <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity
//                 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap z-50">
//                 Settings
//               </span>
//             </Link>
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 ml-16 flex flex-col">
//           {/* Header */}
//           <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
//             <input 
//               type="search" 
//               placeholder="Search..." 
//               className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition" 
//             />
            
//             <div className="flex items-center space-x-3 ml-4">
//               <Link 
//                 to="/add-child" 
//                 className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-pink-700 transition shadow-sm font-medium"
//               >
//                 <Baby className="w-4 h-4 mr-2" /> Add Child
//               </Link>

//               {/* Notifications */}
//               <button className="relative p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition">
//                 <Bell className="w-5 h-5" />
//                 <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-semibold">
//                   2
//                 </span>
//               </button>

//               {/* Profile Dropdown */}
//               <div className="relative" ref={dropdownRef}>
//                 <button 
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition"
//                 >
//                   <img
//                     src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"
//                     alt="Profile"
//                     className="w-8 h-8 rounded-full border-2 border-gray-200"
//                   />
//                   <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
//                 </button>
                
//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
//                     <div className="px-4 py-3 border-b border-gray-100">
//                       <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
//                       <p className="text-xs text-gray-500">mother@example.com</p>
//                     </div>
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <main className="flex-1 overflow-y-auto p-6">
//             <Routes>
//               <Route path="/" element={<Home />} />
//               <Route path="/children" element={<MyChildren />} />
//               <Route path="/vaccinations" element={<Vaccinations />} />
//               <Route path="/community" element={<Community />} />
//               <Route path="/add-child" element={<AddChild />} />
//               <Route path="/settings" element={<SettingsPage />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// };

// export default App;
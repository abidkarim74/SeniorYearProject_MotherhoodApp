import { Link, useLocation } from "react-router-dom";
import { Baby, Users, Calendar, MessageCircle, Settings } from "lucide-react";

const menuItems = [
  { to: "/", icon: Baby, label: "Dashboard" },
  { to: "/children", icon: Users, label: "My Children" },
  { to: "/vaccinations", icon: Calendar, label: "Vaccinations" },
  { to: "/community", icon: MessageCircle, label: "Community" }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-16 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 pt-16 flex flex-col justify-between">
      {/* Main Nav */}
      <nav className="flex flex-col items-center space-y-4 mt-6">
        {menuItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link 
              key={to}
              to={to}
              className={`relative group p-3 rounded-xl ${
                active ? "bg-pink-100 text-pink-600" : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              } transition`}
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <span className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md transition pointer-events-none whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Settings Bottom */}
      <div className="flex justify-center mb-6">
        <Link
          to="/settings"
          className="relative group p-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute left-14 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
            bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md transition pointer-events-none whitespace-nowrap">
            Settings
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

// layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import LeftBar from "../components/LeftBar";
import BottomBar from "../components/BottomBar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fff6f6]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Body */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <div className="fixed left-0 top-16 bottom-0 z-40 hidden lg:block w-64">
          <LeftBar />
        </div>

        {/* Main */}
        <div className="flex-1 lg:ml-20 transition-all duration-300 min-w-0">
          <main className="h-full overflow-auto ">
            <Outlet />
          </main>

          {/* Bottom bar (mobile) */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <BottomBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

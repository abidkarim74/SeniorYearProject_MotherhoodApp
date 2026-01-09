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
import UserProfile from "./pages/UserProfile";
import LeftBar from "./components/LeftBar";
import AIChatBot from "./pages/AIChatbot";
import BottomBar from "./components/BottomBar";
import AddVaccination from "./pages/AddVaccination";
import Settings from "./pages/Settings";
import ImportantVaccines from "./pages/ImportantVaccines";
import ChildDetail from "./pages/ChildDetail";
import ChildGrowthTracking from "./pages/ChildGrowthTracking";

// Layout component for protected routes
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen bg-[#fff6f6]">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      
      {/* Main Content Area below header */}
      <div className="flex flex-1 pt-16"> {/* Changed mt-16 to pt-16 */}
        <div className="fixed left-0 top-16 bottom-0 z-40 hidden lg:block w-64">
          <LeftBar />
        </div>
        
        {/* Main Content - Adjusts for sidebar on desktop */}
        <div className="flex-1 lg:ml-20 transition-all duration-300 min-w-0">
          {/* Scrollable Main Content */}
          <main className="h-full overflow-auto pb-20 lg:pb-6 ">
            {children}
          </main>

          {/* Fixed Bottom Bar - Mobile only */}
          <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
            <BottomBar />
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {

  return (
    <div className="App">
      <Routes>
        {/* Protected Routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

         <Route
          path="/ai-assistant"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <AIChatBot />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route path="/important-vaccines" element={<ProtectedRoutes><ImportantVaccines></ImportantVaccines></ProtectedRoutes>} />


        <Route
          path="/mother/:id"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <UserProfile />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/children"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <MyChildren />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/add-child"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <AddChild />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <Community />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/vaccinations"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <Vaccinations />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/add-vaccination"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <AddVaccination />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />


        {/* Child Detail Route */}
        <Route
          path="/child-detail/:id"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <ChildDetail />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        <Route
          path="/child/:childId/growth"
          element={
            <ProtectedRoutes>
              <DashboardLayout>
                <ChildGrowthTracking />
              </DashboardLayout>
            </ProtectedRoutes>
          }
        />

        {/* Guest Routes (without layout) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
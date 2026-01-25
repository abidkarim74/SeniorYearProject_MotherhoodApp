import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GuestRoute from "./middleware/guestRoutes";
import ProtectedRoutes from "./middleware/protectRoutes";
import DashboardLayout from "./pages/DashboardLayout";
import Home from "./pages/Home";
import MyChildren from "./pages/Children";
import AIChatbotBorder from "./pages/AIChatbotBorder";
import Vaccinations from "./pages/Vaccinations";
import Community from "./pages/Community";
import AddChild from "./pages/AddChild";
import UserProfile from "./pages/UserProfile";
import AIChatBot from "./pages/AIChatbotBorder";
import BlankAIChatbot from "./pages/BlankAIChatbot";
import ConversationAIChatbot from "./pages/ConversationBot";
import AddVaccination from "./pages/AddVaccination";
import Settings from "./pages/Settings";
import ImportantVaccines from "./pages/ImportantVaccines";
import ChildDetail from "./pages/ChildDetail";
import ChildGrowthTracking from "./pages/ChildGrowthTracking";

function App() {
  return (
    <Routes>
      {/* ================= GUEST ROUTES ================= */}
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

      {/* ================ PROTECTED ROUTES ================ */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/children" element={<MyChildren />} />
          <Route path="/add-child" element={<AddChild />} />

          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/add-vaccination" element={<AddVaccination />} />
          <Route path="/important-vaccines" element={<ImportantVaccines />} />

          <Route path="/community" element={<Community />} />
          
          <Route path="/settings" element={<Settings />} />

          <Route path="/mother/:id" element={<UserProfile />} />

          <Route path="/child-detail/:id" element={<ChildDetail />} />
          <Route path="/child/:childId/growth" element={<ChildGrowthTracking />} />

          {/* AI Assistant */}
          <Route path="/ai-assistant" element={<AIChatbotBorder></AIChatbotBorder>}></Route>
          <Route path="/ai-assistant/chat" element={<ConversationAIChatbot />} />
          <Route path="/ai-assistant/chat/:id" element={<ConversationAIChatbot />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
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
import ChildDetail from "./pages/Childdetail"; // ✅ NEW IMPORT

function App() {
  const { accessToken } = useAuth();

  return (
    <div className="">
      {/* Show Header only when logged in */}
      {accessToken && <Header />}

      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/children"
          element={
            <ProtectedRoutes>
              <MyChildren />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/add-child"
          element={
            <ProtectedRoutes>
              <AddChild />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoutes>
              <Community />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/vaccinations"
          element={
            <ProtectedRoutes>
              <Vaccinations />
            </ProtectedRoutes>
          }
        />

        {/* ✅ New Child Detail Route */}
        <Route
          path="/childdetail/:id"
          element={
            <ProtectedRoutes>
              <ChildDetail />
            </ProtectedRoutes>
          }
        />

        {/* Guest Routes */}
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

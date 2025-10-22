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

function App() {
  const { accessToken } = useAuth();

  return (
    <div className="">
      {accessToken && <Header></Header>}
      <Routes>
        <Route path="/" element={<ProtectedRoutes><Home></Home></ProtectedRoutes>}></Route>
        <Route path="/children" element={<ProtectedRoutes><MyChildren></MyChildren></ProtectedRoutes>}>
        </Route>
        <Route path="/add-child" element={<ProtectedRoutes><AddChild></AddChild></ProtectedRoutes>}></Route>
        <Route path="/community" element={<ProtectedRoutes><Community></Community></ProtectedRoutes>}></Route>
        <Route path="/vaccinations" element={<ProtectedRoutes><Vaccinations></Vaccinations></ProtectedRoutes>}>
        

        </Route>
        <Route path="/login" element={<GuestRoute><Login></Login></GuestRoute>}></Route>
        <Route path="/signup" element={<GuestRoute><Signup></Signup></GuestRoute>}></Route>
       
      </Routes>
      
    </div>
  )
}

export default App
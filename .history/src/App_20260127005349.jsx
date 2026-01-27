import { Route, Routes, useLocation } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Postlist from "./pages/Postlist.jsx";
import Navbar from "./component/Navbar.jsx";

function App() {
  const location = useLocation();

  // Pages where Navbar should NOT appear
  const hideNavbarRoutes = ["/", "/login"];

  return (
    <div>
      {/* Show Navbar only if route is NOT register or login */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/posts" element={<Postlist />} />
      </Routes>
    </div>
  );
}

export default App;

import { Route, Router, Routes } from "react-router-dom";
import Register from "../src/pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Postlist from "./pages/Postlist.jsx";
function App() {
  return (
    <div>
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

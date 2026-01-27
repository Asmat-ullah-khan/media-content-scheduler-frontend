import { Route, Router, Routes } from "react-router-dom";
import Register from "../src/pages/Register.jsx";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;

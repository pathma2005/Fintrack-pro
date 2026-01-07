import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard2 from "./pages/Dashboard2";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/dashboard2" element={<Dashboard2 />} />
      </Routes>
    </Router>
  );
}

export default App;







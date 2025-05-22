import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import DashboardEmployee from "./pages/DashboardEmployee";
import DashboardManager from "./pages/DashboardManager";
import DashboardAdmin from "./pages/DashboardAdmin";
import CreateSoftware from "./components/CreateSoftware";
import Login from "./components/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/employee" element={<DashboardEmployee />} />
        <Route path="/dashboard/manager" element={<DashboardManager />} />
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/admin/create-software" element={<CreateSoftware />} />
      </Routes>
    </Router>
  );
}

export default App;

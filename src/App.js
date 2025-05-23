// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterLogin from "./src/pages/RegisterLogin";
import TenantInput from "./src/pages/TenantInput";
import TenantList from "./src/pages/TenantList";

function App() {
  return (
    <Router>
      <div className="sidebar">
        <h2>Tenant Management</h2>
        <nav>
          <ul>
            <li><Link to="/">Login / Register</Link></li>
            <li><Link to="/input">Input Data Penyewa</Link></li>
            <li><Link to="/list">Lihat / Edit Data Penyewa</Link></li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<RegisterLogin />} />
          <Route path="/input" element={<TenantInput />} />
          <Route path="/list" element={<TenantList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React from 'react'; // ✅ must be at the top
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashbord";
import AdminUsers from "./pages/AdminUsers";
import AdminHosts from "./pages/AdminHosts";
import AdminCars from "./pages/AdminCars";
import AdminBookings from "./pages/AdminBookings";
import AdminPayments from "./pages/AdminPayments";
import AdminReports from "./pages/AdminReports";
import AdminMessages from "./pages/AdminMessages";
import AdminContent from "./pages/AdminContent";
import AdminSettings from "./pages/AdminSettings";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminHelp from "./pages/AdminHelp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/users" element={<AdminUsers />} />
        <Route path="/hosts" element={<AdminHosts />} />
        <Route path="/cars" element={<AdminCars />} />
        <Route path="/bookings" element={<AdminBookings />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/reports" element={<AdminReports />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/content" element={<AdminContent />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        <Route path="/help" element={<AdminHelp />} />
      </Routes>
    </Router>
  );
}

export default App;

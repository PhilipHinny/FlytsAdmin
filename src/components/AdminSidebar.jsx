"use client"

import { useState } from "react"
import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Shield,
  Car,
  Calendar,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import "../styles/AdminSidebar.css"

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/", // changed from "/admin/dashboard"
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      path: "/users", // changed from "/admin/users"
    },
    {
      id: "hosts",
      label: "Hosts",
      icon: Shield,
      path: "/hosts", // changed from "/admin/hosts"
    },
    {
      id: "cars",
      label: "Cars",
      icon: Car,
      path: "/cars", // changed from "/admin/cars"
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: Calendar,
      path: "/bookings", // changed from "/admin/bookings"
    },
    {
      id: "payments",
      label: "Payments",
      icon: DollarSign,
      path: "/payments", // changed from "/admin/payments"
    },
    {
      id: "reports",
      label: "Reports",
      icon: AlertTriangle,
      path: "/reports", // changed from "/admin/reports"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/analytics", // changed from "/admin/analytics"
    },
    {
      id: "content",
      label: "Content",
      icon: FileText,
      path: "/content", // changed from "/admin/content"
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      path: "/employees",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/settings", // changed from "/admin/settings"
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      path: "/help", // changed from "/admin/help"
    },
  ]

  const handleMenuClick = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    // Handle logout logic
    navigate("/login")
  }

  return (
    <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo">
            <span className="logo-text">FL<span style={{color:"black"}}>Y</span>TS</span>
            <span className="logo-admin">Admin</span>
          </div>
        </div>
        <button className="collapse-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => handleMenuClick(item.path)}
              title={isCollapsed ? item.label : ""}
            >
              <div className="nav-icon">
                <item.icon size={20} />
              </div>
              {!isCollapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {/* {item.badge && <span className="nav-badge">{item.badge}</span>} */}
                </>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title={isCollapsed ? "Logout" : ""}>
          <div className="nav-icon">
            <LogOut size={20} />
          </div>
          {!isCollapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default AdminSidebar

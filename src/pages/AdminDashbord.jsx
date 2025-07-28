"use client"

import { useState } from "react"
import React from "react"
import { Users, Car, Calendar, DollarSign, AlertTriangle, BarChart3, Activity, Shield, Bell } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminDashboard.css"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 15420,
    totalHosts: 3240,
    totalRenters: 12180,
    totalCars: 8950,
    activeCars: 7230,
    totalBookings: 45680,
    activeTrips: 234,
    totalRevenue: 2450000,
    monthlyRevenue: 185000,
    pendingVerifications: 45,
    reportedIssues: 12,
    newSignups: 156,
  })

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: "booking",
      message: "New booking created by John Doe",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "verification",
      message: "Host verification pending for BMW X5",
      time: "15 minutes ago",
      status: "warning",
    },
    {
      id: 3,
      type: "payment",
      message: "Payment of $450 processed successfully",
      time: "1 hour ago",
      status: "success",
    },
    {
      id: 4,
      type: "issue",
      message: "Damage report submitted for Trip #FL12345",
      time: "2 hours ago",
      status: "error",
    },
    {
      id: 5,
      type: "user",
      message: "25 new users registered today",
      time: "3 hours ago",
      status: "info",
    },
  ])

  const [quickActions] = useState([
    { id: 1, title: "Verify Pending Cars", count: 23, icon: Car, color: "orange" },
    { id: 2, title: "Review Reports", count: 12, icon: AlertTriangle, color: "red" },
    { id: 3, title: "Process Refunds", count: 8, icon: DollarSign, color: "blue" },
    { id: 4, title: "User Verifications", count: 15, icon: Shield, color: "green" },
  ])

  const getActivityIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar size={16} />
      case "verification":
        return <Shield size={16} />
      case "payment":
        return <DollarSign size={16} />
      case "issue":
        return <AlertTriangle size={16} />
      case "user":
        return <Users size={16} />
      default:
        return <Activity size={16} />
    }
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="admin-content">
        <div className="admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, Admin. Here's what's happening on FLIITS today.</p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">5</span>
            </button>
            <div className="admin-profile">
              <img src="/placeholder.svg?height=40&width=40" alt="Admin" />
              <span>Admin User</span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalUsers.toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="stat-change positive">+{stats.newSignups} this week</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cars">
              <Car size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalCars.toLocaleString()}</h3>
              <p>Total Cars</p>
              <span className="stat-change positive">{stats.activeCars.toLocaleString()} active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalBookings.toLocaleString()}</h3>
              <p>Total Bookings</p>
              <span className="stat-change positive">{stats.activeTrips} active trips</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>${stats.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
              <span className="stat-change positive">${stats.monthlyRevenue.toLocaleString()} this month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => (
              <div key={action.id} className={`action-card ${action.color}`}>
                <div className="action-icon">
                  <action.icon size={24} />
                </div>
                <div className="action-content">
                  <h3>{action.count}</h3>
                  <p>{action.title}</p>
                </div>
                <button className="action-btn">View All</button>
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Activities */}
        <div className="dashboard-grid">
          <div className="chart-section">
            <div className="section-header">
              <h2>Revenue Analytics</h2>
              <div className="chart-controls">
                <button className="active">7D</button>
                <button>30D</button>
                <button>90D</button>
              </div>
            </div>
            <div className="chart-placeholder">
              <BarChart3 size={48} />
              <p>Revenue chart would be displayed here</p>
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="stat-label">This Week</span>
                  <span className="stat-value">$45,230</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Last Week</span>
                  <span className="stat-value">$38,940</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Growth</span>
                  <span className="stat-value positive">+16.2%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-section">
            <div className="section-header">
              <h2>Recent Activities</h2>
              <button className="view-all-btn">View All</button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity) => (
                <div key={activity.id} className={`activity-item ${activity.status}`}>
                  <div className="activity-icon">{getActivityIcon(activity.type)}</div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="platform-health">
          <h2>Platform Health</h2>
          <div className="health-grid">
            <div className="health-card">
              <div className="health-header">
                <h3>System Status</h3>
                <span className="status-badge operational">Operational</span>
              </div>
              <div className="health-metrics">
                <div className="metric">
                  <span>Uptime</span>
                  <span>99.9%</span>
                </div>
                <div className="metric">
                  <span>Response Time</span>
                  <span>245ms</span>
                </div>
                <div className="metric">
                  <span>Error Rate</span>
                  <span>0.01%</span>
                </div>
              </div>
            </div>

            <div className="health-card">
              <div className="health-header">
                <h3>User Engagement</h3>
                <span className="status-badge good">Good</span>
              </div>
              <div className="health-metrics">
                <div className="metric">
                  <span>Daily Active Users</span>
                  <span>8,450</span>
                </div>
                <div className="metric">
                  <span>Session Duration</span>
                  <span>12m 34s</span>
                </div>
                <div className="metric">
                  <span>Bounce Rate</span>
                  <span>23%</span>
                </div>
              </div>
            </div>

            <div className="health-card">
              <div className="health-header">
                <h3>Support Queue</h3>
                <span className="status-badge warning">Attention</span>
              </div>
              <div className="health-metrics">
                <div className="metric">
                  <span>Open Tickets</span>
                  <span>47</span>
                </div>
                <div className="metric">
                  <span>Avg Response</span>
                  <span>2h 15m</span>
                </div>
                <div className="metric">
                  <span>Resolution Rate</span>
                  <span>94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

"use client"

import { useState, useEffect, useCallback } from "react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { Users, Car, Calendar, DollarSign, AlertTriangle, BarChart3, Activity, Shield, Bell } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminDashboard.css"
import { fetchWithAuth } from "../lib/utils"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHosts: 0,
    totalRenters: 0,
    totalCars: 0,
    activeCars: 0,
    totalBookings: 0,
    activeTrips: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingVerifications: 0,
    reportedIssues: 0,
    newSignups: 0,
  })

  const [recentActivities, setRecentActivities] = useState([])
  const [quickActions, setQuickActions] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const adminName = (typeof window !== "undefined" && localStorage.getItem("flyts_admin_name")) || "Admin"

  const iconMap = {
    Car,
    AlertTriangle,
    DollarSign,
    Shield,
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchDashboard = async () => {
      try {
        const tryFetch = async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          return res.json()
        }
        const data = await tryFetch("/api/admin/dashboard")
        if (data?.stats) setStats(data.stats)
        if (Array.isArray(data?.recentActivities)) setRecentActivities(data.recentActivities)
        if (Array.isArray(data?.quickActions)) setQuickActions(data.quickActions)
      } catch (e) {
        if (e.name !== "AbortError") console.error("Error fetching dashboard:", e)
      }
    }
    fetchDashboard()
    return () => controller.abort()
  }, [])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetchWithAuth("/admin/notifications", { method: "GET" })
      if (!res.ok) throw new Error("Failed to load notifications")
      const data = await res.json()
      const list = Array.isArray(data?.notifications) ? data.notifications : Array.isArray(data) ? data : []
      const filtered = list.filter((n) => {
        const t = (n.type || n.category || "").toLowerCase()
        const msg = (n.message || n.title || "").toLowerCase()
        const isVerification = t.includes("verification") || msg.includes("verification") || msg.includes("approved") || msg.includes("verified")
        const mentionsEntity = msg.includes("profile") || msg.includes("car") || msg.includes("user") || (n.entity || "").toLowerCase().match(/profile|car|user/)
        const alreadyHandled = Boolean(n.handled || n.resolved || (n.status || "").toLowerCase().includes("handled") || (n.status || "").toLowerCase().includes("resolved"))
        return isVerification && mentionsEntity && !alreadyHandled
      })
      setNotifications(filtered.map((n) => ({
        id: n.id || n._id || crypto.randomUUID(),
        message: n.message || n.title || "Notification",
        createdAt: n.createdAt || n.timestamp || new Date().toISOString(),
        read: Boolean(n.read),
        entityType: (n.entityType || n.entity || n.targetType || n.type || "").toString().toLowerCase(),
        entityId: n.entityId || n.targetId || n.userId || n.carId || n.profileId || n.hostId || null,
        carId: n.carId || n.car_id || null,
        raw: n,
      })))
    } catch (_) {
      setNotifications([])
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const hasUnread = notifications.some((n) => !n.read)

  const openNotifications = async () => {
    setIsNotifOpen((v) => !v)
    if (hasUnread) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      try {
        await fetchWithAuth("/admin/notifications/read-all", { method: "POST" })
      } catch (_) {}
    }
  }

  const resolveEntityKind = (n) => {
    const t = (n.entityType || "").toLowerCase()
    if (t.includes("car")) return "car"
    if (t.includes("user") || t.includes("profile")) return "user"
    if (t.includes("host")) return "host"
    const msg = (n.message || "").toLowerCase()
    if (msg.includes("car")) return "car"
    if (msg.includes("profile") || msg.includes("user")) return "user"
    return null
  }

  const getCarIdFromNotification = (n) => {
    return n.carId || n.entityId || n.raw?.car_id || n.raw?.carId || n.raw?.id || null
  }

  const handleVerification = async (n, approve) => {
    const kind = resolveEntityKind(n)
    const id = n.entityId
    if (!kind || !id) {
      alert("Missing entity information for this notification.")
      return
    }
    try {
      if (kind === "user") {
        await fetchWithAuth(`/admin/users/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: approve, verification_status: approve ? "approved" : "rejected" })
        })
      } else if (kind === "car") {
        const carId = getCarIdFromNotification(n)
        if (!carId) throw new Error("Missing carId")
        const endpoint = `/admin/cars/${carId}/${approve ? "approve" : "deny"}`
        try {
          await fetchWithAuth(endpoint, { method: "POST" })
        } catch (err) {
          console.error("Car verification failed:", endpoint, err)
          alert(`Request failed (likely 404). Please verify backend route: POST ${endpoint}`)
          return
        }
      } else if (kind === "host") {
        await fetchWithAuth(`/admin/hosts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: approve, pendingVerification: false, status: approve ? "active" : "suspended" })
        })
      }
      setNotifications((prev) => prev.filter((x) => x.id !== n.id))
      try {
        await fetchWithAuth(`/admin/notifications/${n.id}`, { method: "DELETE" })
      } catch (_) {}
      await fetchNotifications()
    } catch (e) {
      alert("Failed to update verification status.")
    }
  }

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

  const handleQuickAction = (title) => {
    const t = (title || "").toLowerCase()
    if (t.includes("car")) return navigate("/cars")
    if (t.includes("report")) return navigate("/reports")
    if (t.includes("refund")) return navigate("/payments")
    if (t.includes("user")) return navigate("/users")
  }

  return (
    <div className="admin-dashboard">
      <AdminSidebar />

      <div className="admin-content">
        <div className="admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {adminName}. Here's what's happening on FLYTS today.</p>
          </div>
          <div className="header-right" style={{ position: "relative" }}>
            <button className="notification-btn" onClick={openNotifications}>
              <Bell size={20} />
              {hasUnread ? <span className="notification-badge"></span> : null}
            </button>
            {isNotifOpen && (
              <div className="notifications-panel">
                <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Notifications</span>
                  <button className="action-btn" onClick={() => fetchNotifications()}>Reload</button>
                </div>
                {notifications.length === 0 ? (
                  <div className="panel-empty">No notifications</div>
                ) : (
                  <ul className="panel-list">
                    {notifications.slice(0, 10).map((n) => (
                      <li key={n.id} className={`panel-item ${n.read ? '' : 'unread'}`}>
                        <div className="item-message">{n.message}</div>
                        <div className="item-time">{new Date(n.createdAt).toLocaleString()}</div>
                        {(resolveEntityKind(n) && (n.entityId || n.carId || n.raw?.car_id || n.raw?.carId || n.raw?.id)) ? (
                          <div className="item-actions">
                            <button className="btn-approve" onClick={() => handleVerification(n, true)}>Approve</button>
                            <button className="btn-reject" onClick={() => handleVerification(n, false)}>Reject</button>
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{Number(stats.totalUsers).toLocaleString()}</h3>
              <p>Total Users</p>
              <span className="stat-change positive">+{Number(stats.newSignups).toLocaleString()} this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cars">
              <Car size={24} />
            </div>
            <div className="stat-content">
              <h3>{Number(stats.totalCars).toLocaleString()}</h3>
              <p>Total Cars</p>
              <span className="stat-change positive">{Number(stats.activeCars).toLocaleString()} active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>{Number(stats.totalBookings).toLocaleString()}</h3>
              <p>Total Bookings</p>
              <span className="stat-change positive">{Number(stats.activeTrips).toLocaleString()} active trips</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>Ksh {Number(stats.totalRevenue).toLocaleString()}</h3>
              <p>Total Revenue</p>
              <span className="stat-change positive">Ksh {Number(stats.monthlyRevenue).toLocaleString()} this month</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action) => {
              const IconCmp = iconMap[action.icon] || Activity
              return (
                <div key={action.id} className={`action-card ${action.color}`}>
                  <div className="action-icon">
                    <IconCmp size={24} />
                  </div>
                  <div className="action-content">
                    <h3>{Number(action.count).toLocaleString()}</h3>
                    <p>{action.title}</p>
                  </div>
                  <button className="action-btn" onClick={() => handleQuickAction(action.title)}>View All</button>
                </div>
              )
            })}
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
                  <span className="stat-label">This Month</span>
                  <span className="stat-value">Ksh {Number(stats.monthlyRevenue).toLocaleString()}</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-value">Ksh {Number(stats.totalRevenue).toLocaleString()}</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Active Trips</span>
                  <span className="stat-value positive">+{Number(stats.activeTrips).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="activity-section">
            <div className="section-header">
              <h2>Recent Activities</h2>
              <button className="view-all-btn" onClick={() => navigate("/bookings")}>View All</button>
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

"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, AlertTriangle, MessageCircle, Shield } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminReports.css"

const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [reports, setReports] = useState([
    {
      id: "RPT001",
      type: "Damage Report",
      reportedBy: "John Doe",
      reportedAgainst: "Sarah Wilson",
      bookingId: "FL123456",
      description: "Car had scratches on the left side door",
      status: "Under Review",
      priority: "High",
      date: "2024-01-25",
      category: "Vehicle Damage",
    },
    {
      id: "RPT002",
      type: "User Behavior",
      reportedBy: "Lisa Garcia",
      reportedAgainst: "Mike Johnson",
      bookingId: "FL123458",
      description: "Renter was late for pickup and didn't respond to messages",
      status: "Resolved",
      priority: "Medium",
      date: "2024-01-24",
      category: "Communication",
    },
    {
      id: "RPT003",
      type: "Payment Issue",
      reportedBy: "David Brown",
      reportedAgainst: "Platform",
      bookingId: "FL123457",
      description: "Payment was charged twice for the same booking",
      status: "Open",
      priority: "High",
      date: "2024-01-23",
      category: "Payment",
    },
    {
      id: "RPT004",
      type: "Safety Concern",
      reportedBy: "Emily Davis",
      reportedAgainst: "Robert Kim",
      bookingId: "FL123459",
      description: "Host provided a car with faulty brakes",
      status: "Urgent",
      priority: "Critical",
      date: "2024-01-22",
      category: "Safety",
    },
  ])

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedAgainst.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || report.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const handleReportAction = (action, reportId) => {
    console.log(`${action} report ${reportId}`)
  }

  const getReportIcon = (type) => {
    switch (type) {
      case "Damage Report":
        return <AlertTriangle size={16} />
      case "User Behavior":
        return <MessageCircle size={16} />
      case "Safety Concern":
        return <Shield size={16} />
      default:
        return <AlertTriangle size={16} />
    }
  }

  return (
    <div className="admin-reports">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Reports Management</h1>
            <p>Manage user reports and platform issues</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">Export Reports</button>
            <button className="btn-primary">Create Report</button>
          </div>
        </div>

        <div className="reports-stats">
          <div className="stat-card urgent">
            <div className="stat-content">
              <h3>{reports.filter((r) => r.status === "Urgent").length}</h3>
              <p>Urgent Reports</p>
            </div>
          </div>
          <div className="stat-card open">
            <div className="stat-content">
              <h3>{reports.filter((r) => r.status === "Open").length}</h3>
              <p>Open Reports</p>
            </div>
          </div>
          <div className="stat-card review">
            <div className="stat-content">
              <h3>{reports.filter((r) => r.status === "Under Review").length}</h3>
              <p>Under Review</p>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-content">
              <h3>{reports.filter((r) => r.status === "Resolved").length}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        <div className="reports-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search reports by ID, user, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="urgent">Urgent</option>
              <option value="open">Open</option>
              <option value="under review">Under Review</option>
              <option value="resolved">Resolved</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="reports-table">
          <table>
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Type</th>
                <th>Reported By</th>
                <th>Against</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div className="report-id">
                      <div>#{report.id}</div>
                      <div className="booking-ref">Booking: {report.bookingId}</div>
                    </div>
                  </td>
                  <td>
                    <div className="report-type">
                      {getReportIcon(report.type)}
                      <span>{report.type}</span>
                    </div>
                  </td>
                  <td>{report.reportedBy}</td>
                  <td>{report.reportedAgainst}</td>
                  <td>
                    <div className="description">
                      {report.description.length > 50
                        ? `${report.description.substring(0, 50)}...`
                        : report.description}
                    </div>
                  </td>
                  <td>
                    <span className={`priority ${report.priority.toLowerCase()}`}>{report.priority}</span>
                  </td>
                  <td>
                    <span className={`status ${report.status.toLowerCase().replace(" ", "-")}`}>{report.status}</span>
                  </td>
                  <td>{report.date}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleReportAction("view", report.id)}>
                        <Eye size={16} />
                      </button>
                      <button>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminReports

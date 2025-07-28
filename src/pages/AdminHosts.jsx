"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle, Star } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminHosts.css"

const AdminHosts = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [hosts, setHosts] = useState([
    {
      id: 1,
      name: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phone: "+1 234 567 8900",
      status: "Active",
      joinDate: "2024-01-15",
      totalCars: 3,
      totalEarnings: 12450,
      rating: 4.8,
      totalTrips: 89,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      pendingVerification: false,
    },
    {
      id: 2,
      name: "David Brown",
      email: "david.brown@email.com",
      phone: "+1 234 567 8901",
      status: "Pending",
      joinDate: "2024-01-20",
      totalCars: 1,
      totalEarnings: 0,
      rating: 0,
      totalTrips: 0,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
      pendingVerification: true,
    },
    {
      id: 3,
      name: "Lisa Garcia",
      email: "lisa.garcia@email.com",
      phone: "+1 234 567 8902",
      status: "Suspended",
      joinDate: "2024-01-05",
      totalCars: 2,
      totalEarnings: 5600,
      rating: 3.2,
      totalTrips: 34,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
      pendingVerification: false,
    },
  ])

  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      host.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || host.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleHostAction = (action, hostId) => {
    console.log(`${action} host ${hostId}`)
  }

  return (
    <div className="admin-hosts">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Hosts Management</h1>
            <p>Manage all hosts and their verification status</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">Export Hosts</button>
            <button className="btn-primary">Verify Pending</button>
          </div>
        </div>

        <div className="hosts-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search hosts by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="hosts-table">
          <table>
            <thead>
              <tr>
                <th>Host</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Cars</th>
                <th>Performance</th>
                <th>Earnings</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHosts.map((host) => (
                <tr key={host.id}>
                  <td>
                    <div className="host-info">
                      <img src={host.avatar || "/placeholder.svg"} alt={host.name} />
                      <div>
                        <div className="host-name">
                          {host.name}
                          {host.verified && <span className="verified-badge">✓</span>}
                        </div>
                        <div className="host-id">Host ID: {host.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{host.email}</div>
                      <div className="phone">{host.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${host.status.toLowerCase()}`}>{host.status}</span>
                  </td>
                  <td>
                    <div className="cars-info">
                      <div>{host.totalCars} cars</div>
                    </div>
                  </td>
                  <td>
                    <div className="performance-info">
                      <div className="rating">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        {host.rating > 0 ? host.rating : "N/A"}
                        <div className="trips">{host.totalTrips} trips</div>
                      </div>
                      
                    </div>
                  </td>
                  <td>
                    <div className="earnings">${host.totalEarnings.toLocaleString()}</div>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleHostAction("view", host.id)}>
                        <Eye size={16} />
                      </button>
                      {host.pendingVerification && (
                        <>
                          <button className="approve-btn" onClick={() => handleHostAction("approve", host.id)}>
                            <CheckCircle size={16} />
                          </button>
                          <button className="reject-btn" onClick={() => handleHostAction("reject", host.id)}>
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button onClick={() => handleHostAction("edit", host.id)}>
                        <Edit size={16} />
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

export default AdminHosts

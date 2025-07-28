"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, Trash2, UserPlus, Download } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminUsers.css"

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "+1 234 567 8900",
      userType: "Renter",
      status: "Active",
      joinDate: "2024-01-15",
      totalTrips: 12,
      totalSpent: 2450,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "+1 234 567 8901",
      userType: "Host",
      status: "Active",
      joinDate: "2024-01-10",
      totalTrips: 45,
      totalEarned: 8900,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@email.com",
      phone: "+1 234 567 8902",
      userType: "Renter",
      status: "Suspended",
      joinDate: "2024-01-08",
      totalTrips: 3,
      totalSpent: 450,
      avatar: "/placeholder.svg?height=40&width=40",
      verified: false,
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || user.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleUserAction = (action, userId) => {
    console.log(`${action} user ${userId}`)
  }

  return (
    <div className="admin-users">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Users Management</h1>
            <p>Manage all users on the FLIITS platform</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <Download size={20} />
              Export
            </button>
            <button className="btn-primary">
              <UserPlus size={20} />
              Add User
            </button>
          </div>
        </div>

        <div className="users-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Type</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <div>
                        <div className="user-name">
                          {user.name}
                          {user.verified && <span className="verified-badge">✓</span>}
                        </div>
                        <div className="user-id">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div>{user.email}</div>
                      <div className="phone">{user.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`user-type ${user.userType.toLowerCase()}`}>{user.userType}</span>
                  </td>
                  <td>
                    <span className={`status ${user.status.toLowerCase()}`}>{user.status}</span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div className="activity-info">
                      <div>{user.totalTrips} trips</div>
                      <div className="amount">${user.userType === "Host" ? user.totalEarned : user.totalSpent}</div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleUserAction("view", user.id)}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleUserAction("edit", user.id)}>
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleUserAction("delete", user.id)}>
                        <Trash2 size={16} />
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

export default AdminUsers

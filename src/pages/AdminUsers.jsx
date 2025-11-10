"use client"

import { useState, useEffect } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, Trash2, UserPlus, Download } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import Modal from "../components/Modal"
import { normalizeProfilePicture } from "../lib/utils"
import "../styles/AdminUsers.css"

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const apiRequest = async (method, pathSuffix, body) => {
    const tryOnce = async (suffix) => {
      const res = await fetch(`${apiBaseUrl}${suffix}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) throw new Error(`${method} ${suffix} failed: ${res.status}`)
      if (res.status === 204) return null
      return res.json()
    }
    return await tryOnce(`/api${pathSuffix}`)
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchUsers = async () => {
      try {
        const tryFetch = async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          return res.json()
        }
        const data = await tryFetch("/admin/users")
        const normalized = Array.isArray(data)
          ? data.map((user) => {
              const normalizedType =
                user.userType === true
                  ? "Host"
                  : user.userType === false
                  ? "Renter"
                  : user.userType || "Renter"
              const avatarUrl =
                user.avatar || user.profile_picture || user.profilePictureUrl || user.profile_picture_url || user.photoURL || ""
              return {
                id: user.id,
                name: user.name || "Unknown",
                email: user.email || "",
                phone: user.phone || "",
                userType: normalizedType,
                verification_status: user.verification_status || "",
                joinDate: user.joinDate || "",
                totalTrips: user.totalTrips ?? 0,
                totalSpent: user.totalSpent ?? 0,
                totalEarned: user.totalEarned ?? 0,
                avatar: avatarUrl || "/placeholder.svg",
                verified: Boolean(user.verified),
              }
            })
          : []
        setUsers(normalized)
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching users:", error)
        }
      }
    }
    fetchUsers()
    return () => controller.abort()
  }, [])

  const filteredUsers = users.filter((user) => {
    const nameLc = (user.name || "").toLowerCase()
    const emailLc = (user.email || "").toLowerCase()
    const verificationStatusLc = (user.verification_status || "").toLowerCase()
    const matchesSearch = nameLc.includes(searchTerm.toLowerCase()) || emailLc.includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || verificationStatusLc === filterStatus
    return matchesSearch && matchesFilter
  })

  const openView = (user) => {
    setSelectedUser(user)
    setIsViewOpen(true)
  }

  const openEdit = (user) => {
    setSelectedUser(user)
    setIsEditOpen(true)
  }

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Delete this user? This action cannot be undone.")
    if (!confirm) return
    try {
      setIsLoadingAction(true)
      await apiRequest("DELETE", `/api/admin/users/${userId}`)
      setUsers((prev) => prev.filter((u) => u.id !== userId))
    } catch (e) {
      console.error(e)
      alert("Failed to delete user.")
    } finally {
      setIsLoadingAction(false)
    }
  }

 const handleEditSave = async (updates) => {
  if (!selectedUser) return
  try {
    setIsLoadingAction(true)
    const updated = await apiRequest("PATCH", `/admin/users/${selectedUser.id}`, updates)
    const merged = {
      ...selectedUser,
      ...updated,
      verification_status: updates.verification_status || selectedUser.verification_status, // keep status in sync
      verified: updates.verified ?? selectedUser.verified,
    }
    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? merged : u)))
    setIsEditOpen(false)
    setSelectedUser(null)
  } catch (e) {
    console.error(e)
    alert("Failed to save changes.")
  } finally {
    setIsLoadingAction(false)
  }
}


  const handleUserAction = (action, userId) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return
    if (action === "view") return openView(user)
    if (action === "edit") return openEdit(user)
    if (action === "delete") return handleDelete(userId)
  }

  const exportCsv = () => {
    const rows = filteredUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      userType: u.userType,
      verification_status: u.verification_status,
      joinDate: u.joinDate,
      totalTrips: u.totalTrips,
      totalSpent: u.totalSpent,
      totalEarned: u.totalEarned,
      verified: u.verified ? "true" : "false",
    }))
    const headers = [
      "User ID",
      "Name",
      "Email",
      "Phone",
      "Type",
      "Verification Status",
      "Join Date",
      "Total Trips",
      "Total Spent",
      "Total Earned",
      "Verified",
    ]
    const escapeCsv = (val) => {
      const s = val == null ? "" : String(val)
      if (/[",\n]/.test(s)) {
        return '"' + s.replace(/"/g, '""') + '"'
      }
      return s
    }
    const csv = [headers.join(","), ...rows.map((r) => Object.values(r).map(escapeCsv).join(",")).join("\n")]
  }

  const handleImgError = (e) => {
    const target = e.currentTarget
    if (target.dataset.fallbackApplied) return
    target.dataset.fallbackApplied = "1"
    target.src = "/Flyts logo.png"
  }

  return (
    <div className="admin-users">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Users Management</h1>
            <p>Manage all users on the FLYTS platform</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={exportCsv}>
              <Download size={20} />
              Export
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
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
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
                    <div className="user-id" title={user.id}>{(user.id || "").slice(0, 4)}…</div>
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-name">
                        {user.name}
                        {user.verified && <span className="verified-badge">✓</span>}
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
                    <span className={`verification-status ${user.verification_status.toLowerCase()}`}>{user.verification_status}</span>
                  </td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div className="activity-info">
                      <div>{user.totalTrips} trips</div>
                      <div className="amount">Ksh {user.userType === "Host" ? user.totalEarned : user.totalSpent}</div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button disabled={isLoadingAction} onClick={() => handleUserAction("view", user.id)}>
                        <Eye size={16} />
                      </button>
                      <button disabled={isLoadingAction} onClick={() => handleUserAction("edit", user.id)}>
                        <Edit size={16} />
                      </button>
                      <button disabled={isLoadingAction} onClick={() => handleUserAction("delete", user.id)}>
                        <Trash2 size={16} />
                      </button>
                      <button disabled={isLoadingAction}>
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isViewOpen && !!selectedUser}
          onClose={() => {
            setIsViewOpen(false)
            setSelectedUser(null)
          }}
          title="User Details"
          footer={
            <button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedUser(null) }}>Close</button>
          }
        >
          {selectedUser && (
            <div className="modal-body">
              <img src={(normalizeProfilePicture(selectedUser.avatar) || "/placeholder.svg")} alt="profile" className="modal-avatar" onError={handleImgError} />
              <div>
                <div><strong>User ID:</strong> {selectedUser.id}</div>
                <div><strong>Name:</strong> {selectedUser.name}</div>
                <div><strong>Email:</strong> {selectedUser.email || "-"}</div>
                <div><strong>Phone:</strong> {selectedUser.phone || "-"}</div>
                <div><strong>User Type:</strong> {selectedUser.userType}</div>
                <div><strong>Status:</strong> {selectedUser.status}</div>
                <div><strong>Join Date:</strong> {selectedUser.joinDate}</div>
                <div><strong>Trips:</strong> {selectedUser.totalTrips}</div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isEditOpen && !!selectedUser}
          onClose={() => {
            if (!isLoadingAction) {
              setIsEditOpen(false)
              setSelectedUser(null)
            }
          }}
          title="Edit User"
          footer={null}
        >
          {selectedUser && (
            <EditUserModal
              user={selectedUser}
              onCancel={() => { setIsEditOpen(false); setSelectedUser(null) }}
              onSave={handleEditSave}
              isSaving={isLoadingAction}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}

const EditUserModal = ({ user, onCancel, onSave, isSaving }) => {
  const [status, setStatus] = useState(user.status || "")
  const [verified, setVerified] = useState(Boolean(user.verified))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ verification_status: status, verified })
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <label>
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
        <span>Verify User</span>
      </label>
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  )
}

export default AdminUsers

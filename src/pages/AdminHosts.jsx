"use client"

import { useState, useEffect } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle, Star } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminHosts.css"
import { normalizeProfilePicture } from "../lib/utils"
import Modal from "../components/Modal"

const AdminHosts = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [hosts, setHosts] = useState([])
  const [selectedHost, setSelectedHost] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const tryApi = async (method, path, body) => {
    const doReq = async (suffix) => {
      const res = await fetch(`${apiBaseUrl}${suffix}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) throw new Error(`${method} ${suffix} failed: ${res.status}`)
      if (res.status === 204) return null
      return res.json()
    }
    return await doReq(`/api${path}`)
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchHosts = async () => {
      try {
        const tryFetch = async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          return res.json()
        }
        const data = await tryFetch("/api/admin/hosts")
        const normalized = Array.isArray(data)
          ? data.map((h) => {
              const avatarUrl = h.avatar || h.profile_picture || h.profilePictureUrl || h.profile_picture_url || h.photoURL || ""
              return {
                id: h.id,
                name: h.name || "Unknown",
                email: h.email || "",
                phone: h.phone || "",
                status: h.status || "",
                joinDate: h.joinDate || "",
                totalCars: h.totalCars ?? 0,
                totalEarnings: h.totalEarnings ?? 0,
                rating: h.rating ?? 0,
                totalTrips: h.totalTrips ?? 0,
                avatar: avatarUrl || "/placeholder.svg",
                is_verified: Boolean(h.is_verified),
                verification_status: h.verification_status,
              }
            })
          : []
        setHosts(normalized)
      } catch (e) {
        if (e.name !== "AbortError") console.error("Error fetching hosts:", e)
      }
    }
    fetchHosts()
    return () => controller.abort()
  }, [])

  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      (host.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (host.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || (host.status || "").toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleHostAction = (action, hostId) => {
    if (action === "view") {
      const host = hosts.find((h) => h.id === hostId)
      if (host) {
        setSelectedHost(host)
        setIsViewOpen(true)
      }
      return
    }
    console.log(`${action} host ${hostId}`)
  }

  const handleImgError = (e) => {
    const target = e.currentTarget
    if (target.dataset.fallbackApplied) return
    target.dataset.fallbackApplied = "1"
    target.src = "/Flyts logo.png"
  }

  const exportCsv = () => {
    const rows = filteredHosts.map((h) => ({
      id: h.id,
      name: h.name,
      email: h.email,
      phone: h.phone,
      status: h.status,
      joinDate: h.joinDate,
      totalCars: h.totalCars,
      rating: h.rating,
      totalTrips: h.totalTrips,
      totalEarnings: h.totalEarnings,
      is_verified: h.is_verified,
      verification_status: h.verification_status,
    }))
    const headers = [
      "Host ID",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Join Date",
      "Total Cars",
      "Rating",
      "Total Trips",
      "Total Earnings (Ksh)",
      "Verified",
      "Pending Verification",
    ]
    const escapeCsv = (val) => {
      const s = val == null ? "" : String(val)
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
      return s
    }
    const csv = [headers.join(","), ...rows.map((r) => Object.values(r).map(escapeCsv).join(",")).join("\n")]
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")
    a.download = `flyts-hosts-${dateStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const verifyPending = async () => {
    const pending = filteredHosts.filter((h) => h.pendingVerification)
    if (pending.length === 0) return
    try {
      setIsVerifying(true)
      const results = await Promise.allSettled(
        pending.map((h) =>
          tryApi("PUT", `/admin/hosts/${h.id}`, { verified: true, pendingVerification: false, status: "active" })
        )
      )
      const succeededIds = new Set(
        results
          .map((r, idx) => (r.status === "fulfilled" ? pending[idx].id : null))
          .filter(Boolean)
      )
      if (succeededIds.size > 0) {
        setHosts((prev) =>
          prev.map((h) =>
            succeededIds.has(h.id)
              ? { ...h, verified: true, pendingVerification: false, status: h.status || "Active" }
              : h
          )
        )
      }
      const failed = results.filter((r) => r.status === "rejected").length
      if (failed > 0) alert(`${failed} host(s) failed to verify.`)
    } catch (e) {
      console.error(e)
      alert("Verification failed.")
    } finally {
      setIsVerifying(false)
    }
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
            <button className="btn-secondary" onClick={exportCsv}>Export Hosts</button>
            <button className="btn-primary" onClick={verifyPending} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Pending"}</button>
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
                <th>Host ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Cars</th>
                <th>Performance</th>
                <th>Earnings (Ksh)</th>
                <th>Verification Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHosts.map((host) => (
                <tr key={host.id}>
                  <td>
                    <div className="host-id" title={host.id}>{(host.id || "").slice(0, 4)}…</div>
                  </td>
                  <td>
                    <div className="host-info">
                      <div className="host-name">
                        {host.name}
                        {host.verified && <span className="verified-badge">✓</span>}
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
                    <div className="cars-info">{host.totalCars} cars</div>
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
                    <div className="earnings">Ksh {Number(host.totalEarnings).toLocaleString()}</div>
                  </td>
                  <td>
                    <span className={`status ${host.verification_status.toLowerCase()}`}>{host.verification_status}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleHostAction("view", host.id)}>
                        <Eye size={16} />
                      </button>
                      
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

        <Modal
          isOpen={isViewOpen && !!selectedHost}
          onClose={() => {
            setIsViewOpen(false)
            setSelectedHost(null)
          }}
          title="Host Details"
          footer={<button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedHost(null) }}>Close</button>}
        >
          {selectedHost && (
            <div className="modal-body">
              <img
                src={normalizeProfilePicture(selectedHost.avatar) || "/placeholder.svg"}
                onError={handleImgError}
                alt="host profile"
                className="modal-avatar"
              />
              <div>
                <div><strong>Host ID:</strong> {selectedHost.id}</div>
                <div><strong>Name:</strong> {selectedHost.name}</div>
                <div><strong>Email:</strong> {selectedHost.email || "-"}</div>
                <div><strong>Phone:</strong> {selectedHost.phone || "-"}</div>
                <div><strong>Status:</strong> {selectedHost.status}</div>
                <div><strong>Total Cars:</strong> {selectedHost.totalCars}</div>
                <div><strong>Trips:</strong> {selectedHost.totalTrips}</div>
                <div><strong>Earnings (Ksh):</strong> {Number(selectedHost.totalEarnings).toLocaleString()}</div>
                <div><strong>Verification Status:</strong> {selectedHost.verification_status}</div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default AdminHosts

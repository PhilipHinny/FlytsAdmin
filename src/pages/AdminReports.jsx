"use client"

import { useState, useEffect } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminReports.css"
import Modal from "../components/Modal"

const AdminReports = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [reports, setReports] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const tryApi = async (method, path, body) => {
    const doReq = async (suffix) => {
      const res = await fetch(`${apiBaseUrl}${suffix}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) throw new Error(`${method} ${suffix} failed: ${res.status}`)
      return res.json?.() ?? null
    }
      return await doReq(`/api${path}`)
  }

  useEffect(() => {
    const controller = new AbortController()
    const fetchReports = async () => {
      try {
        const tryFetch = async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          return res.json()
        }
        const data = await tryFetch(`/api/admin/reports`)
        const list = Array.isArray(data?.reports) ? data.reports : Array.isArray(data) ? data : []
        const normalized = list.map((r) => ({
          id: r.id,
          type: r.type || "",
          reportedBy: r.reportedBy || "",
          reportedAgainst: r.reportedAgainst || "",
          bookingId: r.bookingId || "",
          description: r.description || "",
          status: r.status || "Open",
          priority: r.priority || "Low",
          date: r.date || "",
          category: r.category || "",
        }))
        setReports(normalized)
      } catch (e) {
        if (e.name !== "AbortError") console.error("Error fetching reports:", e)
      }
    }
    fetchReports()
    return () => controller.abort()
  }, [])

  const filteredReports = reports.filter((report) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      (report.id || "").toLowerCase().includes(term) ||
      (report.reportedBy || "").toLowerCase().includes(term) ||
      (report.reportedAgainst || "").toLowerCase().includes(term) ||
      (report.description || "").toLowerCase().includes(term) ||
      (report.bookingId || "").toLowerCase().includes(term)
    const matchesFilter = filterStatus === "all" || (report.status || "").toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const handleReportAction = (action, reportId) => {
    const rep = reports.find((r) => r.id === reportId)
    if (!rep) return
    if (action === "view") {
      setSelectedReport(rep)
      setIsViewOpen(true)
      return
    }
  }

  const exportCsv = () => {
    const rows = filteredReports.map((r) => ({
      id: r.id,
      type: r.type,
      reportedBy: r.reportedBy,
      reportedAgainst: r.reportedAgainst,
      bookingId: r.bookingId,
      description: r.description,
      status: r.status,
      priority: r.priority,
      category: r.category,
      date: r.date,
    }))
    const headers = ["Report ID","Type","Reported By","Against","Booking ID","Description","Status","Priority","Category","Date"]
    const escapeCsv = (val) => {
      const s = val == null ? "" : String(val)
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
      return s
    }
    const csv = [headers.join(","), ...rows.map((r) => Object.values(r).map(escapeCsv).join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")
    a.download = `flyts-reports-${dateStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCreate = async (payload) => {
    try {
      setIsBusy(true)
      const created = await tryApi("POST", `/admin/reports`, payload)
      const newItem = {
        id: payload.id || created?.id || crypto.randomUUID(),
        type: payload.type || "User Behavior",
        reportedBy: payload.reportedBy || "Unknown",
        reportedAgainst: payload.reportedAgainst || "Unknown",
        bookingId: payload.bookingId || "",
        description: payload.description || "",
        status: payload.status || "Open",
        priority: payload.priority || "Low",
        category: payload.category || "",
        date: new Date().toISOString().slice(0, 10),
      }
        
      setReports((prev) => [newItem, ...prev])
      setIsCreateOpen(false)
    } catch (e) {
      console.error(e)
      alert("Failed to create report.")
    } finally {
      setIsBusy(false)
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
            <button className="btn-secondary" onClick={exportCsv}>Export Reports</button>
            <button className="btn-primary" onClick={() => setIsCreateOpen(true)}>Create Report</button>
          </div>
        </div>

        <div className="reports-stats-container">
          <div className="report-stat-card urgent">
            <div className="stat-content">
              <h3>{reports.filter((r) => (r.status || "").toLowerCase() === "urgent").length}</h3>
              <p>Urgent Reports</p>
            </div>
          </div>
          <div className="report-stat-card open">
            <div className="stat-content">
              <h3>{reports.filter((r) => (r.status || "").toLowerCase() === "open").length}</h3>
              <p>Open Reports</p>
            </div>
          </div>
          <div className="report-stat-card review">
            <div className="stat-content">
              <h3>{reports.filter((r) => (r.status || "").toLowerCase() === "under review").length}</h3>
              <p>Under Review</p>
            </div>
          </div>
          <div className="report-stat-card resolved">
            <div className="stat-content">
              <h3>{reports.filter((r) => (r.status || "").toLowerCase() === "resolved").length}</h3>
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
                      <div title={report.id}>{(report.id || "").slice(0, 4)}…</div>
                      <div className="booking-ref">Booking: {report.bookingId}</div>
                    </div>
                  </td>
                  <td>
                    <div className="report-type">
                      <span>{report.type}</span>
                    </div>
                  </td>
                  <td>{report.reportedBy}</td>
                  <td>{report.reportedAgainst}</td>
                  <td>
                    <div className="description">
                      {(report.description || "").length > 50
                        ? `${(report.description || "").substring(0, 50)}...`
                        : report.description}
                    </div>
                  </td>
                  <td>
                    <span className={`priority ${(report.priority || "").toLowerCase()}`}>{report.priority}</span>
                  </td>
                  <td>
                    <span className={`status ${(report.status || "").toLowerCase().replace(" ", "-")}`}>{report.status}</span>
                  </td>
                  <td>{report.date}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleReportAction("view", report.id)}>
                        <Eye size={16} />
                      </button>
                      <button disabled={isBusy}>
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
          isOpen={isViewOpen && !!selectedReport}
          onClose={() => { setIsViewOpen(false); setSelectedReport(null) }}
          title="Report Details"
          footer={<button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedReport(null) }}>Close</button>}
        >
          {selectedReport && (
            <div className="modal-body">
              <div>
                <div><strong>Report ID:</strong> {selectedReport.id}</div>
                <div><strong>Type:</strong> {selectedReport.type}</div>
                <div><strong>By:</strong> {selectedReport.reportedBy}</div>
                <div><strong>Against:</strong> {selectedReport.reportedAgainst}</div>
                <div><strong>Booking:</strong> {selectedReport.bookingId}</div>
                <div><strong>Status:</strong> {selectedReport.status}</div>
                <div><strong>Priority:</strong> {selectedReport.priority}</div>
                <div><strong>Category:</strong> {selectedReport.category}</div>
                <div><strong>Date:</strong> {selectedReport.date}</div>
                <div><strong>Description:</strong> {selectedReport.description}</div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isCreateOpen}
          onClose={() => { if (!isBusy) setIsCreateOpen(false) }}
          title="Create Report"
          footer={null}
        >
          <CreateReportForm onCancel={() => setIsCreateOpen(false)} onSubmit={handleCreate} isSubmitting={isBusy} />
        </Modal>
      </div>
    </div>
  )
}

const CreateReportForm = ({ onCancel, onSubmit, isSubmitting }) => {
  const [form, setForm] = useState({
    type: "User Behavior",
    reportedBy: "",
    reportedAgainst: "",
    bookingId: "",
    description: "",
    status: "Open",
    priority: "Low",
    category: "",
  })

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={submit} className="modal-form">
      <label>
        <span>Type</span>
        <select value={form.type} onChange={(e) => update("type", e.target.value)}>
          <option>Damage Report</option>
          <option>User Behavior</option>
          <option>Payment Issue</option>
          <option>Safety Concern</option>
        </select>
      </label>
      <label>
        <span>Reported By</span>
        <input type="text" value={form.reportedBy} onChange={(e) => update("reportedBy", e.target.value)} />
      </label>
      <label>
        <span>Against</span>
        <input type="text" value={form.reportedAgainst} onChange={(e) => update("reportedAgainst", e.target.value)} />
      </label>
      <label>
        <span>Booking ID</span>
        <input type="text" value={form.bookingId} onChange={(e) => update("bookingId", e.target.value)} />
      </label>
      <label>
        <span>Description</span>
        <input type="text" value={form.description} onChange={(e) => update("description", e.target.value)} />
      </label>
      <label>
        <span>Status</span>
        <select value={form.status} onChange={(e) => update("status", e.target.value)}>
          <option>Open</option>
          <option>Under Review</option>
          <option>Resolved</option>
          <option>Urgent</option>
        </select>
      </label>
      <label>
        <span>Priority</span>
        <select value={form.priority} onChange={(e) => update("priority", e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </label>
      <label>
        <span>Category</span>
        <input type="text" value={form.category} onChange={(e) => update("category", e.target.value)} />
      </label>
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</button>
      </div>
    </form>
  )
}

export default AdminReports

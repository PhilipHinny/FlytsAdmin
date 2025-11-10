"use client"

import { useState, useEffect } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminBookings.css"
import Modal from "../components/Modal"

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
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
    const fetchBookings = async () => {
      try {
        const tryFetch = async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          return res.json()
        }
        const data = await tryFetch("/api/admin/bookings")
        const normalized = Array.isArray(data)
          ? data.map((b) => ({
              id: b.id,
              renterName: b.renterName || "Unknown",
              hostName: b.hostName || "Unknown",
              carName: b.carName || "N/A",
              startDate: b.startDate || "",
              endDate: b.endDate || "",
              status: b.status || "",
              totalAmount: (b.totalAmount ?? b.total_price ?? 0) || 0,
              location: b.location || "N/A",
              duration: b.duration || "",
              bookingDate: b.bookingDate || "",
            }))
          : []
        setBookings(normalized)
      } catch (e) {
        if (e.name !== "AbortError") console.error("Error fetching bookings:", e)
      }
    }
    fetchBookings()
    return () => controller.abort()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      (booking.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.renterName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.hostName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.carName || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || (booking.status || "").toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleBookingAction = (action, bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return
    if (action === "view") {
      setSelectedBooking(booking)
      setIsViewOpen(true)
      return
    }
    if (action === "edit") {
      setSelectedBooking(booking)
      setIsEditOpen(true)
      return
    }
  }

  const exportCsv = () => {
    const rows = filteredBookings.map((b) => ({
      id: b.id,
      renterName: b.renterName,
      hostName: b.hostName,
      carName: b.carName,
      startDate: b.startDate,
      endDate: b.endDate,
      duration: b.duration,
      location: b.location,
      status: b.status,
      totalAmount: b.totalAmount,
      bookingDate: b.bookingDate,
    }))
    const headers = [
      "Booking ID","Renter","Host","Car","Start Date","End Date","Duration","Location","Status","Total Amount","Booking Date"
    ]
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
    a.download = `flyts-bookings-${dateStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportReport = () => {
    const counts = filteredBookings.reduce((acc, b) => {
      const k = (b.status || "unknown").toLowerCase()
      acc[k] = (acc[k] || 0) + 1
      return acc
    }, {})
    const rows = Object.entries(counts).map(([status, count]) => ({ status, count }))
    const headers = ["Status","Count"]
    const csv = [headers.join(","), ...rows.map((r) => `${r.status},${r.count}`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")
    a.download = `flyts-bookings-report-${dateStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEditSave = async (updates) => {
    if (!selectedBooking) return
    try {
      setIsBusy(true)
      await tryApi("PUT", `/admin/bookings/${selectedBooking.id}`, updates)
      setBookings((prev) => prev.map((b) => (b.id === selectedBooking.id ? { ...b, ...updates } : b)))
      setIsEditOpen(false)
      setSelectedBooking(null)
    } catch (e) {
      console.error(e)
      alert("Failed to save booking changes.")
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="admin-bookings">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Bookings Management</h1>
            <p>Manage all bookings and rental transactions</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={exportCsv}>Export Bookings</button>
            <button className="btn-primary" onClick={exportReport}>Generate Report</button>
          </div>
        </div>

        <div className="bookings-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search bookings by ID, renter, host, or car..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="denied">Denied</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Booking Date</th>
                <th>Participants</th>
                <th>Car</th>
                <th>Dates</th>
                <th>Location</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="booking-id" title={booking.id}>#{(booking.id || "").slice(0, 8)}…</div>
                  </td>
                  <td>
                    <div className="booking-date">{booking.bookingDate}</div>
                  </td>
                  <td>
                    <div className="participants">
                      <div className="renter">
                        <strong>Renter:</strong> {booking.renterName}
                      </div>
                      <div className="host">
                        <strong>Host:</strong> {booking.hostName}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="car-info">{booking.carName}</div>
                  </td>
                  <td>
                    <div className="dates">
                      <div className="date-range">
                        {booking.startDate} to {booking.endDate}
                      </div>
                      <div className="duration">{booking.duration}</div>
                    </div>
                  </td>
                  <td>
                    <div className="location">
                      {booking.location}
                    </div>
                  </td>
                  <td>
                    <div className="amount">{Number(booking.totalAmount).toLocaleString()}</div>
                  </td>
                  <td>
                    <span className={`status ${String(booking.status || "").toLowerCase()}`}>{booking.status}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button disabled={isBusy} onClick={() => handleBookingAction("view", booking.id)}>
                        <Eye size={16} />
                      </button>
                      <button disabled={isBusy} onClick={() => handleBookingAction("edit", booking.id)}>
                        <Edit size={16} />
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
          isOpen={isViewOpen && !!selectedBooking}
          onClose={() => { setIsViewOpen(false); setSelectedBooking(null) }}
          title="Booking Details"
          footer={<button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedBooking(null) }}>Close</button>}
        >
          {selectedBooking && (
            <div className="modal-body">
              <div>
                <div><strong>Booking ID:</strong> {selectedBooking.id}</div>
                <div><strong>Renter:</strong> {selectedBooking.renterName}</div>
                <div><strong>Host:</strong> {selectedBooking.hostName}</div>
                <div><strong>Car:</strong> {selectedBooking.carName}</div>
                <div><strong>Dates:</strong> {selectedBooking.startDate} to {selectedBooking.endDate} ({selectedBooking.duration})</div>
                <div><strong>Location:</strong> {selectedBooking.location}</div>
                <div><strong>Amount:</strong> ${Number(selectedBooking.totalAmount).toLocaleString()}</div>
                <div><strong>Status:</strong> {selectedBooking.status}</div>
                <div><strong>Booked:</strong> {selectedBooking.bookingDate}</div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isEditOpen && !!selectedBooking}
          onClose={() => { if (!isBusy) { setIsEditOpen(false); setSelectedBooking(null) } }}
          title="Edit Booking"
          footer={null}
        >
          {selectedBooking && (
            <EditBookingModal
              booking={selectedBooking}
              onCancel={() => { setIsEditOpen(false); setSelectedBooking(null) }}
              onSave={handleEditSave}
              isSaving={isBusy}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}

const EditBookingModal = ({ booking, onCancel, onSave, isSaving }) => {
  const [status, setStatus] = useState(String(booking.status || "").toLowerCase())

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ status })
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <label>
        <span>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="denied">Denied</option>
        </select>
      </label>
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  )
}

export default AdminBookings

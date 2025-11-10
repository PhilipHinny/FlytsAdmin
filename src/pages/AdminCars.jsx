"use client"

import { useState, useEffect } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminCars.css"
import Modal from "../components/Modal"
import { normalizeCarPhoto } from "../lib/utils"

const AdminCars = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [cars, setCars] = useState([])
  const [selectedCar, setSelectedCar] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

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
    const fetchCars = async () => {
      try {
        const tryFetch = async (path) => {
          const res = await fetch(`${apiBaseUrl}${path}`, { signal: controller.signal })
          if (!res.ok) throw new Error(`Failed: ${res.status}`)
          return res.json()
        }
        const data = await tryFetch("/api/admin/cars")
        const normalized = Array.isArray(data)
          ? data.map((c) => ({
              id: c.id,
              make: c.make,
              model: c.model,
              year: c.year,
              licensePlate: c.licensePlate,
              user: c.user || "Unknown",
              user_id: c.user_id || null,
              available: typeof c.available === "boolean" ? (c.available ? "available" : "unavailable") : String(c.available || c.status || ""),
              dailyRate: c.dailyRate ?? 0,
              totalTrips: c.totalTrips ?? 0,
              totalEarnings: c.totalEarnings ?? 0,
              image: c.image || "/placeholder.svg",
              approval_status: String(c.approval_status || "pending"),
              pendingVerification: Boolean(c.pendingVerification),
              city: c.city || "",
            }))
          : []
        setCars(normalized)
      } catch (e) {
        if (e.name !== "AbortError") console.error("Error fetching cars:", e)
      }
    }
    fetchCars()
    return () => controller.abort()
  }, [])

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      (car.make || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.model || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.licensePlate || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (car.user || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || String(car.available || "").toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCarAction = (action, carId) => {
    const car = cars.find((c) => c.id === carId)
    if (!car) return
    if (action === "view") {
      setSelectedCar(car)
      setIsViewOpen(true)
      return
    }
    if (action === "edit") {
        setSelectedCar(car)
        setIsEditOpen(true)
      return
    }
    console.log(`${action} car ${carId}`)
  }

    const handleEditSave = async (updates) => {
    if (!selectedCar) return
    try {
      setIsSaving(true)
      const updatedCar = await tryApi("PATCH", `/admin/cars/${selectedCar.id}`, updates)
      setCars((prev) =>
        prev.map((c) => (c.id === selectedCar.id ? { ...c, ...updatedCar, ...updates } : c))
      )
      setIsEditOpen(false)
      setSelectedCar(null)
    } catch (e) {
      console.error(e)
      alert("Failed to save changes.")
    } finally {
      setIsSaving(false)
    }
  }

  const exportCsv = () => {
    const rows = filteredCars.map((c) => ({
      id: c.id,
      make: c.make,
      model: c.model,
      year: c.year,
      licensePlate: c.licensePlate,
      user: c.user,
      available: c.available,
      dailyRate: c.dailyRate,
      totalTrips: c.totalTrips,
      totalEarnings: c.totalEarnings,
      approval_status: c.approval_status,
      pendingVerification: c.pendingVerification ? "true" : "false",
      city: c.city || "",
    }))
    const headers = [
      "Car ID","Make","Model","Year","License Plate","User","Availability","Daily Rate","Total Trips","Total Earnings","Approval Status","City"
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
    a.download = `flyts-cars-${dateStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const verifyPending = async () => {
    const pending = filteredCars.filter((c) => c.pendingVerification)
    if (pending.length === 0) return
    try {
      setIsVerifying(true)
      const results = await Promise.allSettled(
        pending.map((c) => tryApi("PATCH", `/admin/cars/${c.id}`, { verified: true, pendingVerification: false, status: "active" }))
      )
      const succeeded = new Set(results.map((r, i) => (r.status === "fulfilled" ? pending[i].id : null)).filter(Boolean))
      if (succeeded.size > 0) {
        setCars((prev) => prev.map((c) => (succeeded.has(c.id) ? { ...c, verified: true, pendingVerification: false, status: c.status || "Active" } : c)))
      }
      const failed = results.filter((r) => r.status === "rejected").length
      if (failed > 0) alert(`${failed} car(s) failed to verify.`)
    } catch (e) {
      console.error(e)
      alert("Verification failed.")
    } finally {
      setIsVerifying(false)
    }
  }
  

  return (
    <div className="admin-cars">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Cars Management</h1>
            <p>Manage all car listings and verification status</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={exportCsv}>Export Cars</button>
            {/* <button className="btn-primary" onClick={verifyPending} disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify Pending"}</button> */}
          </div>
        </div>

        <div className="cars-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search cars by make, model, or license plate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="cars-table">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Licence</th>
                <th>Host</th>
                <th>Status</th>
                <th>Availability</th>
                <th>Location</th>
                <th>Rate (Ksh)</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div className="car-info">
                      <div className="car-name">
                        {car.year} {car.make} {car.model}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="license-plate">{car.licensePlate}</div>
                  </td>
                  <td>
                    <div className="host-info">
                      <div>{car.user}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${String(car.approval_status || "").toLowerCase()}`}>{car.approval_status}</span>
                  </td>
                  <td>
                    <span className={`available ${String(car.available || "").toLowerCase()}`}>{car.available}</span>
                  </td>
                  <td>
                    <div className="location">{car.city}</div>
                  </td>
                  <td>
                    <div className="rate">Ksh {car.dailyRate}/day</div>
                  </td>
                  <td>
                    <div className="performance-info">
                      <div>{car.totalTrips} trips</div>
                      <div className="earnings">Ksh {car.totalEarnings}</div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleCarAction("view", car.id)}>
                        <Eye size={16} />
                      </button>
                    
                      <button onClick={() => handleCarAction("edit", car.id)}>
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
          isOpen={isViewOpen && !!selectedCar}
          onClose={() => { setIsViewOpen(false); setSelectedCar(null) }}
          title="Car Details"
          footer={<button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedCar(null) }}>Close</button>}
        >
          {selectedCar && (
            <div className="modal-body">
              <img src={normalizeCarPhoto(selectedCar.image)} alt="car" className="modal-avatar" />
              <div>
                <div><strong>Car ID:</strong> {selectedCar.id}</div>
                <div><strong>Make:</strong> {selectedCar.make}</div>
                <div><strong>Model:</strong> {selectedCar.model}</div>
                <div><strong>Year:</strong> {selectedCar.year}</div>
                <div><strong>License Plate:</strong> {selectedCar.licensePlate}</div>
                <div><strong>Host:</strong> {selectedCar.user}</div>
                <div><strong>Status:</strong> {selectedCar.approval_status}</div>
                <div><strong>Availability:</strong> {selectedCar.available}</div>
                <div><strong>Daily Rate:</strong> Ksh {selectedCar.dailyRate}/day</div>
                <div><strong>Trips:</strong> {selectedCar.totalTrips}</div>
                <div><strong>Total Earnings:</strong> Ksh {selectedCar.totalEarnings}</div>
                <div><strong>Location:</strong> {selectedCar.city}</div>
              </div>
            </div>
          )}
        </Modal>
        {isEditOpen && selectedCar && (
          <Modal
            isOpen={isEditOpen}
            onClose={() => { setIsEditOpen(false); setSelectedCar(null) }}
            title="Edit Car"
            footer={null}
          >
            <EditCarModal
              car={selectedCar}
              onCancel={() => { setIsEditOpen(false); setSelectedCar(null) }}
              onSave={handleEditSave}
              isSaving={isSaving}
            />
          </Modal>
        )}
        
      </div>
    </div>
  )
}

const EditCarModal = ({ car, onCancel, onSave, isSaving }) => {
  const [approvalStatus, setApprovalStatus] = useState(car.approval_status)
  const [available, setAvailable] = useState(car.available)
  const [dailyRate, setDailyRate] = useState(car.dailyRate)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ approval_status: approvalStatus, available, dailyRate })
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <label>
        Status
        <select value={approvalStatus} onChange={(e) => setApprovalStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </label>

      <label>
        Availability
        <select value={available} onChange={(e) => setAvailable(e.target.value)}>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </label>

      <label>
        Daily Rate
        <input type="number" value={dailyRate} onChange={(e) => setDailyRate(Number(e.target.value))} />
      </label>

      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  )
}

export default AdminCars

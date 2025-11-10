"use client"

import { useState, useEffect } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Download, CreditCard, RefreshCw } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminPayments.css"
import Modal from "../components/Modal"

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [payments, setPayments] = useState([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [commissions, setCommissions] = useState([])
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const coerceDate = (d) => {
    if (!d) return ""
    if (typeof d === "string") return d
    if (typeof d === "object" && d.$date) {
      try {
        return new Date(d.$date).toISOString().slice(0, 10)
      } catch (_) {
        return ""
      }
    }
    return ""
  }

  const fetchPayments = async (signal) => {
    const tryFetch = async (path) => {
      const res = await fetch(`${apiBaseUrl}${path}`, { signal })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      return res.json()
    }
    const data = await tryFetch(`/api/admin/payments`)
    const list = Array.isArray(data?.payments) ? data.payments : Array.isArray(data) ? data : []
    const normalized = list.map((p) => ({
      id: typeof p.id === "string" ? p.id : String(p.id || ""),
      bookingId: p.bookingId || "",
      type: p.type || "",
      amount: Number(p.amount ?? 0),
      status: p.status || "",
      method: p.method || "Unknown",
      date: coerceDate(p.date),
      renterName: p.renterName || "Unknown",
      hostName: p.hostName || "Unknown",
      platformFee: Number(p.platformFee ?? 0),
      hostEarning: Number(p.hostEarning ?? 0),
      reference: p.reference || "",
      description: p.description || "",
    }))
    setPayments(normalized)
  }

  const fetchCommissions = async (signal) => {
    const tryFetch = async (path) => {
      const res = await fetch(`${apiBaseUrl}${path}`, { signal })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      return res.json()
    }
    try {
      const data = await tryFetch(`/api/admin/commissions`)
      const list = Array.isArray(data?.commissions) ? data.commissions : Array.isArray(data) ? data : []
      const normalized = list.map((c) => ({
        id: String(c.id || ""),
        bookingId: c.bookingId || "",
        amount: Number(c.amount ?? 0),
        rate: Number(c.rate ?? 0),
        currency: c.currency || "USD",
        status: c.status || "",
        createdAt: coerceDate(c.createdAt),
        reference: c.reference || "",
        description: c.description || "",
        renterName: c.renterName || null,
        hostName: c.hostName || null,
      }))
      setCommissions(normalized)
    } catch (e) {
      // ignore; endpoint might be unavailable; we'll fall back to payment-derived fees
      setCommissions([])
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    Promise.all([
      fetchPayments(controller.signal).catch((e) => { if (e.name !== "AbortError") console.error("Error fetching payments:", e) }),
      fetchCommissions(controller.signal).catch(() => {}),
    ])
    return () => controller.abort()
  }, [])

  const filteredPayments = payments.filter((payment) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      (payment.id || "").toLowerCase().includes(term) ||
      (payment.bookingId || "").toLowerCase().includes(term) ||
      (payment.renterName || "").toLowerCase().includes(term) ||
      (payment.hostName || "").toLowerCase().includes(term) ||
      (payment.reference || "").toLowerCase().includes(term)
    const matchesFilter = filterStatus === "all" || (payment.status || "").toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handlePaymentAction = (action, paymentId) => {
    const payment = payments.find((p) => p.id === paymentId)
    if (!payment) return
    if (action === "view") {
      setSelectedPayment(payment)
      setIsViewOpen(true)
      return
    }
    if (action === "download") {
      downloadReceipt(payment)
      return
    }
  }

  const totalRevenue = payments.reduce((sum, payment) => sum + Math.abs(Number(payment.amount || 0)), 0)
  const totalFeesFromPayments = payments.reduce((sum, payment) => sum + Math.abs(Number(payment.platformFee || 0)), 0)
  const totalFeesFromCommissions = commissions.reduce((sum, c) => sum + Math.abs(Number(c.amount || 0)), 0)
  const totalFees = commissions.length ? totalFeesFromCommissions : totalFeesFromPayments

  const exportCsv = () => {
    const rows = filteredPayments.map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      type: p.type,
      amount: p.amount,
      status: p.status,
      method: p.method,
      date: p.date,
      renterName: p.renterName,
      hostName: p.hostName,
      platformFee: p.platformFee,
      hostEarning: p.hostEarning,
      reference: p.reference,
      description: p.description,
    }))
    const headers = [
      "Payment ID","Booking ID","Type","Amount","Status","Method","Date","Renter","Host","Platform Fee","Host Earning","Reference","Description"
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
    a.download = `flyts-payments-${dateStr}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadReceipt = (p) => {
    try {
      setIsBusy(true)
      const lines = [
        `Payment Receipt`,
        `----------------`,
        `Payment ID: ${p.id}`,
        `Booking ID: ${p.bookingId}`,
        `Type: ${p.type}`,
        `Status: ${p.status}`,
        `Method: ${p.method}`,
        `Date: ${p.date}`,
        `From (Renter): ${p.renterName}`,
        `To (Host): ${p.hostName}`,
        `Amount: Ksh ${Math.abs(Number(p.amount)).toLocaleString()}`,
        `Platform Fee: Ksh ${Math.abs(Number(p.platformFee)).toLocaleString()}`,
        `Host Earning: Ksh ${Math.abs(Number(p.hostEarning)).toLocaleString()}`,
        p.reference ? `Reference: ${p.reference}` : null,
        p.description ? `Description: ${p.description}` : null,
      ].filter(Boolean)
      const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `receipt-${p.id}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setIsBusy(false)
    }
  }

  const syncPayments = async () => {
    try {
      setIsSyncing(true)
      await fetchPayments()
      await fetchCommissions()
    } catch (e) {
      console.error(e)
      alert("Failed to sync payments.")
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="admin-payments">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Payments Management</h1>
            <p>Manage all payments, refunds, and payouts</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={exportCsv}>
              <Download size={20} />
              Export
            </button>
            <button className="btn-primary" onClick={syncPayments} disabled={isSyncing}>
              <RefreshCw size={20} />
              {isSyncing ? "Syncing..." : "Sync Payments"}
            </button>
          </div>
        </div>

        <div className="payment-stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <h3>Ksh {totalRevenue.toLocaleString()}</h3>
              <p>Total Volume</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon fees">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <h3>Ksh {totalFees.toLocaleString()}</h3>
              <p>Platform Fees</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <RefreshCw size={24} />
            </div>
            <div className="stat-content">
              <h3>{payments.filter((p) => (p.status || "").toLowerCase() === "pending").length}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        <div className="payments-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search payments by ID, booking, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        <div className="payments-table">
          <table>
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Type</th>
                <th>Participants</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, idx) => (
                <tr key={`${payment.id || "row"}-${idx}`}>
                  <td>
                    <div className="payment-id">
                      <div title={payment.id}>{(payment.id || "").slice(0, 4)}…</div>
                      <div className="booking-ref">Booking: {payment.bookingId}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`payment-type ${(payment.type || "").toLowerCase().replace(/\s+/g, "-")}`}>
                      {payment.type}
                    </span>
                  </td>
                  <td>
                    <div className="participants">
                      <div className="renter">
                        <strong>From:</strong> {payment.renterName}
                      </div>
                      <div className="host">
                        <strong>To:</strong> {payment.hostName}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="amount-breakdown">
                      <div className={`total-amount ${Number(payment.amount) < 0 ? "negative" : "positive"}`}>
                        Ksh {Math.abs(Number(payment.amount)).toLocaleString()}
                      </div>
                      <div className="fee">Fee: Ksh {Math.abs(Number(payment.platformFee)).toLocaleString()}</div>
                    </div>
                  </td>
                  <td>
                    <div className="payment-method">
                      <CreditCard size={16} />
                      {payment.method}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${(payment.status || "").toLowerCase()}`}>{payment.status}</span>
                  </td>
                  <td>{payment.date}</td>
                  <td>
                    <div className="actions">
                      <button disabled={isBusy} onClick={() => handlePaymentAction("view", payment.id)}>
                        <Eye size={16} />
                      </button>
                      <button disabled={isBusy} onClick={() => handlePaymentAction("download", payment.id)}>
                        <Download size={16} />
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
          isOpen={isViewOpen && !!selectedPayment}
          onClose={() => { setIsViewOpen(false); setSelectedPayment(null) }}
          title="Payment Details"
          footer={<button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedPayment(null) }}>Close</button>}
        >
          {selectedPayment && (
            <div className="modal-body">
              <div>
                <div><strong>Payment ID:</strong> {selectedPayment.id}</div>
                <div><strong>Booking ID:</strong> {selectedPayment.bookingId || "-"}</div>
                <div><strong>Type:</strong> {selectedPayment.type}</div>
                <div><strong>Status:</strong> {selectedPayment.status}</div>
                <div><strong>Method:</strong> {selectedPayment.method}</div>
                <div><strong>Date:</strong> {selectedPayment.date}</div>
                <div><strong>From (Renter):</strong> {selectedPayment.renterName}</div>
                <div><strong>To (Host):</strong> {selectedPayment.hostName}</div>
                <div><strong>Amount:</strong> Ksh {Math.abs(Number(selectedPayment.amount)).toLocaleString()}</div>
                <div><strong>Platform Fee:</strong> Ksh {Math.abs(Number(selectedPayment.platformFee)).toLocaleString()}</div>
                <div><strong>Host Earning:</strong> Ksh {Math.abs(Number(selectedPayment.hostEarning)).toLocaleString()}</div>
                {selectedPayment.reference && <div><strong>Reference:</strong> {selectedPayment.reference}</div>}
                {selectedPayment.description && <div><strong>Description:</strong> {selectedPayment.description}</div>}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default AdminPayments

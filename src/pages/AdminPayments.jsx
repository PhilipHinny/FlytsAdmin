"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Download, CreditCard, RefreshCw } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminPayments.css"

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [payments, setPayments] = useState([
    {
      id: "PAY123456",
      bookingId: "FL123456",
      type: "Booking Payment",
      amount: 255,
      status: "Completed",
      method: "Credit Card",
      date: "2024-01-25",
      renterName: "John Doe",
      hostName: "Sarah Wilson",
      platformFee: 25.5,
      hostEarning: 229.5,
    },
    {
      id: "PAY123457",
      bookingId: "FL123457",
      type: "Refund",
      amount: -180,
      status: "Processing",
      method: "Credit Card",
      date: "2024-01-24",
      renterName: "Jane Smith",
      hostName: "David Brown",
      platformFee: -18,
      hostEarning: -162,
    },
    {
      id: "PAY123458",
      bookingId: "FL123458",
      type: "Host Payout",
      amount: 195,
      status: "Completed",
      method: "Bank Transfer",
      date: "2024-01-23",
      renterName: "Mike Johnson",
      hostName: "Lisa Garcia",
      platformFee: 19.5,
      hostEarning: 175.5,
    },
    {
      id: "PAY123459",
      bookingId: "FL123459",
      type: "Damage Fee",
      amount: 150,
      status: "Pending",
      method: "Credit Card",
      date: "2024-01-22",
      renterName: "Emily Davis",
      hostName: "Robert Kim",
      platformFee: 15,
      hostEarning: 135,
    },
  ])

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.renterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.hostName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || payment.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handlePaymentAction = (action, paymentId) => {
    console.log(`${action} payment ${paymentId}`)
  }

  const totalRevenue = payments.reduce((sum, payment) => sum + Math.abs(payment.amount), 0)
  const totalFees = payments.reduce((sum, payment) => sum + Math.abs(payment.platformFee), 0)

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
            <button className="btn-secondary">
              <Download size={20} />
              Export
            </button>
            <button className="btn-primary">
              <RefreshCw size={20} />
              Sync Payments
            </button>
          </div>
        </div>

        <div className="payment-stats">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <h3>${totalRevenue.toLocaleString()}</h3>
              <p>Total Volume</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon fees">
              <CreditCard size={24} />
            </div>
            <div className="stat-content">
              <h3>${totalFees.toLocaleString()}</h3>
              <p>Platform Fees</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">
              <RefreshCw size={24} />
            </div>
            <div className="stat-content">
              <h3>{payments.filter((p) => p.status === "Pending").length}</h3>
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <div className="payment-id">
                      <div>#{payment.id}</div>
                      <div className="booking-ref">Booking: {payment.bookingId}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`payment-type ${payment.type.toLowerCase().replace(" ", "-")}`}>
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
                      <div className={`total-amount ${payment.amount < 0 ? "negative" : "positive"}`}>
                        ${Math.abs(payment.amount)}
                      </div>
                      <div className="fee">Fee: ${Math.abs(payment.platformFee)}</div>
                    </div>
                  </td>
                  <td>
                    <div className="payment-method">
                      <CreditCard size={16} />
                      {payment.method}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${payment.status.toLowerCase()}`}>{payment.status}</span>
                  </td>
                  <td>{payment.date}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handlePaymentAction("view", payment.id)}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handlePaymentAction("download", payment.id)}>
                        <Download size={16} />
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

export default AdminPayments

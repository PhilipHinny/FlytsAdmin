"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, Calendar, MapPin } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminBookings.css"

const AdminBookings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [bookings, setBookings] = useState([
    {
      id: "FL123456",
      renterName: "John Doe",
      hostName: "Sarah Wilson",
      carName: "2020 BMW 3 Series",
      startDate: "2024-01-25",
      endDate: "2024-01-27",
      status: "Active",
      totalAmount: 255,
      location: "New York, NY",
      duration: "3 days",
      bookingDate: "2024-01-20",
    },
    {
      id: "FL123457",
      renterName: "Jane Smith",
      hostName: "David Brown",
      carName: "2021 Tesla Model 3",
      startDate: "2024-01-28",
      endDate: "2024-01-30",
      status: "Confirmed",
      totalAmount: 360,
      location: "Los Angeles, CA",
      duration: "3 days",
      bookingDate: "2024-01-22",
    },
    {
      id: "FL123458",
      renterName: "Mike Johnson",
      hostName: "Lisa Garcia",
      carName: "2019 Honda Civic",
      startDate: "2024-01-15",
      endDate: "2024-01-17",
      status: "Completed",
      totalAmount: 195,
      location: "Chicago, IL",
      duration: "3 days",
      bookingDate: "2024-01-10",
    },
    {
      id: "FL123459",
      renterName: "Emily Davis",
      hostName: "Robert Kim",
      carName: "2020 Audi A4",
      startDate: "2024-01-30",
      endDate: "2024-02-02",
      status: "Cancelled",
      totalAmount: 420,
      location: "Miami, FL",
      duration: "4 days",
      bookingDate: "2024-01-25",
    },
  ])

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.renterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.carName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || booking.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleBookingAction = (action, bookingId) => {
    console.log(`${action} booking ${bookingId}`)
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
            <button className="btn-secondary">Export Bookings</button>
            <button className="btn-primary">Generate Report</button>
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
                    <div className="booking-id">
                      <div>#{booking.id}</div>
                      <div className="booking-date">Booked: {booking.bookingDate}</div>
                    </div>
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
                        <Calendar size={14} />
                        {booking.startDate} to {booking.endDate}
                      </div>
                      <div className="duration">{booking.duration}</div>
                    </div>
                  </td>
                  <td>
                    <div className="location">
                      <MapPin size={14} />
                      {booking.location}
                    </div>
                  </td>
                  <td>
                    <div className="amount">${booking.totalAmount}</div>
                  </td>
                  <td>
                    <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleBookingAction("view", booking.id)}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleBookingAction("edit", booking.id)}>
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

export default AdminBookings

"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminCars.css"

const AdminCars = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [cars, setCars] = useState([
    {
      id: 1,
      make: "BMW",
      model: "3 Series",
      year: 2020,
      licensePlate: "ABC-123",
      hostName: "Sarah Wilson",
      status: "Active",
      dailyRate: 85,
      totalTrips: 45,
      totalEarnings: 3825,
      image: "/placeholder.svg?height=60&width=80",
      verified: true,
      pendingVerification: false,
      location: "New York, NY",
    },
    {
      id: 2,
      make: "Tesla",
      model: "Model 3",
      year: 2021,
      licensePlate: "XYZ-789",
      hostName: "David Brown",
      status: "Pending",
      dailyRate: 120,
      totalTrips: 0,
      totalEarnings: 0,
      image: "/placeholder.svg?height=60&width=80",
      verified: false,
      pendingVerification: true,
      location: "Los Angeles, CA",
    },
    {
      id: 3,
      make: "Honda",
      model: "Civic",
      year: 2019,
      licensePlate: "DEF-456",
      hostName: "Lisa Garcia",
      status: "Suspended",
      dailyRate: 65,
      totalTrips: 23,
      totalEarnings: 1495,
      image: "/placeholder.svg?height=60&width=80",
      verified: true,
      pendingVerification: false,
      location: "Chicago, IL",
    },
  ])

  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.hostName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || car.status.toLowerCase() === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCarAction = (action, carId) => {
    console.log(`${action} car ${carId}`)
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
            <button className="btn-secondary">Export Cars</button>
            <button className="btn-primary">Verify Pending</button>
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

        <div className="cars-table">
          <table>
            <thead>
              <tr>
                <th>Car</th>
                <th>Host</th>
                <th>Status</th>
                <th>Location</th>
                <th>Rate</th>
                <th>Performance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div className="car-info">
                      <img src={car.image || "/placeholder.svg"} alt={`${car.make} ${car.model}`} />
                      <div>
                        <div className="car-name">
                          {car.year} {car.make} {car.model}
                          {car.verified && <span className="verified-badge">✓</span>}
                        </div>
                        <div className="license-plate">{car.licensePlate}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="host-info">
                      <div>{car.hostName}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status ${car.status.toLowerCase()}`}>{car.status}</span>
                  </td>
                  <td>
                    <div className="location">{car.location}</div>
                  </td>
                  <td>
                    <div className="rate">${car.dailyRate}/day</div>
                  </td>
                  <td>
                    <div className="performance-info">
                      <div>{car.totalTrips} trips</div>
                      <div className="earnings">${car.totalEarnings}</div>
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleCarAction("view", car.id)}>
                        <Eye size={16} />
                      </button>
                      {car.pendingVerification && (
                        <>
                          <button className="approve-btn" onClick={() => handleCarAction("approve", car.id)}>
                            <CheckCircle size={16} />
                          </button>
                          <button className="reject-btn" onClick={() => handleCarAction("reject", car.id)}>
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
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
      </div>
    </div>
  )
}

export default AdminCars

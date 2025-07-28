"use client"

import { useState } from "react"
import React from "react"

import { BarChart3, TrendingUp, Users, Car, Calendar, DollarSign } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminAnalytics.css"

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState("30d")
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 245000,
      revenueGrowth: 12.5,
      totalBookings: 1250,
      bookingsGrowth: 8.3,
      activeUsers: 8450,
      usersGrowth: 15.2,
      activeCars: 2340,
      carsGrowth: 6.7,
    },
    chartData: {
      revenue: [
        { month: "Jan", amount: 18000 },
        { month: "Feb", amount: 22000 },
        { month: "Mar", amount: 19000 },
        { month: "Apr", amount: 25000 },
        { month: "May", amount: 28000 },
        { month: "Jun", amount: 32000 },
      ],
      bookings: [
        { month: "Jan", count: 180 },
        { month: "Feb", count: 220 },
        { month: "Mar", count: 190 },
        { month: "Apr", count: 250 },
        { month: "May", count: 280 },
        { month: "Jun", count: 320 },
      ],
    },
    topPerformers: {
      hosts: [
        { name: "Sarah Wilson", earnings: 12450, trips: 89, rating: 4.9 },
        { name: "David Brown", earnings: 10200, trips: 76, rating: 4.8 },
        { name: "Lisa Garcia", earnings: 8900, trips: 65, rating: 4.7 },
      ],
      cars: [
        { model: "BMW 3 Series", bookings: 45, revenue: 3825 },
        { model: "Tesla Model 3", bookings: 38, revenue: 4560 },
        { model: "Honda Civic", bookings: 42, revenue: 2730 },
      ],
      locations: [
        { city: "New York", bookings: 234, revenue: 28080 },
        { city: "Los Angeles", bookings: 198, revenue: 23760 },
        { city: "Chicago", bookings: 156, revenue: 18720 },
      ],
    },
  })

  return (
    <div className="admin-analytics">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive platform analytics and insights</p>
          </div>
          <div className="header-actions">
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-select">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <button className="btn-secondary">Export Report</button>
            <button className="btn-primary">Generate Insights</button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="analytics-overview">
          <div className="stat-card">
            <div className="stat-icon revenue">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>${analytics.overview.totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
              <span className={`stat-change ${analytics.overview.revenueGrowth > 0 ? "positive" : "negative"}`}>
                {analytics.overview.revenueGrowth > 0 ? "+" : ""}
                {analytics.overview.revenueGrowth}%
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bookings">
              <Calendar size={24} />
            </div>
            <div className="stat-content">
              <h3>{analytics.overview.totalBookings.toLocaleString()}</h3>
              <p>Total Bookings</p>
              <span className={`stat-change ${analytics.overview.bookingsGrowth > 0 ? "positive" : "negative"}`}>
                {analytics.overview.bookingsGrowth > 0 ? "+" : ""}
                {analytics.overview.bookingsGrowth}%
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{analytics.overview.activeUsers.toLocaleString()}</h3>
              <p>Active Users</p>
              <span className={`stat-change ${analytics.overview.usersGrowth > 0 ? "positive" : "negative"}`}>
                {analytics.overview.usersGrowth > 0 ? "+" : ""}
                {analytics.overview.usersGrowth}%
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon cars">
              <Car size={24} />
            </div>
            <div className="stat-content">
              <h3>{analytics.overview.activeCars.toLocaleString()}</h3>
              <p>Active Cars</p>
              <span className={`stat-change ${analytics.overview.carsGrowth > 0 ? "positive" : "negative"}`}>
                {analytics.overview.carsGrowth > 0 ? "+" : ""}
                {analytics.overview.carsGrowth}%
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Revenue Trends</h3>
              <div className="chart-controls">
                <button className="active">Monthly</button>
                <button>Weekly</button>
                <button>Daily</button>
              </div>
            </div>
            <div className="chart-placeholder">
              <BarChart3 size={48} />
              <p>Revenue chart visualization</p>
              <div className="chart-data">
                {analytics.chartData.revenue.map((item, index) => (
                  <div key={index} className="data-point">
                    <span className="month">{item.month}</span>
                    <span className="amount">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Booking Trends</h3>
              <div className="chart-controls">
                <button className="active">Monthly</button>
                <button>Weekly</button>
                <button>Daily</button>
              </div>
            </div>
            <div className="chart-placeholder">
              <TrendingUp size={48} />
              <p>Bookings trend visualization</p>
              <div className="chart-data">
                {analytics.chartData.bookings.map((item, index) => (
                  <div key={index} className="data-point">
                    <span className="month">{item.month}</span>
                    <span className="count">{item.count} bookings</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="performers-section">
          <div className="performers-card">
            <h3>Top Hosts</h3>
            <div className="performers-list">
              {analytics.topPerformers.hosts.map((host, index) => (
                <div key={index} className="performer-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="performer-info">
                    <div className="name">{host.name}</div>
                    <div className="stats">
                      ${host.earnings.toLocaleString()} • {host.trips} trips • ⭐ {host.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="performers-card">
            <h3>Top Cars</h3>
            <div className="performers-list">
              {analytics.topPerformers.cars.map((car, index) => (
                <div key={index} className="performer-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="performer-info">
                    <div className="name">{car.model}</div>
                    <div className="stats">
                      {car.bookings} bookings • ${car.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="performers-card">
            <h3>Top Locations</h3>
            <div className="performers-list">
              {analytics.topPerformers.locations.map((location, index) => (
                <div key={index} className="performer-item">
                  <div className="rank">#{index + 1}</div>
                  <div className="performer-info">
                    <div className="name">{location.city}</div>
                    <div className="stats">
                      {location.bookings} bookings • ${location.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics

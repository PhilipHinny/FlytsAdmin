"use client"

import { useState } from "react"
import React from "react"

import { Save, RefreshCw, Shield, Bell, Globe, CreditCard, Car } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminSettings.css"

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [settings, setSettings] = useState({
    general: {
      siteName: "FLIITS",
      siteDescription: "Premium car rental platform",
      contactEmail: "admin@fliits.com",
      supportPhone: "+1 (555) 123-4567",
      timezone: "America/New_York",
      language: "English",
      currency: "USD",
    },
    platform: {
      commissionRate: 15,
      minimumAge: 21,
      maximumBookingDays: 30,
      cancellationWindow: 24,
      autoApproveHosts: false,
      autoApproveCars: false,
      requireInsurance: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      bookingAlerts: true,
      paymentAlerts: true,
      systemAlerts: true,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: "",
    },
    payments: {
      stripeEnabled: true,
      paypalEnabled: true,
      bankTransferEnabled: false,
      minimumPayout: 50,
      payoutSchedule: "weekly",
      processingFee: 2.9,
    },
  })

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    console.log("Saving settings:", settings)
    // API call to save settings
  }

  const navItems = [
    { id: "general", icon: Globe, label: "General" },
    { id: "platform", icon: Car, label: "Platform" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "security", icon: Shield, label: "Security" },
    { id: "payments", icon: CreditCard, label: "Payments" },
  ]

  return (
    <div className="admin-settings">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Platform Settings</h1>
            <p>Configure platform settings and preferences</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary" onClick={() => window.location.reload()}>
              <RefreshCw size={20} />
              Reset
            </button>
            <button className="btn-primary" onClick={handleSaveSettings}>
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="settings-layout">
          <aside className="settings-nav">
            <h3>Settings</h3>
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.id} className="nav-item">
                  <button
                    className={`nav-link ${activeTab === item.id ? "active" : ""}`}
                    onClick={() => setActiveTab(item.id)}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <main className="settings-content">
            {activeTab === "general" && (
              <div className="form-section">
                <div className="section-header">
                  <h2>General Settings</h2>
                  <p>Basic information about your platform</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Site Name</label>
                    <input
                      className="form-input"
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Site Description</label>
                    <input
                      className="form-input"
                      type="text"
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      className="form-input"
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Support Phone</label>
                    <input
                      className="form-input"
                      type="tel"
                      value={settings.general.supportPhone}
                      onChange={(e) => handleSettingChange("general", "supportPhone", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      className="form-select"
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Default Currency</label>
                    <select
                      className="form-select"
                      value={settings.general.currency}
                      onChange={(e) => handleSettingChange("general", "currency", e.target.value)}
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "platform" && (
              <div className="form-section">
                <div className="section-header">
                  <h2>Platform Settings</h2>
                  <p>Core platform rules and defaults</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Commission Rate (%)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.platform.commissionRate}
                      onChange={(e) =>
                        handleSettingChange("platform", "commissionRate", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Minimum Age</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.platform.minimumAge}
                      onChange={(e) => handleSettingChange("platform", "minimumAge", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Maximum Booking Days</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.platform.maximumBookingDays}
                      onChange={(e) =>
                        handleSettingChange("platform", "maximumBookingDays", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Cancellation Window (hours)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.platform.cancellationWindow}
                      onChange={(e) =>
                        handleSettingChange("platform", "cancellationWindow", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.platform.autoApproveHosts}
                        onChange={(e) => handleSettingChange("platform", "autoApproveHosts", e.target.checked)}
                      />
                      {' '}Auto-approve Hosts
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.platform.autoApproveCars}
                        onChange={(e) => handleSettingChange("platform", "autoApproveCars", e.target.checked)}
                      />
                      {' '}Auto-approve Cars
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="form-section">
                <div className="section-header">
                  <h2>Notification Settings</h2>
                  <p>Choose how you want to be notified</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                      />
                      {' '}Email Notifications
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsNotifications}
                        onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                      />
                      {' '}SMS Notifications
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                      />
                      {' '}Push Notifications
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.bookingAlerts}
                        onChange={(e) => handleSettingChange("notifications", "bookingAlerts", e.target.checked)}
                      />
                      {' '}Booking Alerts
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.paymentAlerts}
                        onChange={(e) => handleSettingChange("notifications", "paymentAlerts", e.target.checked)}
                      />
                      {' '}Payment Alerts
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.notifications.systemAlerts}
                        onChange={(e) => handleSettingChange("notifications", "systemAlerts", e.target.checked)}
                      />
                      {' '}System Alerts
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="form-section">
                <div className="section-header">
                  <h2>Security Settings</h2>
                  <p>Protect accounts and access</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactorAuth}
                        onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                      />
                      {' '}Two-Factor Authentication
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Password Expiry (days)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) =>
                        handleSettingChange("security", "passwordExpiry", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Login Attempts</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.security.loginAttempts}
                      onChange={(e) =>
                        handleSettingChange("security", "loginAttempts", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="form-section">
                <div className="section-header">
                  <h2>Payment Settings</h2>
                  <p>Configure payment providers and payouts</p>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.payments.stripeEnabled}
                        onChange={(e) => handleSettingChange("payments", "stripeEnabled", e.target.checked)}
                      />
                      {' '}Stripe Enabled
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={settings.payments.paypalEnabled}
                        onChange={(e) => handleSettingChange("payments", "paypalEnabled", e.target.checked)}
                      />
                      {' '}PayPal Enabled
                    </label>
                  </div>
                  <div className="form-group">
                    <label>Minimum Payout ($)</label>
                    <input
                      className="form-input"
                      type="number"
                      value={settings.payments.minimumPayout}
                      onChange={(e) =>
                        handleSettingChange("payments", "minimumPayout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Processing Fee (%)</label>
                    <input
                      className="form-input"
                      type="number"
                      step="0.1"
                      value={settings.payments.processingFee}
                      onChange={(e) =>
                        handleSettingChange("payments", "processingFee", Number.parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Payout Schedule</label>
                    <select
                      className="form-select"
                      value={settings.payments.payoutSchedule}
                      onChange={(e) => handleSettingChange("payments", "payoutSchedule", e.target.value)}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings

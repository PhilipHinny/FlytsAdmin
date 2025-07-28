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
            <button className="btn-secondary">
              <RefreshCw size={20} />
              Reset
            </button>
            <button className="btn-primary" onClick={handleSaveSettings}>
              <Save size={20} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="settings-container">
          <div className="settings-tabs">
            <button
              className={`tab ${activeTab === "general" ? "active" : ""}`}
              onClick={() => setActiveTab("general")}
            >
              <Globe size={20} />
              General
            </button>
            <button
              className={`tab ${activeTab === "platform" ? "active" : ""}`}
              onClick={() => setActiveTab("platform")}
            >
              <Car size={20} />
              Platform
            </button>
            <button
              className={`tab ${activeTab === "notifications" ? "active" : ""}`}
              onClick={() => setActiveTab("notifications")}
            >
              <Bell size={20} />
              Notifications
            </button>
            <button
              className={`tab ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Shield size={20} />
              Security
            </button>
            <button
              className={`tab ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard size={20} />
              Payments
            </button>
          </div>

          <div className="settings-content">
            {activeTab === "general" && (
              <div className="settings-section">
                <h3>General Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Site Name</label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => handleSettingChange("general", "siteName", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Site Description</label>
                    <input
                      type="text"
                      value={settings.general.siteDescription}
                      onChange={(e) => handleSettingChange("general", "siteDescription", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => handleSettingChange("general", "contactEmail", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Support Phone</label>
                    <input
                      type="tel"
                      value={settings.general.supportPhone}
                      onChange={(e) => handleSettingChange("general", "supportPhone", e.target.value)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Timezone</label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => handleSettingChange("general", "timezone", e.target.value)}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Default Currency</label>
                    <select
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
              <div className="settings-section">
                <h3>Platform Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item">
                    <label>Commission Rate (%)</label>
                    <input
                      type="number"
                      value={settings.platform.commissionRate}
                      onChange={(e) =>
                        handleSettingChange("platform", "commissionRate", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Minimum Age</label>
                    <input
                      type="number"
                      value={settings.platform.minimumAge}
                      onChange={(e) => handleSettingChange("platform", "minimumAge", Number.parseInt(e.target.value))}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Maximum Booking Days</label>
                    <input
                      type="number"
                      value={settings.platform.maximumBookingDays}
                      onChange={(e) =>
                        handleSettingChange("platform", "maximumBookingDays", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Cancellation Window (hours)</label>
                    <input
                      type="number"
                      value={settings.platform.cancellationWindow}
                      onChange={(e) =>
                        handleSettingChange("platform", "cancellationWindow", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>Auto-approve Hosts</label>
                    <input
                      type="checkbox"
                      checked={settings.platform.autoApproveHosts}
                      onChange={(e) => handleSettingChange("platform", "autoApproveHosts", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>Auto-approve Cars</label>
                    <input
                      type="checkbox"
                      checked={settings.platform.autoApproveCars}
                      onChange={(e) => handleSettingChange("platform", "autoApproveCars", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-section">
                <h3>Notification Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item toggle">
                    <label>Email Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange("notifications", "emailNotifications", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>SMS Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange("notifications", "smsNotifications", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>Push Notifications</label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange("notifications", "pushNotifications", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>Booking Alerts</label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.bookingAlerts}
                      onChange={(e) => handleSettingChange("notifications", "bookingAlerts", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>Payment Alerts</label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.paymentAlerts}
                      onChange={(e) => handleSettingChange("notifications", "paymentAlerts", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>System Alerts</label>
                    <input
                      type="checkbox"
                      checked={settings.notifications.systemAlerts}
                      onChange={(e) => handleSettingChange("notifications", "systemAlerts", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-section">
                <h3>Security Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item toggle">
                    <label>Two-Factor Authentication</label>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        handleSettingChange("security", "sessionTimeout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Password Expiry (days)</label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) =>
                        handleSettingChange("security", "passwordExpiry", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Max Login Attempts</label>
                    <input
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
              <div className="settings-section">
                <h3>Payment Settings</h3>
                <div className="settings-grid">
                  <div className="setting-item toggle">
                    <label>Stripe Enabled</label>
                    <input
                      type="checkbox"
                      checked={settings.payments.stripeEnabled}
                      onChange={(e) => handleSettingChange("payments", "stripeEnabled", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item toggle">
                    <label>PayPal Enabled</label>
                    <input
                      type="checkbox"
                      checked={settings.payments.paypalEnabled}
                      onChange={(e) => handleSettingChange("payments", "paypalEnabled", e.target.checked)}
                    />
                  </div>
                  <div className="setting-item">
                    <label>Minimum Payout ($)</label>
                    <input
                      type="number"
                      value={settings.payments.minimumPayout}
                      onChange={(e) =>
                        handleSettingChange("payments", "minimumPayout", Number.parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Processing Fee (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.payments.processingFee}
                      onChange={(e) =>
                        handleSettingChange("payments", "processingFee", Number.parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="setting-item">
                    <label>Payout Schedule</label>
                    <select
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettings

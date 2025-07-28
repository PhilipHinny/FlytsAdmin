"use client"

import { useState } from "react"
import React from "react"

import { Search, HelpCircle, Book, MessageCircle, Phone, Mail, ExternalLink } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminHelp.css"

const AdminHelp = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const helpCategories = [
    { id: "all", name: "All Topics", count: 24 },
    { id: "getting-started", name: "Getting Started", count: 6 },
    { id: "user-management", name: "User Management", count: 8 },
    { id: "platform-settings", name: "Platform Settings", count: 5 },
    { id: "troubleshooting", name: "Troubleshooting", count: 5 },
  ]

  const helpArticles = [
    {
      id: 1,
      title: "Admin Dashboard Overview",
      category: "getting-started",
      description: "Learn about the main features and navigation of the admin dashboard",
      lastUpdated: "2024-01-20",
      views: 245,
    },
    {
      id: 2,
      title: "Managing User Accounts",
      category: "user-management",
      description: "How to view, edit, suspend, and manage user accounts",
      lastUpdated: "2024-01-18",
      views: 189,
    },
    {
      id: 3,
      title: "Configuring Platform Settings",
      category: "platform-settings",
      description: "Step-by-step guide to configure platform-wide settings",
      lastUpdated: "2024-01-15",
      views: 156,
    },
    {
      id: 4,
      title: "Host Verification Process",
      category: "user-management",
      description: "Understanding and managing the host verification workflow",
      lastUpdated: "2024-01-12",
      views: 203,
    },
    {
      id: 5,
      title: "Payment System Troubleshooting",
      category: "troubleshooting",
      description: "Common payment issues and how to resolve them",
      lastUpdated: "2024-01-10",
      views: 134,
    },
  ]

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our technical support team",
      icon: MessageCircle,
      action: "contact-support",
    },
    {
      title: "System Status",
      description: "Check current system status and uptime",
      icon: ExternalLink,
      action: "system-status",
    },
    {
      title: "API Documentation",
      description: "Access comprehensive API documentation",
      icon: Book,
      action: "api-docs",
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: ExternalLink,
      action: "video-tutorials",
    },
  ]

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`)
  }

  return (
    <div className="admin-help">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Help & Documentation</h1>
            <p>Find answers and get support for the admin dashboard</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">
              <Phone size={20} />
              Call Support
            </button>
            <button className="btn-primary">
              <Mail size={20} />
              Email Support
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div key={index} className="quick-action-card" onClick={() => handleQuickAction(action.action)}>
                <div className="action-icon">
                  <action.icon size={24} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <ExternalLink size={16} className="action-arrow" />
              </div>
            ))}
          </div>
        </div>

        {/* Help Content */}
        <div className="help-content">
          <div className="help-sidebar">
            <div className="search-section">
              <div className="search-bar">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="categories-section">
              <h3>Categories</h3>
              <div className="categories-list">
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    className={`category-item ${activeCategory === category.id ? "active" : ""}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="category-name">{category.name}</span>
                    <span className="category-count">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="contact-section">
              <h3>Need More Help?</h3>
              <div className="contact-options">
                <div className="contact-item">
                  <Mail size={16} />
                  <div>
                    <div className="contact-label">Email Support</div>
                    <div className="contact-value">admin@fliits.com</div>
                  </div>
                </div>
                <div className="contact-item">
                  <Phone size={16} />
                  <div>
                    <div className="contact-label">Phone Support</div>
                    <div className="contact-value">+1 (555) 123-4567</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="help-main">
            <div className="articles-header">
              <h2>
                {activeCategory === "all"
                  ? "All Articles"
                  : helpCategories.find((cat) => cat.id === activeCategory)?.name}
              </h2>
              <p>{filteredArticles.length} articles found</p>
            </div>

            <div className="articles-list">
              {filteredArticles.map((article) => (
                <div key={article.id} className="article-card">
                  <div className="article-icon">
                    <HelpCircle size={20} />
                  </div>
                  <div className="article-content">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <div className="article-meta">
                      <span>Updated: {article.lastUpdated}</span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <div className="article-action">
                    <ExternalLink size={16} />
                  </div>
                </div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="no-results">
                <HelpCircle size={48} />
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or browse different categories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHelp

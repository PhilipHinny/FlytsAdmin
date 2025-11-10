"use client"

import { useState } from "react"
import React from "react"

import { Search, HelpCircle, Book, MessageCircle, Phone, Mail } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminHelp.css"

const AdminHelp = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const helpCategories = [
    { id: "getting-started", name: "Getting Started", count: 6, iconClass: "getting-started" },
    { id: "user-management", name: "User Management", count: 8, iconClass: "user-management" },
    { id: "payments", name: "Payments", count: 5, iconClass: "payments" },
    { id: "technical", name: "Technical", count: 5, iconClass: "technical" },
  ]

  const helpArticles = [
    { id: 1, title: "Admin Dashboard Overview", category: "getting-started", description: "Learn about the main features and navigation of the admin dashboard", lastUpdated: "2024-01-20", views: 245 },
    { id: 2, title: "Managing User Accounts", category: "user-management", description: "How to view, edit, suspend, and manage user accounts", lastUpdated: "2024-01-18", views: 189 },
    { id: 3, title: "Configuring Platform Settings", category: "technical", description: "Step-by-step guide to configure platform-wide settings", lastUpdated: "2024-01-15", views: 156 },
    { id: 4, title: "Host Verification Process", category: "user-management", description: "Understanding and managing the host verification workflow", lastUpdated: "2024-01-12", views: 203 },
    { id: 5, title: "Payment System Troubleshooting", category: "payments", description: "Common payment issues and how to resolve them", lastUpdated: "2024-01-10", views: 134 },
  ]

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || article.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const faqList = [
    { q: "How do I verify a host?", a: "Go to Hosts page, open the host entry, and use Verify action. You can bulk-verify from the Hosts list." },
    { q: "How do I export data?", a: "Use the Export button on each page. It downloads the filtered rows as a CSV." },
    { q: "Why can't I edit a booking status?", a: "Ensure your backend permits status transitions and CORS is configured correctly." },
  ]

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

        {/* Search */}
        <div className="help-search">
          <h2>How can we help?</h2>
          <p>Search our knowledge base for quick answers</p>
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

        {/* Categories */}
        <div className="help-categories">
          {helpCategories.map((cat) => (
            <div key={cat.id} className="category-card" onClick={() => setActiveCategory(cat.id)}>
              <div className="category-header">
                <div className={`category-icon ${cat.iconClass}`}>
                  <HelpCircle size={24} />
                </div>
                <div className="category-title">
                  <h3>{cat.name}</h3>
                  <p>Browse articles in this category</p>
                </div>
              </div>
              <div className="article-count">{cat.count} articles</div>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="popular-articles">
          <div className="section-header">
            <h3>Popular Articles</h3>
            <span className="view-all" onClick={() => setActiveCategory("all")}>View all</span>
          </div>
          <ul className="articles-list">
            {filteredArticles.slice(0, 5).map((article) => (
              <li key={article.id} className="article-item">
                <div className="article-info">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">
                    <span className="article-category">{article.category.replace("-", " ")}</span>
                    <span>Updated: {article.lastUpdated}</span>
                    <span className="article-views">{article.views} views</span>
                  </div>
                </div>
                <Book size={16} />
              </li>
            ))}
          </ul>
        </div>

        {/* FAQ */}
        <div className="faq-section">
          <h3>Frequently Asked Questions</h3>
          <ul className="faq-list">
            {faqList.map((f, idx) => (
              <li key={idx} className="faq-item">
                <div className="faq-question">
                  <span>{f.q}</span>
                  <span className="faq-toggle">▼</span>
                </div>
                <div className="faq-answer">{f.a}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Support */}
        <div className="contact-support">
          <h3>Need more help?</h3>
          <p>Contact our support team and we’ll get back to you as soon as possible.</p>
          <div className="contact-actions">
            <button className="btn-white">
              <Mail size={16} /> Email Support
            </button>
            <button className="btn-white">
              <Phone size={16} /> Call Support
            </button>
            <button className="btn-white">
              <MessageCircle size={16} /> Chat with Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHelp

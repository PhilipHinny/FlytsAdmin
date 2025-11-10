"use client"

import { useState } from "react"
import React from "react"

import { Search, Filter, MoreVertical, Eye, Edit, Plus, FileText, ImageIcon, Video, QuoteIcon } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminContent.css"

const AdminContent = () => {
  const [activeTab, setActiveTab] = useState("pages")
  const [searchTerm, setSearchTerm] = useState("")
  const [content, setContent] = useState({
    pages: [
      {
        id: 1,
        title: "How It Works",
        slug: "/how-it-works",
        status: "Published",
        lastModified: "2024-01-20",
        author: "Admin",
        views: 1250,
      },
      {
        id: 2,
        title: "Safety Guidelines",
        slug: "/safety",
        status: "Draft",
        lastModified: "2024-01-18",
        author: "Admin",
        views: 0,
      },
      {
        id: 3,
        title: "Terms of Service",
        slug: "/terms",
        status: "Published",
        lastModified: "2024-01-15",
        author: "Admin",
        views: 890,
      },
    ],
    faqs: [
      {
        id: 1,
        question: "How do I become a host?",
        answer: "To become a host, you need to sign up, verify your identity, and list your car...",
        category: "Hosting",
        status: "Published",
        lastModified: "2024-01-22",
      },
      {
        id: 2,
        question: "What insurance coverage is provided?",
        answer: "We provide comprehensive insurance coverage for all rentals...",
        category: "Insurance",
        status: "Published",
        lastModified: "2024-01-20",
      },
      {
        id: 3,
        question: "How do payments work?",
        answer: "Payments are processed securely through our platform...",
        category: "Payments",
        status: "Draft",
        lastModified: "2024-01-18",
      },
    ],
    media: [
      {
        id: 1,
        name: "hero-banner.jpg",
        type: "image",
        size: "2.4 MB",
        uploadDate: "2024-01-20",
        usedIn: ["Homepage", "About"],
      },
      {
        id: 2,
        name: "how-it-works-video.mp4",
        type: "video",
        size: "15.6 MB",
        uploadDate: "2024-01-18",
        usedIn: ["How It Works"],
      },
      {
        id: 3,
        name: "app-screenshots.zip",
        type: "archive",
        size: "8.2 MB",
        uploadDate: "2024-01-15",
        usedIn: ["Download App"],
      },
    ],
  })

  const handleContentAction = (action, type, id) => {
    console.log(`${action} ${type} ${id}`)
  }

  const getContentByTab = () => {
    return content[activeTab] || []
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon size={16} />
      case "video":
        return <Video size={16} />
      default:
        return <FileText size={16} />
    }
  }

  return (
    <div className="admin-content">
      <AdminSidebar />

      <div className="admin-content-main">
        <div className="page-header">
          <div className="header-left">
            <h1>Content Management</h1>
            <p>Manage website content, FAQs, and media files</p>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">Import Content</button>
            <button className="btn-primary">
              <Plus size={20} />
              Create New
            </button>
          </div>
        </div>

        <div className="content-tabs">
          <button className={`tab ${activeTab === "pages" ? "active" : ""}`} onClick={() => setActiveTab("pages")}>
            <FileText size={20} 
            className="content-icon pages"
            />
            Pages
          </button>
          <button className={`tab ${activeTab === "faqs" ? "active" : ""}`} onClick={() => setActiveTab("faqs")}>
            <QuoteIcon size={20} 
            className="content-icon FAQ"
            />
            FAQs
          </button>
          <button className={`tab ${activeTab === "media" ? "active" : ""}`} onClick={() => setActiveTab("media")}>
            <ImageIcon size={20} 
            className="content-icon media"
            />
            Media
          </button>
        </div>

        <div className="content-controls">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-controls">
            <select>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button className="filter-btn">
              <Filter size={20} />
              More Filters
            </button>
          </div>
        </div>

        {activeTab === "pages" && (
          <div className="content-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Views</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.pages.map((page) => (
                  <tr key={page.id}>
                    <td>
                      <div className="content-title">
                        <FileText size={16} />
                        {page.title}
                      </div>
                    </td>
                    <td>{page.slug}</td>
                    <td>
                      <span className={`status ${page.status.toLowerCase()}`}>{page.status}</span>
                    </td>
                    <td>{page.author}</td>
                    <td>{page.views.toLocaleString()}</td>
                    <td>{page.lastModified}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleContentAction("view", "page", page.id)}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleContentAction("edit", "page", page.id)}>
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
        )}

        {activeTab === "faqs" && (
          <div className="content-table">
            <table>
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {content.faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td>
                      <div className="faq-question">
                        {faq.question}
                        <div className="faq-preview">{faq.answer.substring(0, 100)}...</div>
                      </div>
                    </td>
                    <td>
                      <span className="category-badge">{faq.category}</span>
                    </td>
                    <td>
                      <span className={`status ${faq.status.toLowerCase()}`}>{faq.status}</span>
                    </td>
                    <td>{faq.lastModified}</td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleContentAction("view", "faq", faq.id)}>
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleContentAction("edit", "faq", faq.id)}>
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
        )}

        {activeTab === "media" && (
          <div className="media-grid">
            {content.media.map((media) => (
              <div key={media.id} className="media-card">
                <div className="media-preview">
                  {getTypeIcon(media.type)}
                  <div className="media-type">{media.type}</div>
                </div>
                <div className="media-info">
                  <div className="media-name">{media.name}</div>
                  <div className="media-details">
                    <span>{media.size}</span>
                    <span>{media.uploadDate}</span>
                  </div>
                  <div className="media-usage">Used in: {media.usedIn.join(", ")}</div>
                </div>
                <div className="media-actions">
                  <button onClick={() => handleContentAction("view", "media", media.id)}>
                    <Eye size={16} />
                  </button>
                  <button onClick={() => handleContentAction("edit", "media", media.id)}>
                    <Edit size={16} />
                  </button>
                  <button>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminContent

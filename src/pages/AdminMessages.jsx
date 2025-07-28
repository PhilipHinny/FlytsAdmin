"use client"

import { useState } from "react"
import React from "react"
import { Search, Filter, MoreVertical, Eye, MessageCircle, Send } from "lucide-react"
import AdminSidebar from "../components/AdminSidebar"
import "../styles/AdminMessages.css"

const AdminMessages = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [conversations, setConversations] = useState([
    {
      id: 1,
      participants: ["John Doe", "Sarah Wilson"],
      lastMessage: "Thanks for the great car rental experience!",
      lastMessageTime: "2024-01-25 14:30",
      unreadCount: 0,
      status: "Active",
      bookingId: "FL123456",
      messages: [
        {
          id: 1,
          sender: "John Doe",
          message: "Hi, I'm interested in renting your BMW for the weekend.",
          timestamp: "2024-01-25 10:00",
          type: "text",
        },
        {
          id: 2,
          sender: "Sarah Wilson",
          message: "Hello! Yes, it's available. The car is in excellent condition.",
          timestamp: "2024-01-25 10:15",
          type: "text",
        },
        {
          id: 3,
          sender: "John Doe",
          message: "Great! I'll book it now.",
          timestamp: "2024-01-25 10:30",
          type: "text",
        },
        {
          id: 4,
          sender: "Sarah Wilson",
          message: "Perfect! Looking forward to meeting you.",
          timestamp: "2024-01-25 11:00",
          type: "text",
        },
        {
          id: 5,
          sender: "John Doe",
          message: "Thanks for the great car rental experience!",
          timestamp: "2024-01-25 14:30",
          type: "text",
        },
      ],
    },
    {
      id: 2,
      participants: ["Jane Smith", "David Brown"],
      lastMessage: "When can I pick up the car?",
      lastMessageTime: "2024-01-24 16:45",
      unreadCount: 2,
      status: "Pending",
      bookingId: "FL123457",
      messages: [
        {
          id: 1,
          sender: "Jane Smith",
          message: "Hi, I have a booking for your Tesla Model 3.",
          timestamp: "2024-01-24 15:00",
          type: "text",
        },
        {
          id: 2,
          sender: "David Brown",
          message: "Hello! Yes, I see your booking. The car is ready.",
          timestamp: "2024-01-24 15:30",
          type: "text",
        },
        {
          id: 3,
          sender: "Jane Smith",
          message: "When can I pick up the car?",
          timestamp: "2024-01-24 16:45",
          type: "text",
        },
      ],
    },
    {
      id: 3,
      participants: ["Mike Johnson", "Lisa Garcia"],
      lastMessage: "There seems to be an issue with the booking.",
      lastMessageTime: "2024-01-23 12:20",
      unreadCount: 1,
      status: "Issue",
      bookingId: "FL123458",
      messages: [
        {
          id: 1,
          sender: "Mike Johnson",
          message: "Hi, I'm having trouble with my booking.",
          timestamp: "2024-01-23 11:00",
          type: "text",
        },
        {
          id: 2,
          sender: "Lisa Garcia",
          message: "What kind of trouble are you experiencing?",
          timestamp: "2024-01-23 11:30",
          type: "text",
        },
        {
          id: 3,
          sender: "Mike Johnson",
          message: "There seems to be an issue with the booking.",
          timestamp: "2024-01-23 12:20",
          type: "text",
        },
      ],
    },
  ])

  const filteredConversations = conversations.filter((conv) => {
    return (
      conv.participants.some((participant) => participant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conv.bookingId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: conv.messages.length + 1,
                sender: "Admin",
                message: newMessage,
                timestamp: new Date().toLocaleString(),
                type: "text",
              },
            ],
            lastMessage: newMessage,
            lastMessageTime: new Date().toLocaleString(),
          }
        }
        return conv
      })
      setConversations(updatedConversations)
      setSelectedConversation(updatedConversations.find((conv) => conv.id === selectedConversation.id))
      setNewMessage("")
    }
  }

  return (
    <div className="messages-admin-messages">
      <AdminSidebar />

      <div className="messages-admin-content">
        <div className="messages-page-header">
          <div className="messages-header-left">
            <h1>Messages Management</h1>
            <p>Monitor and manage user conversations</p>
          </div>
          <div className="messages-header-actions">
            <button className="messages-btn-secondary">Export Conversations</button>
            <button className="messages-btn-primary">Send Broadcast</button>
          </div>
        </div>

        <div className="messages-messages-container">
          <div className="messages-conversations-panel">
            <div className="messages-conversations-header">
              <div className="messages-search-bar">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="messages-filter-btn">
                <Filter size={20} />
              </button>
            </div>

            <div className="messages-conversations-list">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`messages-conversation-item ${selectedConversation?.id === conversation.id ? "messages-active" : ""}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="messages-conversation-info">
                    <div className="messages-participants">{conversation.participants.join(" & ")}</div>
                    <div className="messages-booking-id">Booking: {conversation.bookingId}</div>
                  </div>
                  <div className="messages-conversation-preview">
                    <div className="messages-last-message">{conversation.lastMessage}</div>
                    <div className="messages-message-time">{conversation.lastMessageTime}</div>
                  </div>
                  <div className="messages-conversation-status">
                    <span className={`messages-status ${conversation.status.toLowerCase()}`}>{conversation.status}</span>
                    {conversation.unreadCount > 0 && <span className="messages-unread-badge">{conversation.unreadCount}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="messages-chat-panel">
            {selectedConversation ? (
              <>
                <div className="messages-chat-header">
                  <div className="messages-chat-info">
                    <h3>{selectedConversation.participants.join(" & ")}</h3>
                    <p>Booking: {selectedConversation.bookingId}</p>
                  </div>
                  <div className="messages-chat-actions">
                    <button>
                      <Eye size={20} />
                    </button>
                    <button>
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                <div className="messages-chat-messages">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`messages-message ${message.sender === "Admin" ? "messages-admin-message" : "messages-user-message"}`}
                    >
                      <div className="messages-message-header">
                        <span className="messages-sender">{message.sender}</span>
                        <span className="messages-timestamp">{message.timestamp}</span>
                      </div>
                      <div className="messages-message-content">{message.message}</div>
                    </div>
                  ))}
                </div>

                <div className="messages-chat-input">
                  <input
                    type="text"
                    placeholder="Type your message as admin..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>
                    <Send size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="messages-no-conversation">
                <MessageCircle size={48} />
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the list to view messages</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminMessages

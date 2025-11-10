"use client"

import React, { useState } from "react"
import { Lock, Mail, Loader2 } from "lucide-react"
import "../styles/AdminLogin.css"

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

  const loginRequest = async (body) => {
    const tryOnce = async (path) => {
      const res = await fetch(`${apiBaseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(`Login failed: ${res.status}`)
      return res.json()
    }
    return await tryOnce("/api/admin/auth/login")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please enter email and password.")
      return
    }
    try {
      setIsSubmitting(true)
      const data = await loginRequest({ email, password })
      const token = data?.token || data?.accessToken
      if (!token) throw new Error("Invalid response from server")
      localStorage.setItem("flyts_admin_token", token)
      if (remember) localStorage.setItem("flyts_admin_email", email)
      window.location.href = "/" // redirect to dashboard route
    } catch (err) {
      console.error(err)
      setError("Invalid credentials or server error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="login-header">
          <img className="login-logo" src="/Flyts logo.png" alt="FLYTS" />
          <h1>FLYTS Admin</h1>
          <p>Sign in to manage the platform</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <span>Email</span>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                placeholder="admin@flyts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
          </label>

          <label className="form-group">
            <span>Password</span>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </label>

          <div className="login-actions">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <a className="forgot" href="#">Forgot password?</a>
          </div>

          <button className="btn-primary submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="spin" size={16} /> : null}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <span>© {new Date().getFullYear()} FLYTS</span>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin 
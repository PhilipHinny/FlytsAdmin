import React, { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { fetchWithAuth } from "../lib/utils"

const RequireAuth = () => {
  const location = useLocation()
  const token = typeof window !== "undefined" ? localStorage.getItem("flyts_admin_token") : null
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadRole = async () => {
      if (!token) {
        setReady(true)
        return
      }
      try {
        const res = await fetchWithAuth("/admin/auth/me", { method: "GET" })
        if (res.ok) {
          const me = await res.json()
          if (me?.role) localStorage.setItem("flyts_admin_role", me.role)
          if (me?.name) localStorage.setItem("flyts_admin_name", me.name)
          if (me?.email) localStorage.setItem("flyts_admin_email", me.email)
        }
      } catch (_) {
        // ignore and continue
      } finally {
        if (mounted) setReady(true)
      }
    }
    loadRole()
    return () => { mounted = false }
  }, [token])

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!ready) return null

  return <Outlet />
}

export default RequireAuth 
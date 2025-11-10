export function getApiBaseUrl(withApi = false) {
  const base = import.meta.env.VITE_API_BASE_URL
  return withApi ? `${base}/api` : base
}

export const getAuthHeader = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("flyts_admin_token") : null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchWithAuth(path, options = {}, useApiPrefixFirst = true) {
  const base = import.meta.env.VITE_API_BASE_URL
  const headers = { "Content-Type": "application/json", ...(options.headers || {}), ...getAuthHeader() }

  const tryOnce = async (p) => {
    const res = await fetch(`${base}${p}`, { ...options, headers })
    if (!res.ok) throw new Error(`${res.status}`)
    return res
  }

  return await tryOnce(`/api${path}`)
}

export const getCurrentRole = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("flyts_admin_role")
}

export const setCurrentRole = (role) => {
  if (typeof window === "undefined") return
  if (role) localStorage.setItem("flyts_admin_role", role)
}

export const canWrite = () => {
  const role = (getCurrentRole() || "").toLowerCase()
  return role === "admin"
}

export const canRead = () => {
  const role = (getCurrentRole() || "").toLowerCase()
  return role === "admin" || role === "manager" || role === "support"
}

export const normalizeProfilePicture = (value) => {
  if (!value || value === "/placeholder.svg") return null
  if (typeof value !== "string") return null

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }

  if (value.startsWith("gs://")) {
    try {
      const withoutScheme = value.slice(5)
      const slashIdx = withoutScheme.indexOf("/")
      if (slashIdx === -1) return null
      const bucket = withoutScheme.slice(0, slashIdx)
      const path = withoutScheme.slice(slashIdx + 1)
      const encodedPath = encodeURIComponent(path)
      return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`
    } catch (_) {
      return null
    }
  }

  const base = getApiBaseUrl()
  const needsSlash = !value.startsWith("/")
  return needsSlash ? `${base}/${value}` : `${base}${value}`
}

export const normalizeCarPhoto = (photo) => {
  if (!photo) return "/placeholder.svg"
  try {
    new URL(photo)
    return photo
  } catch (e) {
    const base = getApiBaseUrl()
    const needsSlash = !photo.startsWith("/")
    return needsSlash ? `${base}/static/uploads/${photo}` : `${base}${photo}`
  }
} 
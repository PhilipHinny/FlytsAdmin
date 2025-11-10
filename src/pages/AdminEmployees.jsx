import React, { useEffect, useMemo, useState } from "react"
import Modal from "../components/Modal"
import { fetchWithAuth, canWrite } from "../lib/utils"
import "../styles/AdminEmployees.css"
import AdminSidebar from "../components/AdminSidebar"
import { Eye, Edit, Trash2 } from "lucide-react"

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Admin" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [selected, setSelected] = useState(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  const fetchEmployees = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetchWithAuth("/admin/employees", { method: "GET" })
      const data = await res.json()
      const list = Array.isArray(data?.employees) ? data.employees : Array.isArray(data) ? data : []
      const normalized = list.map((u) => ({
        id: u.id || u._id || "",
        name: u.name || u.full_name || u.fullName || "Unknown",
        email: u.email || "",
        role: u.role || "Admin",
        active: typeof u.active === "boolean" ? u.active : true,
        createdAt: u.createdAt || u.created_at || u.date_created || u.updated_at || null,
      }))
      setEmployees(normalized)
    } catch (e) {
      setError("Failed to load employees.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleOpenAdd = () => {
    setForm({ name: "", email: "", password: "", role: "Admin" })
    setIsAddOpen(true)
  }

  const handleCreate = async () => {
    setError("")
    if (!form.email || !form.password) {
      setError("Email and password are required.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetchWithAuth("/admin/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name, role: form.role })
      })
      if (!res.ok) throw new Error("Failed")
      const created = await res.json().catch(() => null)
      const newId = created?.user?.id || created?.id || null

      // Force-set role after creation in case register ignored it
      if (newId && form.role) {
        try {
          await fetchWithAuth(`/admin/employees/${newId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: form.role })
          })
        } catch (_) {}
      }

      setIsAddOpen(false)
      await fetchEmployees()
    } catch (e) {
      setError("Failed to create employee.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleView = (emp) => {
    setSelected(emp)
    setIsViewOpen(true)
  }

  const handleEdit = (emp) => {
    setSelected(emp)
    setIsEditOpen(true)
  }

  const handleDelete = async (emp) => {
    if (!emp?.id) return
    const confirmDelete = window.confirm("Delete this employee? This action cannot be undone.")
    if (!confirmDelete) return
    try {
      setIsLoadingAction(true)
      const res = await fetchWithAuth(`/admin/employees/${emp.id}`, { method: "DELETE" })
      if (!res.ok && res.status !== 204) throw new Error("Delete failed")
      setEmployees((prev) => prev.filter((e) => e.id !== emp.id))
    } catch (e) {
      alert("Failed to delete employee.")
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleEditSave = async (updates) => {
    if (!selected?.id) return
    try {
      setIsLoadingAction(true)
      const res = await fetchWithAuth(`/admin/employees/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      const updated = res.ok ? await res.json() : { ...selected, ...updates }
      const merged = { ...selected, ...updated }
      setEmployees((prev) => prev.map((e) => (e.id === selected.id ? merged : e)))
      setIsEditOpen(false)
      setSelected(null)
    } catch (e) {
      alert("Failed to save changes.")
    } finally {
      setIsLoadingAction(false)
    }
  }

  const formatDateTime = (value) => {
    if (!value) return "—"
    try {
      if (typeof value === "object" && value.$date) return new Date(value.$date).toLocaleString()
      return new Date(value).toLocaleString()
    } catch {
      return String(value)
    }
  }

  const displayed = useMemo(() => employees, [employees])
  const writable = canWrite()

  return (
    <div className="admin-employees">
      <AdminSidebar />

      <div className="admin-content">
        <div className="page-header">
          <div className="header-left">
            <h1>Employees</h1>
            <p>Manage admin users for the FLYTS platform</p>
          </div>
          <div className="header-actions">
            <button className="btn-primary" onClick={handleOpenAdd} disabled={!writable} title={writable ? undefined : 'Insufficient permissions'}>Add Employee</button>
          </div>
        </div>

        {error ? <div className="error-banner">{error}</div> : null}

        <div className="employees-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "120px" }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th style={{ width: "140px" }}>Role</th>
                <th style={{ width: "220px" }}>Created</th>
                <th style={{ width: "120px" }}>Active</th>
                <th style={{ width: "140px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="center">Loading...</td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={7} className="center">No employees found</td></tr>
              ) : (
                displayed.map((u, idx) => (
                  <tr key={`${u.id || 'row'}-${idx}`}>
                    <td title={u.id}><span className="mono id-trunc">{(u.id || '').slice(0, 4)}…</span></td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge role">{u.role}</span></td>
                    <td>{formatDateTime(u.createdAt)}</td>
                    <td>
                      <span className={`badge ${u.active ? 'green' : 'gray'}`}>{u.active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td>
                      <div className="actions">
                        <button onClick={() => handleView(u)} title="View"><Eye size={16} /></button>
                        <button disabled={!writable || isLoadingAction} onClick={() => handleEdit(u)} title={writable ? 'Edit' : 'Insufficient permissions'}><Edit size={16} /></button>
                        <button disabled={!writable || isLoadingAction} onClick={() => handleDelete(u)} title={writable ? 'Delete' : 'Insufficient permissions'}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Employee">
          <div className="modal-body">
            <div className="form-grid">
              <label className="form-group">
                <span>Name</span>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Admin" />
              </label>
              <label className="form-group">
                <span>Email</span>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@flyts.com" />
              </label>
              <label className="form-group">
                <span>Password</span>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
              </label>
              <label className="form-group">
                <span>Role</span>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Support">Support</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleCreate} disabled={isSubmitting || !writable} title={writable ? undefined : 'Insufficient permissions'}>{isSubmitting ? 'Creating...' : 'Create'}</button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isViewOpen && !!selected}
          onClose={() => { setIsViewOpen(false); setSelected(null) }}
          title="Employee Details"
          footer={<button className="btn-secondary" onClick={() => { setIsViewOpen(false); setSelected(null) }}>Close</button>}
        >
          {selected && (
            <div className="modal-body">
              <div>
                <div><strong>ID:</strong> {selected.id}</div>
                <div><strong>Name:</strong> {selected.name}</div>
                <div><strong>Email:</strong> {selected.email}</div>
                <div><strong>Role:</strong> {selected.role}</div>
                <div><strong>Status:</strong> {selected.active ? 'Active' : 'Inactive'}</div>
                <div><strong>Created:</strong> {formatDateTime(selected.createdAt)}</div>
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isEditOpen && !!selected}
          onClose={() => { if (!isLoadingAction) { setIsEditOpen(false); setSelected(null) } }}
          title="Edit Employee"
          footer={null}
        >
          {selected && (
            <EditEmployeeModal
              employee={selected}
              onCancel={() => { setIsEditOpen(false); setSelected(null) }}
              onSave={handleEditSave}
              isSaving={isLoadingAction}
              canWrite={writable}
            />
          )}
        </Modal>
      </div>
    </div>
  )
}

const EditEmployeeModal = ({ employee, onCancel, onSave, isSaving, canWrite }) => {
  const [name, setName] = useState(employee.name || "")
  const [email, setEmail] = useState(employee.email || "")
  const [role, setRole] = useState(employee.role || "Admin")
  const [active, setActive] = useState(Boolean(employee.active))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ name, email, role, active })
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <label>
        <span>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Admin" disabled={!canWrite} />
      </label>
      <label>
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@flyts.com" disabled={!canWrite} />
      </label>
      <label>
        <span>Role</span>
        <select value={role} onChange={(e) => setRole(e.target.value)} disabled={!canWrite}>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Support">Support</option>
        </select>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} disabled={!canWrite} />
        <span>Active</span>
      </label>
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSaving || !canWrite}>{isSaving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  )
}

export default AdminEmployees 
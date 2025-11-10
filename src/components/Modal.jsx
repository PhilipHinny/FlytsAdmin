import React, { useEffect } from "react"
import { createPortal } from "react-dom"

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
}

const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  width: "min(600px, 92vw)",
  maxHeight: "90vh",
  overflow: "auto",
  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
}

const headerStyle = {
  padding: "16px 20px",
  borderBottom: "1px solid #eee",
  fontWeight: 600,
}

const bodyStyle = {
  padding: "16px 20px",
}

const footerStyle = {
  padding: "12px 20px",
  borderTop: "1px solid #eee",
  display: "flex",
  gap: "8px",
  justifyContent: "flex-end",
}

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null
  return createPortal(
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {title ? <div style={headerStyle}>{title}</div> : null}
        <div style={bodyStyle}>{children}</div>
        {footer ? <div style={footerStyle}>{footer}</div> : null}
      </div>
    </div>,
    document.body
  )
}

export default Modal 
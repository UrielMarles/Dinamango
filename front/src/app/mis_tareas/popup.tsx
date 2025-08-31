"use client"

import { promises } from "dns"
import { useEffect } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
}

export default function Popup({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", onKey)
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", onKey)
            document.body.style.overflow = ""
        }
    }, [isOpen, onClose])

    if (!isOpen) {
        return null
    }

    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: 50
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                style={{
                    width: "100%",
                    maxWidth: 680,
                    background: "white",
                    borderRadius: 12,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    padding: "1rem"
                }}
            >
                {title ? <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>{title}</h2> : null}
                <div>{children}</div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "0.5rem 0.75rem",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            background: "#f9fafb",
                            cursor: "pointer"
                        }}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

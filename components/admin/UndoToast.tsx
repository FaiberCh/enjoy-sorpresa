"use client"

import { useEffect } from "react"

type UndoToastProps = {
  message: string
  onUndo: () => void
  onDismiss: () => void
}

export default function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white text-sm pl-4 pr-2 py-2 rounded-full shadow-xl"
    >
      <span>{message}</span>
      <button
        onClick={onUndo}
        className="font-semibold text-pink-300 hover:text-pink-200 px-2 py-1 rounded-full transition-colors"
      >
        Deshacer
      </button>
    </div>
  )
}

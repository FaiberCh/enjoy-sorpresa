"use client"

import { useState } from "react"

type ToastState = { message: string; onUndo: () => void } | null

export function useUndoToast() {
  const [toast, setToast] = useState<ToastState>(null)

  function showUndo(message: string, onUndo: () => void) {
    setToast({ message, onUndo: () => { onUndo(); setToast(null) } })
  }

  function dismiss() {
    setToast(null)
  }

  return { toast, showUndo, dismiss }
}

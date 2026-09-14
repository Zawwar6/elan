import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'success', duration = 3200) => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] sm:w-auto sm:max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="animate-slideUp flex items-start gap-3 bg-white border border-line shadow-lg px-4 py-3 text-sm"
          >
            {t.type === 'success' && <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />}
            {t.type === 'error' && <XCircle size={18} className="text-sale shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info size={18} className="text-ink-soft shrink-0 mt-0.5" />}
            <span className="flex-1 text-ink">{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-ink-soft hover:text-ink">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

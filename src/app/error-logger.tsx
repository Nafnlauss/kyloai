'use client'

import { useEffect } from 'react'

export function ErrorLogger() {
  useEffect(() => {
    // Log errors to our debug endpoint
    const logError = (error: any) => {
      fetch('/api/debug/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message || error,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          type: 'window.onerror'
        })
      }).catch(console.error)
    }

    // Capture window errors
    window.onerror = (message, source, lineno, colno, error) => {
      logError({
        message,
        source,
        lineno,
        colno,
        stack: error?.stack
      })
      return false
    }

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        reason: event.reason
      })
    })

    // Log initial page load
    fetch('/api/debug/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_load',
        url: window.location.href,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error)
  }, [])

  return null
}
'use client'

import { useEffect } from 'react'

export function ClientInit() {
  useEffect(() => {
    // Remove classes adicionadas por extensões do VSCode
    const body = document.body
    const vsCodeClasses = ['vsc-initialized']
    vsCodeClasses.forEach(cls => {
      if (body.classList.contains(cls)) {
        body.classList.remove(cls)
      }
    })
  }, [])

  return null
}
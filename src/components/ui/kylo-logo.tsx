import React from 'react'
import { cn } from '@/lib/utils'

interface KyloLogoProps {
  className?: string
  size?: number
}

export function KyloLogo({ className, size = 24 }: KyloLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
    >
      {/* Hexágono externo com pétalas */}
      <g transform="translate(50, 50)">
        {/* Pétalas/Raios ao redor */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <rect
            key={i}
            x="-8"
            y="-35"
            width="16"
            height="20"
            rx="8"
            fill="currentColor"
            transform={`rotate(${angle})`}
          />
        ))}
        
        {/* Hexágono central */}
        <path
          d="M -20 -11.547 L -20 11.547 L 0 23.094 L 20 11.547 L 20 -11.547 L 0 -23.094 Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}
'use client'

import { cn } from '@/lib/utils'

interface SimpleSwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function SimpleSwitch({ checked, onCheckedChange, className }: SimpleSwitchProps) {
  return (
    <label className={cn("relative inline-block w-11 h-6 cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => {
          console.log('[SimpleSwitch] Checkbox changed to:', e.target.checked)
          onCheckedChange(e.target.checked)
        }}
      />
      <span className="absolute inset-0 bg-input rounded-full peer-checked:bg-primary transition-colors duration-200" />
      <span 
        className={cn(
          "absolute left-1 top-1 h-4 w-4 bg-background rounded-full transition-transform duration-200",
          checked && "translate-x-5"
        )} 
      />
    </label>
  )
}
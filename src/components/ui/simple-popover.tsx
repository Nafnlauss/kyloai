"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface PopoverContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | undefined>(undefined)

interface PopoverProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  
  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = React.useCallback((value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value)
    } else {
      setInternalOpen(value)
    }
  }, [onOpenChange])

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export const PopoverTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & { asChild?: boolean; children?: React.ReactNode }
>(({ asChild, onClick, children, ...props }, ref) => {
  const context = React.useContext(PopoverContext)
  
  if (!context) {
    throw new Error("PopoverTrigger must be used within a Popover")
  }

  const handleClick = (e: React.MouseEvent) => {
    context.setIsOpen(!context.isOpen)
    onClick?.(e as any)
  }

  // If children is a single React element, clone it and add onClick
  if (React.isValidElement(children) && React.Children.count(children) === 1) {
    return React.cloneElement(children as any, {
      onClick: handleClick,
      ref,
      style: { cursor: 'pointer', ...children.props.style },
      ...props,
    })
  }

  // Otherwise wrap in a div
  return (
    <div ref={ref as any} onClick={handleClick} style={{ cursor: 'pointer' }} {...props}>
      {children}
    </div>
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, side = "bottom", align = "center", ...props }, ref) => {
    const context = React.useContext(PopoverContext)
    const contentRef = React.useRef<HTMLDivElement>(null)
    
    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

    React.useEffect(() => {
      if (!context) return

      const handleClickOutside = (event: MouseEvent) => {
        try {
          if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
            // Check if click is on trigger
            const trigger = contentRef.current.parentElement?.querySelector('button')
            if (trigger && trigger.contains(event.target as Node)) {
              return
            }
            context.setIsOpen(false)
          }
        } catch (error) {
          console.error('Error in handleClickOutside:', error)
        }
      }

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          context.setIsOpen(false)
        }
      }

      if (context.isOpen) {
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEscape)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }, [context])

    if (!context || !context.isOpen) {
      return null
    }

    const positionClasses = {
      right: side === "right" ? "left-full ml-2" : "",
      left: side === "left" ? "right-full mr-2" : "",
      top: side === "top" ? "bottom-full mb-2" : "",
      bottom: side === "bottom" ? "top-full mt-2" : "",
    }

    const alignClasses = {
      start: align === "start" ? "top-0" : "",
      center: "",
      end: align === "end" ? "bottom-0" : "",
    }

    return (
      <div
        ref={contentRef}
        className={cn(
          "absolute z-50 w-72 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-50 shadow-xl",
          positionClasses[side],
          alignClasses[align],
          className
        )}
        {...props}
      />
    )
  }
)
PopoverContent.displayName = "PopoverContent"
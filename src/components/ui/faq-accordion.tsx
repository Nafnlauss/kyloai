'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
  className?: string
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)
        
        return (
          <div 
            key={item.id} 
            className={cn(
              "border rounded-lg transition-all duration-200",
              isOpen ? "border-primary/20 bg-muted/30" : "border-border hover:border-border/60"
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleItem(item.id)
                }
              }}
              className="flex w-full items-center justify-between p-6 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
            >
              <h3 className="text-base font-medium pr-8 text-foreground">
                {item.question}
              </h3>
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
                isOpen ? "bg-primary/10" : "bg-muted"
              )}>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
              </div>
            </button>
            
            <div
              id={`faq-answer-${item.id}`}
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className={cn(
                  "px-6 pb-6 transition-opacity duration-200",
                  isOpen ? "opacity-100" : "opacity-0"
                )}>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
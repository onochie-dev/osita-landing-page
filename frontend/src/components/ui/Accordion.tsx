import { useState, createContext, useContext, HTMLAttributes, forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/cn'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (id: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  defaultOpen?: string[]
}

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = 'single', defaultOpen = [], children, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen)

    const toggleItem = (id: string) => {
      if (type === 'single') {
        setOpenItems(openItems.includes(id) ? [] : [id])
      } else {
        setOpenItems(
          openItems.includes(id)
            ? openItems.filter((item) => item !== id)
            : [...openItems, id]
        )
      }
    }

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
        <div ref={ref} className={cn('space-y-3', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)

Accordion.displayName = 'Accordion'

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error('AccordionItem must be used within Accordion')

    const isOpen = context.openItems.includes(value)

    return (
      <div
        ref={ref}
        data-state={isOpen ? 'open' : 'closed'}
        className={cn(
          'bg-white border border-slate-200 rounded-2xl overflow-hidden transition-shadow',
          isOpen && 'shadow-sm',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

AccordionItem.displayName = 'AccordionItem'

interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error('AccordionTrigger must be used within Accordion')

    const isOpen = context.openItems.includes(value)

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.toggleItem(value)}
        className={cn(
          'w-full flex items-center justify-between px-5 py-4 text-left',
          'text-slate-900 font-medium hover:bg-slate-50 transition-colors',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            'w-5 h-5 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
    )
  }
)

AccordionTrigger.displayName = 'AccordionTrigger'

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = useContext(AccordionContext)
    if (!context) throw new Error('AccordionContent must be used within Accordion')

    const isOpen = context.openItems.includes(value)

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div
              ref={ref}
              className={cn('px-5 pb-5 border-t border-slate-100', className)}
              {...props}
            >
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

AccordionContent.displayName = 'AccordionContent'

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }


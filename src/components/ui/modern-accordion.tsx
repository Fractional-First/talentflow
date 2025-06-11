
import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const ModernAccordion = AccordionPrimitive.Root

const ModernAccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-b border-border last:border-b-0 group",
      className
    )}
    {...props}
  />
))
ModernAccordionItem.displayName = "ModernAccordionItem"

const ModernAccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "accordion-trigger",
        "flex flex-1 items-center justify-between py-6 text-left font-medium text-fluid-lg",
        "transition-all duration-300 ease-out",
        "hover:text-primary focus:text-primary",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
        "group-hover:bg-muted/20 px-4 -mx-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="accordion-icon h-5 w-5 ml-4 text-muted-foreground transition-all duration-300 group-hover:text-primary" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
ModernAccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const ModernAccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="accordion-content overflow-hidden text-muted-foreground transition-all duration-300 ease-out data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-6 pt-0 text-fluid-base leading-relaxed", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
))
ModernAccordionContent.displayName = AccordionPrimitive.Content.displayName

export { 
  ModernAccordion, 
  ModernAccordionItem, 
  ModernAccordionTrigger, 
  ModernAccordionContent 
}

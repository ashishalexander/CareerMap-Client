// /components/ui/container.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
  size?: "default" | "sm" | "lg" | "full"
  children: React.ReactNode
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, as: Component = "div", size = "default", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full",
          size === "default" && "max-w-7xl px-4 sm:px-6 lg:px-8",
          size === "sm" && "max-w-5xl px-4 sm:px-6 lg:px-8",
          size === "lg" && "max-w-screen-2xl px-4 sm:px-6 lg:px-8",
          size === "full" && "px-4 sm:px-6 lg:px-8",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Container.displayName = "Container"

export { Container }
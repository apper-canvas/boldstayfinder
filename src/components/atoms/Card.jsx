import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  hover = true,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-card shadow-card",
        hover && "card-hover cursor-pointer",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
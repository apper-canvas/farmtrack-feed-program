import React from "react";
import { cn } from "@/utils/cn";

const Card = ({ children, className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-white border border-gray-100 shadow-md hover:shadow-lg",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg hover:shadow-xl",
    primary: "bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 shadow-lg hover:shadow-xl",
    accent: "bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 shadow-lg hover:shadow-xl"
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
"use client";

import React from "react";

// Grid component with pre-defined classes
export function Grid({ 
  children, 
  columns = { sm: 2, md: 3, lg: 3 }, 
  gap = 4,
  className = ""
}: {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: number;
  className?: string;
}) {
  // Build classes based on props using only predefined classes
  let columnsClass = "";
  let gapClass = "";
  
  // Set column classes
  if (columns.sm === 1) columnsClass += "grid-cols-1 ";
  else if (columns.sm === 2) columnsClass += "grid-cols-2 ";
  else if (columns.sm === 3) columnsClass += "grid-cols-3 ";
  else if (columns.sm === 4) columnsClass += "grid-cols-4 ";
  else columnsClass += "grid-cols-2 ";
  
  if (columns.md === 1) columnsClass += "md:grid-cols-1 ";
  else if (columns.md === 2) columnsClass += "md:grid-cols-2 ";
  else if (columns.md === 3) columnsClass += "md:grid-cols-3 ";
  else if (columns.md === 4) columnsClass += "md:grid-cols-4 ";
  else columnsClass += "md:grid-cols-3 ";
  
  if (columns.lg === 1) columnsClass += "lg:grid-cols-1";
  else if (columns.lg === 2) columnsClass += "lg:grid-cols-2";
  else if (columns.lg === 3) columnsClass += "lg:grid-cols-3";
  else if (columns.lg === 4) columnsClass += "lg:grid-cols-4";
  else columnsClass += "lg:grid-cols-3";
  
  // Set gap class
  if (gap === 1) gapClass = "gap-1";
  else if (gap === 2) gapClass = "gap-2";
  else if (gap === 3) gapClass = "gap-3";
  else if (gap === 4) gapClass = "gap-4";
  else if (gap === 5) gapClass = "gap-5";
  else if (gap === 6) gapClass = "gap-6";
  else gapClass = "gap-4";
  
  return (
    <div className={`grid ${columnsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}

// GridItem component
export function GridItem({ 
  children,
  className = "",
  onClick
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

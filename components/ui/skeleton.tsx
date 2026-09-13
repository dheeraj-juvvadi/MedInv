import React from "react";

const Skeleton = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`animate-pulse bg-muted rounded-md ${className}`}
    {...props}
  />
);

export { Skeleton };

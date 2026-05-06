import React from "react";

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse bg-faint/50 rounded-[2px] ${className}`}
      {...props}
    />
  );
};

export default Skeleton;

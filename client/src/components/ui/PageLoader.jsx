import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-2000 bg-cream flex flex-col items-center justify-center grain">
      <div className="w-[200px] h-px bg-rule relative overflow-hidden">
        <div className="absolute inset-0 bg-ink animate-marquee origin-left" />
      </div>
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted animate-pulse">
        Initializing System...
      </div>
    </div>
  );
};

export default PageLoader;

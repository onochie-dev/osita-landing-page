"use client";

export function GlobeVisualization() {
  return (
    <div className="relative w-full h-full flex items-center justify-end overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1765046255479-669cf07a0230?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwZ3JpZCUyMHdpcmVmcmFtZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY2MzQ2MTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Digital grid visualization"
        className="w-[120%] h-full object-cover object-right grayscale opacity-90"
      />
    </div>
  );
}




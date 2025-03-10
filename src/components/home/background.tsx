"use client";
import React, { useState, useEffect } from "react";

export default function Background() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full z-0">
      <video autoPlay loop muted className="w-full h-full object-cover fixed">
        <source src="home_video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

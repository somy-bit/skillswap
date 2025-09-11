"use client";

import { Loader2 } from "lucide-react"; // optional spinner icon from lucide
import React from "react";

interface LoadingOverlayProps {
  show: boolean;
}

const Loading: React.FC<LoadingOverlayProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-indigo-600/20 bg-opacity-50 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
};

export default Loading;

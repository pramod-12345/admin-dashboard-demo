"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopBar({ isMobileOpen, setIsMobileOpen }: { isMobileOpen: boolean; setIsMobileOpen: (open: boolean) => void }) {
  const [userName, setUserName] = useState("");

  const handleLogout = () => {

  };

  return (
    <div className="h-12 sidebar-gradient border-b border-gray-700 flex items-center justify-between px-3 fixed top-0 left-0 lg:left-56 right-0 z-10">
      {/* Left side - Logo and Facebook */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className=" flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar text-sidebar-foreground lg:hidden"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Right side - Icons and user */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <button className="text-gray-300 hover:text-white transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        {/* User profile */}
        <button className="text-gray-300 hover:text-white transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>

        {/* Username */}
        <span className="text-white text-xs font-medium">{userName}</span>

      </div>
    </div>
  );
}


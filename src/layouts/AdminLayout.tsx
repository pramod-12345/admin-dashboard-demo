import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/AdminSidebar";
import TopBar from "./TopBar";
import { useState } from "react";

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1">
        <TopBar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
        <main className="h-full overflow-auto">
          <div className="container mx-auto max-w-7xl px-6 pb-6 pt-16 lg:px-8 pt-18  ">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

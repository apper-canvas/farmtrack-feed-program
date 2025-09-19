import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 shadow-sm">
          <nav className="flex-1 px-4 py-6 space-y-1">
            {/* Navigation will be moved here from Header */}
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
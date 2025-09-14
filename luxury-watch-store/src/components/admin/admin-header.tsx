"use client";

import { Bell, User } from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-white">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-yellow-600 rounded-full flex items-center justify-center">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Admin"}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User className="h-4 w-4 text-black" />
              )}
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">{user?.name}</div>
              <div className="text-gray-400">{user?.email}</div>
            </div>
          </div>
          <SignOutButton variant="ghost" />
        </div>
      </div>
    </header>
  );
}
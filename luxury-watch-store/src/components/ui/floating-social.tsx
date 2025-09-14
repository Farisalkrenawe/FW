"use client";

import React, { useState } from 'react';
import { Share2, Instagram, Facebook, Music } from 'lucide-react';

interface SocialLink {
  platform: 'instagram' | 'facebook' | 'tiktok';
  url: string;
}

interface FloatingSocialProps {
  socialLinks: SocialLink[];
}

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music, // Using Music icon for TikTok
};

const socialColors = {
  instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500',
  facebook: 'bg-blue-600 hover:bg-blue-700',
  tiktok: 'bg-black hover:bg-gray-800',
};

export function FloatingSocial({ socialLinks }: FloatingSocialProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Social Media Buttons - Slide up when open */}
      <div className={`flex flex-col space-y-3 transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
        {socialLinks.map((link, index) => {
          const Icon = socialIcons[link.platform];
          return (
            <button
              key={link.platform}
              onClick={() => handleSocialClick(link.url)}
              className={`${socialColors[link.platform]} text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center`}
              style={{ transitionDelay: `${index * 50}ms` }}
              aria-label={`Follow us on ${link.platform}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`mt-3 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${isOpen ? 'rotate-45' : 'rotate-0'}`}
        aria-label="Social media links"
      >
        <Share2 className="h-6 w-6" />
      </button>

      {/* Floating Labels */}
      {isOpen && (
        <div className="absolute bottom-0 left-16 flex flex-col space-y-3 pointer-events-none">
          {socialLinks.map((link, index) => (
            <div
              key={`label-${link.platform}`}
              className="bg-black/80 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap opacity-0 animate-in slide-in-from-left duration-300"
              style={{ 
                animationDelay: `${(index + 1) * 100}ms`,
                animationFillMode: 'forwards',
                transform: `translateY(${64 + (index * 52)}px)`
              }}
            >
              Follow us on {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-white font-black text-2xl">P</span>
        </div>
        <div className="spinner mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">PakBooking</h2>
        <p className="text-gray-400">Loading amazing hotels...</p>
      </div>
    </div>
  );
} 
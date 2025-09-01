'use client';

import { redirect } from 'next/navigation';
import React from 'react';

export const HomePage = () => {
    const handleButtonClick = ()=>{
        redirect("/videos")
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-center space-y-8">
        {/* Main title for the application */}
        <h1 className="text-5xl md:text-7xl font-bold font-inter tracking-tight">
          Welcome to <span className="text-blue-400">Stream-Hub</span>
        </h1>
        {/* Subtitle or tagline */}
        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Your one-stop destination for seamless video streaming. Dive into a world of endless entertainment.
        </p>
        
        {/* Container for the action buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
          {/* Sign In button */}
          <button
          onClick={handleButtonClick}
            className="w-full sm:w-auto px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300
                       bg-white text-black hover:bg-blue-400 hover:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Sign In
          </button>
          {/* Sign Up button */}
          <button
          onClick={handleButtonClick}
            className="w-full sm:w-auto px-8 py-3 rounded-full text-lg font-medium transition-colors duration-300
                       bg-transparent text-white border-2 border-white
                       hover:bg-blue-400 hover:border-blue-400
                       focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

// export default HomePage;

'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#F9FAFB] border-t border-gray-200 px-4 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-center gap-3 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} <span className="relative inline-block">
          <span className="relative z-10 px-1 font-extrabold">ReadLess AI.</span>
          <span
            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-md transform -skew-y-1"
            aria-hidden="true"
          ></span>
        </span> All rights reserved.</p>
        <p>
          Built with ❤️ by{' '}
          <a
            href="https://ismaeeldev.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-700 hover:text-pink-600 transition-colors"
          >
            Muhammad Ismaeel
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

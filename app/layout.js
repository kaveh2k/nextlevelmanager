"use client"
import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "../components/menu/sideMenu/Menu"; // Ensure this path is correctly pointing to your Menu component

const inter = Inter({ subsets: ["latin"] });
// TODO: fix and update / add meta data/ update favicon 

export default function RootLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Adjust this value as per your requirement
        setIsMenuOpen(false);
      } else {
        setIsMenuOpen(true);
      }
    };

    // Call the handleResize function initially
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount
  const [isLoading, setIsLoading] = useState(true);



  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} flex h-full overflow-hidden bg-gray-200`}>
        {/* Flex container for menu and content */}
        <div className="flex h-full w-full">
          {/* Menu Column */}
          <div className={`flex-initial transition-all duration-500 ${isMenuOpen ? 'w-44' : 'w-12'} bg-gray-800 text-white`}>
            <Menu isMenuOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          </div>

          {/* Gap */}
          <div className="w-[5px] bg-gray-200"></div>

          {/* Content Column */}
          <div className={`flex-auto transition-all duration-500 overflow-auto`}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

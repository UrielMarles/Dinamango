"use client";

import '../styles/globals.css';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer/footer';
import { ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');

    setIsLoggedIn(!!token);
  }, []);

  return (
    <html lang="en">
      <body>
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="main-content">{children}</main>
        <Toaster position='top-right'/>
        <Footer />
      </body>
    </html>
  );
}

// app/layout.tsx
"use client";

import '../styles/globals.css';
import Navbar from '../components/navbar/navbar'; // Importa tu componente Navbar
import Footer from '../components/footer/footer'; // Importa tu componente Footer
import { ReactNode, useEffect, useState } from 'react';

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
        <br></br>
        <br></br>
        <Footer />
      </body>
    </html>
  );
}

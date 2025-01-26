// app/layout.tsx
import '../styles/globals.css';
import Navbar from '../components/navbar/navbar'; // Importa tu componente Navbar
import { ReactNode } from 'react';

export const metadata = {
  title: 'Moni',
  description: 'Aplicación Next.js con barra de navegación adaptable',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const isLoggedIn = false;
  return (
    <html lang="en">
      <body>
        <Navbar isLoggedIn={isLoggedIn} />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}

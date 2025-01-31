// app/home/page.tsx

import '../../styles/globals.css';
import LoginForm from '@/components/testMaterial/testMaterial';
export const metadata = {
  title: 'Inicio',
  description: 'Página de inicio de la aplicación',
};

export default function Home() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}
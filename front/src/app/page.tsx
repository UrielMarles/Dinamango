import type { Metadata } from 'next';
import Image from 'next/image';
import style from './inicio.module.css';

export const metadata: Metadata = {
  title: "Dinamango",
  description: "La plataforma que te ayuda con lo que necesitas",
};

export default function Home() {
  return (
    <>
      <main className={style.main}>
        <div>
          <h1>Dinamango</h1>
          <Image 
            src={"/logo.png"}
            alt="Logo de Dinamango"
            width={300}
            height={300}
          />
        </div>

      </main>
    </>
  );
}

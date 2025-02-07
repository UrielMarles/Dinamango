"use client";

import Image from 'next/image';
import style from './inicio.module.css'; 

export const meta = {
  title: "Dinamango",
  description: "La plataforma que te ayuda con lo que necesitas",
}

export default function Home() {
  return (
    <>
    <div className={style.header}>
      <h1> Bienvenidos a Dinamango</h1>
      <h3>La plataforma que te ayuda con lo que necesitas</h3>
    </div>
    <main className={style.container}>
      <div className={style.card}>
        <div className={`${style.text} ${style.left}`}>
          <p>Emprende gratis</p> 
          <p>compartiendo tu proyecto</p> 
          <p>sin costo</p>
        </div>
        <div className={`${style.image} ${style.right}`}>
          <Image
            src="/gpt_logo.png"
            alt="Logo de la aplicación"
            width={450}
            height={450}
          />
        </div>
      </div>
      <div className={style.card}>
        <div className={`${style.image} ${style.left}`}>
          <Image
            src="/gpt_logo.png"
            alt="Logo de la aplicación"
            width={450}
            height={450}
          />
        </div>
        <div className={`${style.text} ${style.right}`}>
          <p>Publica lo que vos quieras</p> 
          <p>en segundos</p>
        </div>
      </div>
    </main>
    </>
  );
}

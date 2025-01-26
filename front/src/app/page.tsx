"use client";
import Image from 'next/image';

export default function Home() {
  const handleClick = () => {
    console.log('hola');
  };

  return (
    <div className="home-container">
      <br></br>
      <h1>Bienvenido a MONI</h1>
      <Image 
        src="/gpt_logo.png" 
        alt="Logo de la aplicación" 
        width={200} 
        height={200} 
      />
      <button onClick={handleClick} className="btn">
        BOTON DE PRUEBA
      </button>
    </div>
  );
}

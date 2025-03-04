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
<<<<<<< HEAD
    <main className={style.main}>
      <section className={style.contenidoInicial}>
        <div className={style.textoInicial}>
          <p>Publica lo que vos quieras en segundos.</p>
          <p>Ahorrate horas en buscar gente, papeleo y completa tus tareas.</p>
          <ol className={style.lista}>
            <li>Describe brevemente lo que necesitas.</li>
            <li>Presenta tu presupuesto.</li>
            <li>Recibe las ofertas y elegí el que mas te guste.</li>
          </ol>
        </div>
        <div>
          <Image className={style.img} src="/img/emprendedor.webp" alt="emprendedor" width={500} height={500} objectFit="cover" />
        </div>
      </section>
      <section className={style.contenidoMitad}>
        <div className={style.textoMitad}>
          <p>Tu proxima oportunidad, con seguridad y confianza</p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Plataforma de pagos. Todas las transacciones hechas en Dinamango con 100% seguras.  
          </p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Confia en quien contratas.
          </p>
          <p>En nuestra plataforma podras ver la certificación de cada uno de tus contratados, además de experiencia comprobable dentro o fuera de la aplicación</p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Podés contratar el seguro para tener cubierta de cualquier eventualidad.
          </p>
          <button>Publica tu Proyecto</button>
        </div>
        <div>
          <Image className={style.img} src="/img/hombreFeliz.webp" alt="Logo de la aplicación" width={450} height={450} objectFit="cover" />
        </div>
      </section>
      <section className={style.contenidoFinal}>
        <div className={style.textoFinal}>
          <p>Se tu propio jefe</p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Seas carpintero experto o un oficinista aplicadom encontra tu proxima aventura con Diamango.
          </p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Acceso gratuito a miles de empleos.
          </p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Sin suscripciones omovimientos fuera de la aplicacion.
          </p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Ganá dinero extra en una agenda flexible.
          </p>
          <p>
            <Image src="/icons/check.webp" alt="Check" width={40} height={40} objectFit="cover" />
            Crece laboralmente y mejora tu red de contactos.
          </p>
          <button>Gana con Dinamango</button>
        </div>
        <div>
          <Image className={style.img} src="/img/trabajador.webp" alt="Trabajador" width={500} height={500} objectFit="cover" />
        </div>
      </section>
    </main>
=======
      <div className={style.header}>
        <h1>Bienvenidos a Dinamango</h1>
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
>>>>>>> 2ef0f83c00854a1cad5e9881f0ef649c5fa7d615
    </>
  );
}

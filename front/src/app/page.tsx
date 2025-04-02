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
        <div className={style.contenedorTitle}>
          <h1 className={style.title}>Dinamango</h1>
          <div className={style.imgUno}>
            <Image
              src={"/img/1raHome.png"}
              alt="Negociación"
              width={600}
              height={600}
            />
          </div>
        </div>

        <div className={style.interes}>
          <p>Dinamango asegura las mejores condiciones para que puedas resolver problemas con facilidad</p>
          <button>ME INTERESA</button>
        </div>

        <div className={style.seccionDos}>
          <Image
            src={"/img/2daHome.avif"}
            alt="Trabajdores"
            width={500}
            height={500}
          />

          <div className={style.oportunidad}>
            <p>Tu próxima oportunidad, con seguridad y confianza</p>
            <ul>
              <li>Plataforma de pagos. Todas las transacciones hechas con Dinamango son 100% seguras.</li>
              <li>Confía en quien contratas.</li>
              <li>En nuestra plataforma podrás ver la certificación de cada uno de tus contratados, además de experiencia comprobable de la aplicación.</li>
              <li>Podés contratar el seguro para tener cubierta cualquier eventualidad.</li>
            </ul>
          </div>
        </div>

        <button className={style.btnPublicar}>PUBLICA TU PROYECTO</button>

        <div className={style.seccionTres}>
          <div className={style.propioJefe}>
            <p>Se tu propio jefe</p>
            <ul>
              <li>Seas carpintero experto o un oficinista aplicado encontra tu próxima aventura con Dinamango.</li>
              <li>Acceso a miles de empleos.</li>
              <li>Sin suscripciones o movimientos fuera de la aplicación.</li>
              <li>Ganá dinero extra en una agenda flexible.</li>
              <li>Crece laboralmente y mejora tu red de contactos.</li>
            </ul>
          </div>

          <Image
            src={"/img/3raHome.png"}
            alt="Planeación"
            width={1080}
            height={720}

            className={style.imgTres}
          />
        </div>

        <button className={style.btnGanar}>GANA CON DINAMANGO</button>
      </main>
    </>
  );
}

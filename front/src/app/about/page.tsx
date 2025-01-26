// app/about/page.tsx
import Image from 'next/image';
import styles from './about.module.css';
import '../../styles/globals.css';

export const metadata = {
  title: 'Sobre Nosotros',
  description: 'Información sobre Moni',
};

export default function about() {
  return (
    <main>
      <div className={styles.container}>
        <div className={styles.texto}>
          <div className={styles.titulo}>
            <label>Si te falta <span id="money">money</span>, estás en el lugar correcto</label>
          </div>
          <div className={styles.descripcion}>
            <label>Conéctate con gente para hacer unas changas y ganar <span id="money">money</span> en el proceso</label>
          </div>
        </div>
        <Image src="/gpt_logo.png" alt="Logo de la aplicación" width={450} height={450}/>
      </div>
    </main>
  );
}

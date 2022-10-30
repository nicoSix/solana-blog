import Head from 'next/head';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Head>
          <title>Solblogs</title>
          <meta name="description" content="Solblogs application" />
          <link rel="icon" href="/icon.png" />
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://github.com/nicoSix/solblogs">Solblogs</a>!
          </h1>
        </main>

        <footer className={styles.footer}>
          Nicolas Six, 2022
        </footer>
      </div>
    </>
  )
}

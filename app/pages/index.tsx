import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getOwner } from './api/solana/blogs';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from '../styles/Home.module.css';
import Workspace from './lib/solana/Workspace';

export default function Home() {
  const wallet = useAnchorWallet();
  const [workspace, setWorkspace] = useState<Workspace | null>();
  
  useEffect(() => {
    if (wallet) {
      setWorkspace(new Workspace(wallet));
    } else {
      setWorkspace(undefined);
    }
  }, [wallet]);

  const handleGetOwner = () => {
    if (workspace) {
      console.log(getOwner());
    }
  };

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

        <button onClick={handleGetOwner}><i>Test!</i></button>

        <footer className={styles.footer}>
          Nicolas Six, 2022
        </footer>
      </div>
    </>
  )
}

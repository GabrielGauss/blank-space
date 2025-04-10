import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>🗒️ BENTO</h1>
    </header>
  );
}
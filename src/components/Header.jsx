import React, { memo } from 'react';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.container}>
      <h1 className={styles.title}>Banker&apos;s Algorithm</h1>
      <span className={styles.author}>B18030620</span>
    </header>
  );
}

export default memo(Header);

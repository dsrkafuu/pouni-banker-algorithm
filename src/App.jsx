import React, { memo } from 'react';
import styles from './App.module.scss';

function App() {
  return (
    <div className='app'>
      <header className={styles.header}>
        <h1>Banker's Algorithm</h1>
        <span>B18030620</span>
      </header>
      <main></main>
      <footer></footer>
    </div>
  );
}

export default memo(App);

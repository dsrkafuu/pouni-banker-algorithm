import React, { memo } from 'react';
import styles from './Control.module.scss';
import { Button, Slider } from 'antd';

function Control({ resources, onResourcesChange, onProcessAdd }) {
  return (
    <div className={styles.control}>
      <div className={styles.resource}>
        <span>总资源数</span>
        <Slider value={resources} onChange={onResourcesChange} min={1} max={5} />
      </div>
      <div className={styles.add}>
        <Button onClick={onProcessAdd}>添加进程</Button>
      </div>
      <div className={styles.status}>
        <span>当前状态</span>
        <span></span>
      </div>
    </div>
  );
}

export default memo(Control);

import React, { memo } from 'react';
import styles from './Control.module.scss';
import { Button, Slider } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone } from '@ant-design/icons';

function Control({ resNum, onResNumChange, onProcessAdd, status }) {
  return (
    <div className={styles.control}>
      <div className={styles.resource}>
        <span>总资源数</span>
        <Slider value={resNum} onChange={onResNumChange} min={1} max={5} />
      </div>
      <div className={styles.add}>
        <Button onClick={onProcessAdd}>添加进程</Button>
      </div>
      <div className={styles.status}>
        <span>当前状态</span>
        <span>
          {status === null ? (
            <MinusCircleTwoTone />
          ) : status ? (
            <CheckCircleTwoTone twoToneColor='#52c41a' />
          ) : (
            <CloseCircleTwoTone twoToneColor='#ff4d4f' />
          )}
        </span>
      </div>
    </div>
  );
}

export default memo(Control);

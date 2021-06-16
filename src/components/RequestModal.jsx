import React, { memo, useCallback, useState } from 'react';
import { Modal, InputNumber } from 'antd';
import styles from './RequestModal.module.scss';
import { cloneDeep } from '../utils/lodash';

/**
 * 设置弹出模态框
 */
function RequestModal({ visible = false, title = '', num, min, onOk, onCancel }) {
  const [values, setValues] = useState([]);

  /**
   * 响应数值修改
   */
  const handleValueChange = useCallback(
    (idx, itemVal) => {
      setValues((val) => {
        const ret = cloneDeep(val);
        ret.length = num;
        ret[idx] = itemVal;
        return ret;
      });
    },
    [num]
  );

  /**
   * 响应确认按钮
   */
  const handleOk = useCallback(() => {
    const ret = cloneDeep(values);
    for (let i = 0; i < num; i++) {
      if (!ret[i]) {
        ret[i] = 0;
      }
    }
    onOk(ret);
    setValues(new Array(num)); // 清空
  }, [num, onOk, values]);

  const handleCancel = useCallback(() => {
    onCancel();
    setValues(new Array(num)); // 清空
  }, [num, onCancel]);

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      className={styles.modal}
    >
      {new Array(num).fill(true).map((item, idx) => {
        return (
          <InputNumber
            min={min === undefined ? null : 0}
            key={idx}
            onChange={(val) => handleValueChange(idx, val)}
            value={values[idx] || 0}
          />
        );
      })}
    </Modal>
  );
}

export default memo(RequestModal);

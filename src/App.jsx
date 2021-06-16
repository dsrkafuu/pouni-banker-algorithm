import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, message, Table } from 'antd';

import styles from './App.module.scss';

import Header from './components/Header';
import Control from './components/Control';
import RequestModal from './components/RequestModal';

import { cloneDeep } from './utils/lodash';
import { modArrayLength, addArray } from './utils/array';
import { renderInt } from './utils/render';
import Banker from './utils/Banker';

function App() {
  // 资源种类数
  const [resNum, setResNum] = useState(3);

  // 总可用量
  const [avail, setAvail] = useState(new Array(resNum));
  useEffect(() => setAvail((val) => modArrayLength(val, resNum)), [resNum]);
  // 总已分配量
  const [alloced, setAlloced] = useState(new Array(resNum));
  useEffect(() => setAlloced((val) => modArrayLength(val, resNum).fill(0)), [resNum]);

  // 各进程数据
  const [data, setData] = useState([]);
  // 响应资源种类变化
  useEffect(() => {
    setData((val) => {
      val.forEach((item) => {
        item[0] = modArrayLength(item[0], resNum);
        item[1] = new Array(resNum);
      });
      return val;
    });
  }, [resNum]);
  /**
   * 响应进程添加
   */
  const handleProcessAdd = useCallback(() => {
    setData((val) => {
      const procNum = data.length;
      if (val.length === procNum) {
        const arr = modArrayLength(val, procNum + 1);
        for (let i = val.length; i < procNum + 1; i++) {
          arr[i] = [new Array(resNum), new Array(resNum)];
        }
        return arr;
      } else {
        return val;
      }
    });
  }, [data.length, resNum]);

  // 设置模态框状态 (-1) (0) (1+)
  const [curSetModal, setCurSetModal] = useState(-1);
  /**
   * 响应设置模态框确认
   */
  const handleSetModalOk = useCallback(
    (values) => {
      // 总量
      if (curSetModal === 0) {
        setAvail(values);
      }
      // 各进程最大量
      else if (curSetModal > 0) {
        setData((val) => {
          const ret = cloneDeep(val);
          ret[curSetModal - 1][0] = values;
          return ret;
        });
      }
      setCurSetModal(-1);
    },
    [curSetModal]
  );
  // 申请模态框状态 (-1) (1+)
  const [curReqModal, setCurReqModal] = useState(-1);
  /**
   * 响应申请模态框确认
   */
  const handleReqModalOk = useCallback(
    (values) => {
      // 申请成功状态
      let status = true;
      // 设置当前进程申请量
      setData((val) => {
        const ret = cloneDeep(val);
        const added = addArray(ret[curReqModal - 1][1], values, ret[curReqModal - 1][0]);
        console.log(ret[curReqModal - 1][1], values, ret[curReqModal - 1][0]);
        status = added.status;
        if (status) {
          ret[curReqModal - 1][1] = added.res;
          return ret;
        } else {
          return val;
        }
      });
      // 设置总申请量
      setAlloced((val) => {
        const added = addArray(val, values, avail);
        status = status && added.status;
        if (status) {
          return added.res;
        } else {
          return val;
        }
      });
      // 关闭模态框
      if (status) {
        message.success('已分配资源');
        setCurReqModal(-1);
      } else {
        message.error('资源不足');
      }
    },
    [avail, curReqModal]
  );

  // 银行家计算
  const [status, setStatus] = useState(null);
  const [orders, setOrders] = useState([0]);
  /**
   * 自动触发计算
   */
  useEffect(() => {
    const banker = new Banker(data.length, resNum, avail, data);
    setStatus(banker.get().status);
    if (banker.get().status) {
      const ord = [0];
      const query = banker.get().query;
      for (let i = 0; i < data.length; i++) {
        ord.push(query.indexOf(i) + 1);
      }
      setOrders(ord);
    } else {
      setOrders([0]);
    }
  }, [avail, data, resNum]);

  // 资源数据
  const dataSource = [{ key: 'total', name: '总资源数', max: avail, alloc: alloced, order: 0 }];
  data.forEach((process, idx) => {
    dataSource.push({
      key: `p${idx}`,
      name: `P${idx}`,
      max: process[0],
      alloc: process[1],
      order: orders[idx + 1],
    });
  });

  // 表格列
  const columns = [
    { title: '进程', dataIndex: 'name', key: 'name', align: 'center', width: '6rem' },
  ];
  for (let i = 0; i < resNum; i++) {
    columns.push({
      title: i === 0 ? '最多' : null,
      colSpan: i === 0 ? resNum : 0,
      dataIndex: ['max', i],
      key: `max${i}`,
      align: 'center',
      render: renderInt,
    });
  }
  for (let i = 0; i < resNum; i++) {
    columns.push({
      title: i === 0 ? '分配' : null,
      colSpan: i === 0 ? resNum : 0,
      dataIndex: ['alloc', i],
      key: `alloc${i}`,
      align: 'center',
      render: renderInt,
    });
  }
  columns.push(
    {
      title: '控制',
      key: 'ctrl',
      align: 'center',
      width: '12rem',
      render(text, rec, idx) {
        return (
          <>
            <Button size='small' onClick={() => setCurSetModal(idx)}>
              设置{idx === 0 ? '总量' : '最多'}
            </Button>
            <Button size='small' disabled={idx === 0} onClick={() => setCurReqModal(idx)}>
              申请资源
            </Button>
          </>
        );
      },
    },
    {
      title: '顺序',
      key: 'order',
      dataIndex: 'order',
      align: 'center',
      width: '4rem',
      render: renderInt,
    }
  );

  return (
    <div className={styles.container}>
      <Header />
      <main>
        <Control
          resNum={resNum}
          onResNumChange={(val) => setResNum(val)}
          onProcessAdd={handleProcessAdd}
          status={status}
        />
        <div className={styles.data}>
          <Table
            dataSource={dataSource}
            columns={columns}
            size='middle'
            bordered={true}
            pagination={false}
          />
        </div>
        <RequestModal
          visible={curSetModal >= 0}
          title='设置资源数'
          num={resNum}
          min={0}
          onOk={handleSetModalOk}
          onCancel={() => setCurSetModal(-1)}
        />
        <RequestModal
          visible={curReqModal > 0}
          title='申请资源数'
          num={resNum}
          onOk={handleReqModalOk}
          onCancel={() => setCurReqModal(-1)}
        />
      </main>
    </div>
  );
}

export default memo(App);

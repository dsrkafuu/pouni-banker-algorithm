import React, { memo, useEffect, useState } from 'react';
import styles from './App.module.scss';
import Header from './components/Header';
import Control from './components/Control';
import { cloneDeep } from './utils/lodash';
import { Button, Table } from 'antd';

/**
 * 调整数组长度
 * @param {any[]} arr
 * @param {number} length
 * @returns {any[]}
 */
function modArrayLength(arr, length) {
  let newArr;
  if (arr.length >= length) {
    newArr = cloneDeep(arr.slice(0, length));
  } else {
    newArr = [...cloneDeep(arr), ...new Array(length - arr.length)];
  }
  return newArr;
}

/**
 * 渲染整数
 * @param {number} val
 * @returns {string|number}
 */
function renderInt(val) {
  if (!val) {
    return '-';
  }
  return val;
}

function App() {
  // 资源种类数
  const [resNum, setResNum] = useState(3);

  // 总可用量
  const [avail, setAvail] = useState(new Array(resNum));
  useEffect(() => setAvail((val) => modArrayLength(val, resNum)), [resNum]);
  // 总已分配量
  const [alloced, setAlloced] = useState(new Array(resNum));
  useEffect(
    () =>
      setAlloced((val) => {
        const arr = modArrayLength(val, resNum);
        arr.fill(0);
        return arr;
      }),
    [resNum]
  );

  // 各进程数据
  const [data, setData] = useState([]);
  // 响应进程添加
  const addProcess = () => {
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
  };
  // 响应资源种类变化
  useEffect(
    () =>
      setData((val) => {
        const newVal = cloneDeep(val);
        newVal.forEach((item, idx) => {
          item[0] = modArrayLength(item[0], resNum);
          item[1] = new Array(resNum);
        });
        return newVal;
      }),
    [resNum]
  );

  const dataSource = [{ key: 'total', name: '总资源数', max: avail, alloc: alloced, order: '-' }];
  data.forEach((process, idx) => {
    dataSource.push({
      key: `p${idx}`,
      name: `P${idx}`,
      max: process[0],
      alloc: process[1],
      order: '-',
    });
  });

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
            <Button size='small'>设置{idx === 0 ? '总量' : '最多'}</Button>
            <Button size='small' disabled={idx === 0}>
              申请资源
            </Button>
          </>
        );
      },
    },
    {
      title: '顺序',
      key: 'ctrl',
      align: 'center',
      width: '4rem',
      render: renderInt,
    }
  );

  return (
    <div className='app' className={styles.container}>
      <Header />
      <main>
        <Control
          resources={resNum}
          onResourcesChange={(val) => setResNum(val)}
          onProcessAdd={addProcess}
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
      </main>
      <footer></footer>
    </div>
  );
}

export default memo(App);

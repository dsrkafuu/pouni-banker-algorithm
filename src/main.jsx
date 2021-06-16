import React from 'react';
import ReactDOM from 'react-dom';
import 'modern-normalize-cjk';
import 'antd/dist/antd.css';
import './global.scss';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale/zh_CN';
import App from './App';

ReactDOM.render(
  <ConfigProvider locale={zh_CN}>
    <App />
  </ConfigProvider>,
  document.getElementById('root')
);

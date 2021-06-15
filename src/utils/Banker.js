import { cloneDeep } from './lodash';

class Banker {
  /**
   * @param {number} processes 总进程数
   * @param {number} resources 总资源数
   * @param {number[]} quants 各资源总量数组
   */
  constructor(processes, resources, quants) {
    // 总量
    this.processes = processes;
    this.resources = resources;
    this.quants = cloneDeep(quants);
    // 状态
    this.maxes = []; // 各进程最大资源数组集
    this.allocs = []; // 各进程当前分配数组集
  }

  /**
   * 添加一个进程
   * @param {number[]} maxes 该进程最大资源数组
   * @param {number[]} allocs 该进程当前分配数组
   */
  addProcess(maxes, allocs) {
    // 检查输入
    if (maxes.length !== this.resources || allocs.length !== this.resources) {
      throw new Error('添加进程资源数设置错误');
    }
    // 检查当前总可用资源
    for (let i = 0; i < this.resources; i++) {
      if (this.quants[i] < allocs[i]) {
        return { status: 'ERROR_' };
      }
    }
    // 添加进程
    this.maxes.push(cloneDeep(maxes));
    this.allocs.push(cloneDeep(allocs));
  }

  /**
   * 移除一个进程
   * @param {number} idx
   */
  removeProcess(idx) {
    this.maxes.splice(idx, 1);
    this.allocs.splice(idx, 1);
  }
}

export default Banker;

import { cloneDeep } from './lodash';

class Banker {
  /**
   * @param {number} procNum 总进程数
   * @param {number} resNum 总资源数
   * @param {number[]} resQuants 各资源总量数组
   * @param {number[][]} data 各进程最大资源量和已分配量
   */
  constructor(procNum, resNum, resQuants, data) {
    // 总量
    this.procNum = procNum;
    this.resNum = resNum;
    this.resQuants = cloneDeep(resQuants);
    // 各进程最大资源数组集
    this.maxes = (() => {
      const ret = [];
      for (let i = 0; i < procNum; i++) {
        ret.push(cloneDeep(data[i][0]));
      }
      return ret;
    })();
    // 各进程当前分配数组集
    this.allocs = (() => {
      const ret = [];
      for (let i = 0; i < procNum; i++) {
        ret.push(cloneDeep(data[i][1]));
      }
      return ret;
    })();
    // 初始化各进程数据
    this._initData();
    // 保证数据正常
    this._ensureValidData();
    // 返回值缓存
    this.res = null;
    // 计算
    if (!this._checkInput()) {
      // 数据不全
      this.res = { status: null };
    } else {
      try {
        // 计算成功
        this._computeNeeds();
        this._computeWorks();
        this._computeSeq();
      } catch (e) {
        // 计算错误
        this.res = { status: null };
      }
    }
  }

  /**
   * 检查输入值是否完整
   * @returns {boolean}
   */
  _checkInput() {
    if (this.procNum < 1) {
      return false;
    }
    const totalRes = this.resQuants.reduce((preVal, curVal) => preVal + curVal, 0);
    if (totalRes < 1) {
      return false;
    }
    for (let i = 0; i < this.procNum; i++) {
      const totalMax = this.maxes[i].reduce((preVal, curVal) => preVal + curVal, 0);
      if (totalMax < 1) {
        return false;
      }
    }
    return true;
  }

  /**
   * 初始化数据
   */
  _initData() {
    // 各进程需求资源量
    this.needs = [];
    for (let i = 0; i < this.procNum; i++) {
      this.needs.push([]);
    }
    // 可用资源量
    this.works = new Array(this.resNum);
    // 是否已完成
    this.finishes = new Array(this.procNum);
    // 安全序列
    this.l = 0;
    this.bq = new Array(this.procNum);
  }

  /**
   * @private
   * 保证数据正常
   */
  _ensureValidData() {
    const ensureArray = (arr) => {
      for (let i = 0; i < arr.length; i++) {
        if (!arr[i]) {
          arr[i] = 0;
        }
      }
    };

    ensureArray(this.resQuants);
    for (let i = 0; i < this.procNum; i++) {
      ensureArray(this.maxes[i]);
    }
    for (let i = 0; i < this.procNum; i++) {
      ensureArray(this.allocs[i]);
    }
  }

  /**
   * @private
   * 计算各进程对资源的需求量
   */
  _computeNeeds() {
    //计算各进程对个资源的需求量
    for (let i = 0; i < this.procNum; i++) {
      this.needs[i] = [];
      for (let j = 0; j < this.resNum; j++) {
        this.needs[i][j] = this.maxes[i][j] - this.allocs[i][j];
      }
    }
  }

  /**
   * @private
   * 计算各进程对资源的可用量
   */
  _computeWorks() {
    for (let j = 0; j < this.resNum; j++) {
      this.works[j] = this.resQuants[j];
    }
    for (let i = 0; i < this.procNum; i++) {
      for (let j = 0; j < this.resNum; j++) {
        this.works[j] -= this.allocs[i][j];
      }
    }
  }

  /**
   * @private
   * 求安全序列
   */
  _computeSeq() {
    this.l = 0;

    // 初始化各进程的分配标志
    for (let i = 0; i < this.procNum; i++) {
      this.finishes[i] = false;
    }

    // 循环计算
    while (this.l < this.procNum) {
      let flag = false;
      for (let i = 0; i < this.procNum; i++) {
        if (this.finishes[i]) {
          continue;
        }
        let j;
        for (j = 0; j < this.resNum; j++) {
          if (this.needs[i][j] > this.works[j]) {
            break;
          }
        }
        if (j === this.resNum) {
          flag = true;
          this.bq[this.l] = i;
          this.l++;
          this.finishes[i] = true;
          for (let k = 0; k < this.resNum; k++) {
            this.works[k] += this.allocs[i][k];
          }
        }
      }
      if (!flag) {
        break;
      }
    }
  }

  /**
   * 获取计算结果
   * @returns {{ status: boolean|null, query: number[]|undefined }}
   */
  get() {
    if (this.res) {
      return this.res;
    } else {
      if (this.l === this.procNum) {
        const res = {
          status: true,
          query: [],
        };
        for (let i = 0; i < this.l; i++) {
          res.query.push(this.bq[i]);
        }
        this.res = res;
      } else {
        this.res = {
          status: false,
        };
      }
      return this.res;
    }
  }
}

export default Banker;

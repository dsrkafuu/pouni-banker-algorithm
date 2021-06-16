import { cloneDeep } from './lodash';

/**
 * 调整数组长度
 * @param {any[]} arr
 * @param {number} length
 * @returns {any[]}
 */
export function modArrayLength(arr, length) {
  let newArr;
  if (arr.length >= length) {
    newArr = cloneDeep(arr.slice(0, length));
  } else {
    newArr = [...cloneDeep(arr), ...new Array(length - arr.length)];
  }
  return newArr;
}

/**
 * 同长数组相加，最小为零，同时检查是否超限
 * @param {number[]} arr1
 * @param {number[]} arr2
 * @param {number[]} limit
 * @returns {{ status: boolean, res: number[]|undefined }}
 */
export function addArray(arr1, arr2, limit) {
  arr1 = cloneDeep(arr1);
  arr2 = cloneDeep(arr2);
  for (let i = 0; i < arr1.length; i++) {
    arr1[i] = (Number(arr1[i]) || 0) + (Number(arr2[i]) || 0);
    arr1[i] < 0 && (arr1[i] = 0);
    if (arr1[i] > (Number(limit[i]) || 0)) {
      return { status: false };
    }
  }
  return { status: true, res: arr1 };
}

// const arr1 = [11, 12, 13]
// const arr2 = [11, 45, 34, 13]
// const newArr = arr2.filter(val => {
//   return arr1.indexOf(val) === -1
// })
// console.log(newArr)

// const arr = [1, 2, 3, 2, 1, 1]
// console.log([...new Set(arr)])// [1, 2, 3

// const set = new Set()
// set.add(5)
// set.add('5')
// console.log([...set])
// const nums = [
//   [1, 2, 3],
//   [4, 5, 6],
//   [7, 8, 9]
// ]
// var arrs = nums.reduce(function (nums2, i) {
//   return nums2.concat(i)
// }, [])
// console.log(arrs.toString())// [1,2,3,4,5,6,7,8,9]
const arr = [1, 5, 2, 7, 3, 4]
const arr2 = arr.map(function (item, index) {
  return '<b>' + item + '</br>'
})
console.log(arr2)
console.log(arr)
// map对元素重新组装，形成新数组，不会改变原始数据

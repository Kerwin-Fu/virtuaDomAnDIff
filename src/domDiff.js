import { ATTR, TEXT, REPLACE, REMOVE } from './patchTypes'

let patches = {}, // 全局补丁包，每个节点处理完成之后会将其中所有变动放入其中，属性名就是处理节点的index
  vnIndex = 0

// 启动diff算法 需要传入新旧虚拟dom用于对比
function domDiff(oldVDom, newVDom) {
  // 初始化Index,调用主函数时传入
  let index = 0
  // 主函数，用于对比新旧虚拟dom的差异，根据不同点创建补丁包
  vNodeWalk(oldVDom, newVDom, index)
  // 完成后将最后的补丁包合集返回出去
  return patches
}
// diff算法主函数，用来对比差异，根据差异创建补丁包
// 同时也要处理所有children属性，children属性要递归这个函数
function vNodeWalk(oldNode, newNode, index) {
  // 创建一个补丁包，用来储存当前对比的虚拟节点的差异补丁
  let vnPatch = []
  // 首先判断用于对比的新节点存不存在，如果不存在，说明被删除，打上一个删除的补丁放入vnPatch
  if (!newNode) {
    vnPatch.push({
      type: REMOVE,
      index: index // 记录当前打补丁的节点序号
    })
  } 
  // 判断另一种典型的情况：旧节点是字符串，新节点也是字符串，只做了字符串的修改操作
  else if (typeof oldNode === 'string' && typeof newNode === 'string') {
    if (oldNode !== newNode) {
      vnPatch.push({
        type: TEXT,
        text: newNode // 将新字符串标记为更改的补丁
      })
    }
  } 
  // 如果新旧节点的标签类型完全相同，且不是字符串，就需要去对比他们的属性与children属性
  else if (oldNode.type === newNode.type) {
    // 通过一个遍历对比新旧节点属性的方法，取出属性值的补丁
    const attrPatch = attrsWalk(oldNode.props, newNode.props)
    // 然后判断这个属性补丁包中没有没值，（有则说明属性有变更，没有则跳过）
    if (Object.keys(attrPatch).length > 0) {
      vnPatch.push({
        type: ATTR,
        attrs: attrPatch // attrs接收一个对象，里面装有详细的属性变更条目
      })
    }
    // 通过下面的方法遍历该节点的children属性
    childrenWalk(oldNode.children, newNode.children)
  } 
  // 以上的情况都不符合，走最后一个替换节点的支线
  else {
    vnPatch.push({
      type: REPLACE,
      newNode // 新节点就是作替换用
    })
  }
  // 在以上所有情况都处理完成之后，判断装有所有该节点处理情况的补丁包是否有值（没有代表新旧节点没有任何更改）
  if (vnPatch.length > 0) {
    // 有值，将补丁包赋值到全局要导出的补丁包指定序号的属性下
    patches[index] = vnPatch
  }
}

// 处理属性的方法
function attrsWalk(oldAttrs, newAttrs) {
  // 首先创建一个储存属性变化的属性补丁包
  let attrPatch = {}
  // 遍历旧节点的属性 如果新节点的属性与旧节点的不同，说明这个属性值被修改了
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      // 属性补丁包中添加这个被修改的属性
      attrPatch[key] = newAttrs[key]
    }
  }
  // 然后遍历新节点的属性，如果在旧属性中没有这个属性，说明这个属性值是新增的
  for (let key in newAttrs) {
    if (!oldAttrs.hasOwnProperty(key)) {
      // 属性补丁包中添加这个新增的属性
      attrPatch[key] = newAttrs[key]
    }
  }
  // 处理完成之后将属性补丁包返回出去
  return attrPatch
}

// 递归处理children属性的方法
function childrenWalk(oldChildren, newChildren) {
  // 遍历children属性
  oldChildren.map((c, idx) => {
    // 对children属性下每个节点进行递归，使用vNodeWalk这个方法就行
    // 第三个index参数传入全局的vnIndex 并且让它每次都先自加 1
    // 这里为什么传vnIndex是个难点，因为遍历子节点属于深度遍历，遍历完成之后还是要回到另外一条路线的浅层节点上去
    // 所以需要让index成为vNodeWalk内部的一个私有属性去传导
    vNodeWalk(c, newChildren[idx], ++vnIndex)
  })
}

export default domDiff

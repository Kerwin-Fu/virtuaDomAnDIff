import { ATTR, TEXT, REPLACE, REMOVE } from './patchTypes'
import { setAttrs, render } from './virtualDom'
import Element from './element'

// 用于存放修改用的补丁包
let finalPatches = {},
// 一个全局的初始编号值
  rnIndex = 0

// 需要两个参数，真实dom，以及需要打的补丁包
function doPatch(rDom, patches) {
  // 将补丁包挂载到全局上去，免得每次需要使用补丁包是还要层层参数传递
  finalPatches = patches
  rNodeWalk(rDom)
}
// test code
function rNodeWalk(rNode) {
  // 取出补丁包中对应编号的补丁 （并不是每个对应编号都会有补丁包，也就是并不是每个节点都发生了变化）
  const rnPatch = finalPatches[rnIndex++],
    // 取出节点的children节点
    childNodes = rNode.childNodes;
    // 因为children节点属于伪数组，因此需要转化为真数组再使用数组的方法来遍历操作
    [...childNodes].map((c) => {
        // 每个子节点递归这个方法，做处理
      rNodeWalk(c);
    });
    // 这个方法才是真正的实现打补丁的，上面都是做的一些前置必要操作
  if (rnPatch) { // 首先你要判断对应编号的补丁包存不存在，也就是告诉节点有没有改变
    // 如果有，开始打补丁
    patchAction(rNode, rnPatch)
  }
}

function patchAction(rNode, rnPatch) {
  // 遍历补丁包，然后依照补丁包的几种情况，分别处理
  rnPatch.map(p => {
    switch (p.type) {
      case ATTR:
        // 如果补丁包类型为属性的话，属性补丁类型是一个对象，需要遍历取出它的属性来操作
        for (let key in p.attrs) {
          let value = p.attrs[key]
          // 判断属性值是否存在，存在则使用setAttrs方法（之前渲染vDom成rDom中添加属性的方法）
          if (value) {
            setAttrs(rNode, key, value)
          } else {
            // 不存在则删除这个属性
            rNode.removeAttribute(key)
          }
        }
        break
      case TEXT:
        // 如果是字符串的话直接修改节点的textContent
        rNode.textContent = p.text
        break
      case REPLACE:
        // 替换有两种情况，一种是Element构造函数创建出来的实例对象节点，一种是字符串
        const newNode = (p.newNode instanceof Element)
        //  如果是节点，就使用render函数将它变成rDom
          ? render(p.newNode)
          // 不是直接创建一个文本节点
          : document.createTextNode(p.newNode)
          // 之后再到该节点的父节点上去用处理好的newNode替换自己（论我怎么杀我自己）
        rNode.parentNode.replaceChild(newNode, rNode)
        break
      case REMOVE:
        // 删除的话也是回到父节点上删除自己
        rNode.parentNode.removeChild(rNode)
        break
      default:
        break
    }
  })
}

export default doPatch
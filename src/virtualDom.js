import Element from './element'

// * 1. 返回一个构造函数，将三个参数传入
function createElement(type, props, children) {
  return new Element(type, props, children)
}

// ! 设置属性需要三个参数，分别是节点，属性名，属性值
function setAttrs(node, prop, value) {
  // ! 需要判断属性名，然后分情况做处理
  switch (prop) {
    // ! 有些节点的value跟其他的节点不相同
    case 'value':
      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.value = value
      } else {
        node.setAttribute(prop, value)
      }
      break
      // ! 如果属性名是style，直接给节点创建css样式
    case 'style':
      node.style.cssText = value
      break
      // ! 其他情况都可以使用这个方法创建属性
    default:
      node.setAttribute(prop, value)
      break
  }
}

// todo render函数
function render(vDom) {
  const { type, props, children } = vDom,
    el = document.createElement(type) // todo 1. 首先根据渲染的类型创建dom节点

  for (const key in props) { // todo 遍历第二个属性参数
    setAttrs(el, key, props[key]) // todo 2. 调用设置属性的方法给节点设置方法
  }

    // todo 3. 处理第三个子节点参数
  children.map(c => {
    c = c instanceof Element  // todo 3.1 判断子元素是不是Element构造函数
      ?
      render(c) // todo 3.2 如果是递归render函数设置前两个参数 （顺便处理它里面的子元素）
      :
      document.createTextNode(c) // todo 3.3 子元素也可能是字符串，如果是，直接创建字节节点
    el.appendChild(c) // todo 3.4 将处理好的子元素添加到创建的dom节点内
  }) 

  return el // todo 3.5 返回创建的dom节点
}

// 挂载函数就直接将处理好的真实节点挂载到指定的根节点上就行
function renderDom(rDom, rootEl) {
  rootEl.appendChild(rDom)
}

export {
  createElement,
  render,
  setAttrs,
  renderDom
}
import { createElement, render, renderDom } from './virtualDom'
import domDiff from './domDiff'
import doPatch from './doPatch'
// ! 第一步 使用创建元素的方法定义出虚拟节点的模型
/**
 * @description 第一个参数是标签类型，第二个属性是标签上的属性，第三个属性是子节点
 */
const vDom1 = createElement('ul', {
  class: 'list',
  style: 'width: 300px; height: 300px; background-color: orange'
}, [
  createElement('li', {
    class: 'item',
    'data-index': 0
  }, [
    createElement('p', {
      class: 'text'
    }, [
      '第1个列表项'
    ])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 1
  }, [
    createElement('p', {
      class: 'text'
    }, [
      createElement('span', {
        class: 'title'
      }, [])
    ])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 2
  }, [
    '第3个列表项'
  ])
]);

const vDom2 = createElement('ul', {
  class: 'list-wrap',
  style: 'width: 300px; height: 300px; background-color: orange'
}, [
  createElement('li', {
    class: 'item',
    'data-index': 0
  }, [
    createElement('p', {
      class: 'title'
    }, [
      '特殊列表项'
    ])
  ]),
  createElement('li', {
    class: 'item',
    'data-index': 1
  }, [
    createElement('p', {
      class: 'text'
    }, [])
  ]),
  createElement('div', {
    class: 'item',
    'data-index': 2
  }, [
    '第3个列表项'
  ])
]);

// ! 第二步，使用render函数将虚拟节点渲染成真实节点树
const rDom = render(vDom1)

// ! 第三步，使用renderDom函数将真实节点树挂载到选定的节点上
renderDom(rDom, document.querySelector('#app'))

// ! 第四步，使用diff算法函数对比新旧两个虚拟dom，得出改动的补丁包
const patches = domDiff(vDom1, vDom2)

// ! 第五步，给真实dom打上补丁
doPatch(rDom, patches)

console.log(patches)
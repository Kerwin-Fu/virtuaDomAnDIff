// * Element类， 将传入的参数绑定给实例
class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}

export default Element
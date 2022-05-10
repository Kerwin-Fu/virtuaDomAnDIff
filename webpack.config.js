const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// webpack 的配置文件
// 1. 目标: 修改默认的入口出口

// 对外导出一个对象 就是修改配置
// 注意: webpack 是基于 node 的打包工具, 所以导出规范必须遵循 CommonJS

// 2. 目标: 让 webpack 能自动复制 HTML 文件 到 出口
// 步骤
// 2.1 下载插件: html-webpack-plugin
//     yarn add html-webpack-plugin -D
// 2.2 配置在 plugins 节点下即可

// 3. 目标: 让 webpack 能支持 css 打包
// 步骤
// 3.1 装包: css-loader style-loader
// 3.2 在 module 节点配置

// 4. 目标: 让 webpack 能支持 less 打包
// 步骤
// 4.1 装包: less-loader less(被 less-loader 内部依赖的)
// 4.2 在 module 节点配置

// 5. 目标: 让 webpack 能支持 图片 打包
// 5.1 不需要装包 直接配置, module 节点

// 6. 目标: 让 webpack 能支持 字体图标 打包
// 6.1 不需要装包 直接配置, module 节点

// 7. 目标: mode 选项的作用
// production: 线上打包使用, 将代码压缩/混淆/打包
//        特点: 代码的体积很小, 效率非常低, 一般只有在项目上线时才使用
// development: 开发时打包使用, 将代码直接打包, 不压缩 不混淆
//        特点: 代码的体积很大, 效率非常高, 一般只有在项目开发时使用
// 注意: 配置文件修改后, 一定要重启 devServer 开发服务器
module.exports = {
  mode: 'production',
  // 入口 —— 可以是相对路径
  entry: './src/main.js',
  devtool: 'source-map',
  // 出口
  output: {
    // 必须是 绝对路径
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  plugins: [
    // html 插件
    new HtmlWebpackPlugin({
      // 指定要复制的 HTML 文件所在地
      // 可以使用 相对路径
      // 作用: 每次打包时 自动从 该目录下复制 HTML 到出口, 同时自动引入 js 文件, 并添加 defer 属性
      // defer: 等页面资源加载完成后加载 js 文件
      template: './public/index.html'
    })
  ],
  module: {
    rules: [
      {
        // . 表示除换行符以外的任意字符
        // \ 转义符
        test: /\.css$/i,
        // loader 的加载顺序是从右往左
        use: ['style-loader', 'css-loader']
      },
      {
        // . 表示除换行符以外的任意字符
        // \ 转义符
        test: /\.less$/i,
        // loader 的加载顺序是从右往左
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/i,
        // asset: 大于 8KB 不转 base64 直接复制, 小于 8KB 转成 base64 插入到 js 中
        type: 'asset',
        // generator 就是定义打包输出的规则
        generator: {
          // [] 的内容当做内置的变量
          // [name] 表示原先的文件名
          // [hash:6] 表示使用哈希字符串, 长度6
          // [ext] 表示后缀名 带 .
          filename: 'imgs/[name].[hash:4][ext]'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/i,
        // asset/resource: 不做 base64 转换, 无论多大多小都直接复制到出口
        type: 'asset/resource',
        generator: {
          // [] 的内容当做内置的变量
          // [name] 表示原先的文件名
          // [hash:6] 表示使用哈希字符串, 长度6
          // [ext] 表示后缀名 带 .
          filename: 'fonts/[name].[hash:4][ext]'
        }
      },
      { // 强烈不建议大家手写, 容易出错
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  devServer: {
    port: 3000, // 端口号
    open: true // 自动打开浏览器
  }
}
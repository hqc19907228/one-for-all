# 自定义组件开发流程

渲染引擎天然支持渲染 HTML，除此之外没有内置任何组件，但已有的组件只要经过特别**简单**的改造就
能在渲染引擎中使用，下面说明一下对组件的要求、改造和开发的最佳实践等。

## 背景

在 Schema 中，如果某个节点是由 `react-component` 来承载的，那在此节点上会同时记录三个信息：

- `packageName`: 组件所在的 package 的名称
- `packageVersion`: 期望使用的 package 版本
- `exportName`: 组件在 package 中的导出的名称

通过以上的三个参数我们可以用来找到具体的组件。具体如何寻找呢？有三种方式。

## 加载组件的三种方式

### 方式一：直接注入组件实现

### 方式二：实现 Component Loader 接口

### 方式三：定义 `import map`


渲染引擎提供了三种

# FAQ

## 1. 页面引擎组件的定义流程

TL;DR;

- 将组件打包成 SystemJS 格式的文件
- 将文件放到可被访问的某个文件服务上
- 在 import map 中写明组件的地址


### 为什么使用 SystemJS 格式？

虽然我们可以在 Schema 中声明使用哪些组件，但是我们不应该对要用到的组件提前 bundle，因为这样

- 性能问题严重
  - 需要将未来可能用到的组件都打包
  - 无法做代码分片，Schema 只是声明了要使用哪些组件，并没有对组件的 import 声明
- 构建流程成本高，组件的任何更新都需要重新构建整个项目
- 版本迭代和更新困难，当组件更新后，无法解决版本不兼容的问题

所以 Schema 一定要和组件的具体实现解耦，在页面渲染时要按需动态加载组件。

SystemJS 提供了类似使用 native ESM module 的诸多能力:

- 动态加载
- 循环引用
- import map
- etc...

### 如何借助 SystemJS 解决组件更新后版本不兼容的问题？

- 一般的我们会将多个组件放在一个 package 中
- package 的版本会不断升级
- 发布时，每个 package 的 URL 路径上都应该带上版本号
- 新发布的 package 不影响之前的 release
- Schema 中声明了所有的组件所在的 package 及其版本
- 根据 package 名称和版本可以动态的构建 package 最后的下载地址，构建 URL 的过程是可以自定义的

## 2. 如何将 Antd 样式或者 Element UI 样式引入我们的的工程

TL;DR;

- 采用问题 1 的形式重新构建 Antd 或者 Element
- 自己开发 styleless 组件，然后在 style-guide 中配置

第一种方式实现简答，定制化程度高，不可扩展。第二中方法成本高，但是更加灵活，也更加通用。

对于 ISV 来说，不同的客户期望的页面样式不同，虽然有很多客户能接受 Antd 或者 Element 的样式，但几乎所有的客户都有样式自定义的需求，
部分客户有深度样式定制的需求。如果简单的采用 Antd 或者 Element 的样式，会有很高的定制成本，
例如需要更高的权重覆盖已有样式，组件的 HTML 结构需要和 CSS selector 强耦合等。

更加可扩展的方式是开发一套 styleless UI，提供几套默认样式，用户可以基于此来自定义。
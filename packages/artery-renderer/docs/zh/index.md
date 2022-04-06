# Artery Renderer

AKA 渲染引擎，渲染 [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) 成真实的 UI。

TL;DR;

- Artery Renderer 是一种 MVC 架构的实现
- Artery Renderer 基于 React 和 RxJS 分别实现了 View 和 Model
- Artery Renderer 扩展性极强，使用者可以按需实现插件

- 使用指南
- [实现概述](./how-artery-renderer-works.md)
- FAQ

## 快速开始

使用 npm 或者 yarn 安装:

```bash
npm install @one-for-all/artery-renderer
```

在你的源代码中的 import artery-renderer:

```jsx
import React from 'react';
import { RefLoader, Repository, ArteryRenderer } from '@one-for-all/artery-renderer';

function Demo() {
  const artery = getArteryBySomeway();

  return (<ArteryRenderer artery={artery} />);
}

```

## Example

please checkout our [example repo](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/example) for more.

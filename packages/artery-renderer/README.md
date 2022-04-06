# Artery Renderer

[中文文档](docs/zh/index.md)

AKA render engine, render [Artery](https://github.com/quanxiang-cloud/one-for-all/tree/main/packages/artery) into read UI.

TL;DR;

- Artery Renderer is a implementation of MVC
- Artery Renderer uses React and RxJS to implement View and Model
- Artery Renderer is extremely extensible, you can implement plug-ins as needed

- Usage
- How Artery Renderer works
- FAQ

## Quick Start

Install by npm or yarn:

```bash
npm install @one-for-all/artery-renderer
```

Import render engine in your source file:

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

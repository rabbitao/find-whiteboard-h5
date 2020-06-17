
## 安装
``` bash
$ yarn add find-whiteboard
or
$ npm install find-whiteboard
```
## 初始化
``` javascript
import Whiteboard from 'find-whiteboard'
/** 创建白板对象
 * @param param: {
 *                bind: object find曲谱对象
 *                emitData?: function(object) 接收画板绘制数据的函数 serverMode为true才会触发
 *                color?: string 画笔颜色 default: #FF799F
 *                lineSize?: number 线条宽度 default: 4
 *                serverMode?: boolean 是否教师端 教师端会发送绘制的数据 default: true
 *                environment?: string 运行环境 piano/mobile  default: mobile
 *                }
 */
const whiteboard = new Whiteboard({
  bind: findStaffObject,
  emitData?: (args: emitData) => any, 
  color?: string, 
  lineSize?: number, 
  serverMode?: boolean, 
  environment?: string 
})
```

``` javascript
/**
 * 开始绘制
 * @param arg touch事件对象 
 */
  public touchStart(arg!: TouchEvent): void
```

``` javascript
/**
 * 绘制中
 * @param arg touch事件对象 
 */
  public touchMove(arg!: TouchEvent): void
```

``` javascript
/**
 * 结束绘制
 * @param arg touch事件对象 
 */
  public touchEnd(arg!: TouchEvent): void
```

``` javascript
/**
 * 清除画板数据
 */
  public clearFn(): void
```

``` javascript
/**
 * 启用/停用 橡皮擦
 * @param arg boolean 是否启用橡皮擦 
 */
  public eraseFn(arg: boolean): void
```

``` javascript
/**
 * 撤销上一步操作
 */
  public undoFn(): void
```

``` javascript
/**
 * 重做上一步撤销的操作
 */
  public redoFn(): void
```

``` javascript
/**
 * 接收端绘制数据
 * @param data:object 服务端发来的数据
 */
public clientRerender(data: object): void
```
  
## Project setup
```
yarn install
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

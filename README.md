# lajax
log + ajax，前端日志解决方案。

<a href="https://www.npmjs.com/package/lajax"><img src="https://img.shields.io/npm/v/lajax.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/lajax"><img src="https://img.shields.io/npm/l/lajax.svg" alt="License"></a>

lajax 尝试解决这些问题：

* 前端无日志，或者有日志也无持久化，导致难以对线上问题进行追溯和分析；

* 就算使用了前端日志库，通常也依赖于开发人员手动记日志，不可靠；

* 生产环境中未捕获的异常往往都被忽略了；

* 手机端浏览器看不到 `console` 打印的日志，在过去通常使用 `alert` 或 [vConsole](https://github.com/WechatFE/vConsole) 定位问题，但缺陷是需要专门为此修改源码；

* 对于服务器动态生成的网页，系统原有的服务端日志无法和前端日志进行关联。

## 目录

* [功能特性](#功能特性)

* [在线示例](#在线示例)

* [快速开始](#快速开始)

* [Api](#api)

* [日志格式](#日志格式)

* [请求id](#请求id)

* [服务器示例](#服务器示例)

* [测试](#测试)

* [许可](#许可)

## 功能特性

* 手动记录日志，支持 `info`，`warn`，`error` 3 种日志级别；

* 日志会以优化后的格式打印在浏览器控制台；

* 自动记录未捕获的脚本错误；

* 自动记录未捕获的 Promise 异常；

* 自动记录 ajax 请求的开始和完成；

* 自动生成 [请求id](#请求id)，方便日志定位和关联；

* 日志会定时批量发送到配置的日志服务器；

* 良好的兼容与异常处理机制。

## 在线示例

[http://eshengsky.github.io/lajax/](http://eshengsky.github.io/lajax/)

## 快速开始

### 下载

* 通过 npm 下载：

```bash
> npm install lajax
```

* 或者在 [release](https://github.com/eshengsky/lajax/releases) 页面下载压缩包。

### 引入

* 你可以使用 `script` 标签引入

```html
<script src="./dist/build.min.js"></script>
```

* 也支持 ES2015 模块方式导入

```js
import Lajax from './src/lajax-module';
```

### 使用

```js
// 传入接口服务器地址进行实例化
const logger = new Lajax('https://path/to/your/log/server');

// 记录一条信息日志
const num = parseInt(Math.random() * 100);
logger.info('这是一条info日志', '会产生一个随机数：', num);

// 记录一条警告日志
logger.warn('这是一条警告日志！');

try {
    JSON.parse(undefined);
} catch(err) {
    // 记录一条错误日志
    logger.error('这是一条error日志', '捕获到一个错误：', err);
}
```
详细文档请查看 [Api](#api)。

### 打包

lajax 使用了 ES2015 语法，需要使用 [webpack](https://webpack.js.org/) + [babel](http://babeljs.io/) 进行打包。

* 安装必须的模块

```bash
> npm install
```

* 打包插件

```bash
> webpack
```

打包后的文件目录是 `./dist`，其中 `build.js` 是未压缩版本，`build.min.js` 是压缩版本。

## Api

### new Lajax(Options)

初始化插件，返回一个插件的实例。

`Options`: 字符串或对象。如果传入的是字符串，会被当作日志服务器地址：

```js
const logger = new Lajax('https://path/to/your/log/server');
```

如果你想自定义一些配置，请传入一个对象：

```js
const logger = new Lajax({
    url: 'https://path/to/your/log/server',
    interval: 5000
});
```

对象支持的全部属性如下：

<table>
    <tr>
        <th>属性名</th>
        <th>说明</th>
        <th>值类型</th>
        <th>默认值</th>
    </tr>
    <tr>
        <td>url</td>
        <td>日志服务器的 URL</td>
        <td>string</td>
        <td>null</td>
    </tr>
    <tr>
        <td>autoLogError</td>
        <td>是否自动记录未捕获错误</td>
        <td>boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>autoLogRejection</td>
        <td>是否自动记录 Promise 错误</td>
        <td>boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>autoLogAjax</td>
        <td>是否自动记录 ajax 请求</td>
        <td>boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>logAjaxFilter</td>
        <td>ajax 自动记录条件过滤函数，函数传参是该次请求的 url 和 method，若返回 true 代表记录日志，false 代表不记录日志</td>
        <td>function</td>
        <td><pre lang="js">/**
 * @param {string} ajaxUrl - 请求url
 * @param {string} ajaxMethod - 请求方式
 */
 function(ajaxUrl, ajaxMethod) {
    return true;
}</pre></td>
    </tr>
    <tr>
        <td>stylize</td>
        <td>是否要格式化 console 打印的内容</td>
        <td>boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>showDesc</td>
        <td>是否显示描述信息（当初始化完成时打印在控制台）</td>
        <td>boolean</td>
        <td>true</td>
    </tr>
    <tr>
        <td>customDesc</td>
        <td>生成自定义描述信息的函数，传参为上次页面卸载前未发送的日志数、当前请求 id、请求 id 是否来自服务端，返回一个字符串</td>
        <td>function</td>
        <td><pre lang="js">/**
 * @param {number} lastUnsend - 上次页面卸载前未发送的日志数
 * @param {string} reqId - 请求id
 * @param {boolean} idFromServer - 请求id是否来自服务器
 */
function(lastUnsend, reqId, idFromServer) {
    return `🚀 lajax 前端日志模块加载完成。
自动记录页面错误：      ${this.autoLogError ? '✔' : '✘'}
自动记录Promise异常：   ${this.autoLogRejection ? '✔' : '✘'}
自动记录Ajax请求：      ${this.autoLogAjax ? '✔' : '✘'}
当前页面请求id：${reqId}${idFromServer 
? ' (来自服务端)' 
: ' (自动生成)'}`;
}</pre></td>
    </tr>
    <tr>
        <td>interval</td>
        <td>日志发送到服务端的间隔时间（毫秒）</td>
        <td>number</td>
        <td>10000</td>
    </tr>
    <tr>
        <td>maxErrorReq</td>
        <td>发送日志请求连续出错的最大次数，超过此次数则不再发送请求（但依然会记录请求到队列中）</td>
        <td>number</td>
        <td>5</td>
    </tr>
</table>

### info(arg1, arg2, ...args)

实例方法，记录一条信息日志，可以传入任意类型、任意数量的参数。

```js
const num = parseInt(Math.random() * 100);
logger.info('这是一条info日志', '会产生一个随机数：', num);
```

### log(arg1, arg2, ...args)

实例方法，同 `info`。

```js
const num = parseInt(Math.random() * 100);
logger.log('这是一条log日志', '会产生一个随机数：', num);
```

### warn(arg1, arg2, ...args)

实例方法，记录一条警告日志，可以传入任意类型、任意数量的参数。

```js
logger.warn('这是一条警告日志！');
```

### error(arg1, arg2, ...args)

实例方法，记录一条错误日志，可以传入任意类型、任意数量的参数。

```js
try {
    JSON.parse(undefined);
} catch(err) {
    // 记录一条错误日志
    logger.error('这是一条error日志', '捕获到一个错误：', err);
}
```

### queue

array 类型属性，当前待发送的日志队列。

```js
logger.queue
```

### reqId

string 类型属性，当前页面的请求 id。

```js
logger.reqId
```

### idFromServer

boolean 类型属性，请求 id 是否来自于服务端生成。

```js
logger.idFromServer
```

### colorEnum{...}

静态对象，日志颜色的枚举，如果你想自定义日志颜色，可以在调用实例方法之前修改该对象的属性。默认对象：

```js
Lajax.colorEnum = {
    /**
     * 信息日志颜色，默认宝蓝色
     */
    info: 'DodgerBlue',

    /**
     * 警告日志颜色，默认橘黄色
     */
    warn: 'orange',

    /**
     * 错误日志颜色，默认红色
     */
    error: 'red',

    /**
     * ajax分组颜色，默认紫色
     */
    ajaxGroup: '#800080',

    /**
     * 日志发送成功颜色，默认绿色
     */
    sendSuccess: 'green',

    /**
     * 描述文字颜色，默认粉红色
     */
    desc: '#d30775',
}
```

## 日志格式

通过 ajax 发送给服务器的日志，一定是一个非空数组。这里同时记录 2 条日志：

```js
logger.info('这是一条info日志', 'Hello', 'lajax');
logger.warn('这是一条warn日志');
```

实际发送的日志数据将如下：

```json
[{ 
    "time": "2017-08-23 16:35:01.989", 
    "level": "info", 
    "messages": ["{44b53aba-1970-4bd1-b741-ed1ae5a5051e}", "这是一条info日志", "Hello", "lajax"], 
    "url": "http://127.0.0.1:5500/demo/index.html", 
    "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36" 
}, { 
    "time": "2017-08-23 16:35:02.369", 
    "level": "warn", 
    "messages": ["{44b53aba-1970-4bd1-b741-ed1ae5a5051e}", "这是一条warn日志"], 
    "url": "http://127.0.0.1:5500/demo/index.html", 
    "agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36" 
}]
```

各字段说明：

* `time`: 字符串，该条日志记录的时间

* `level`: 字符串，该条日志的级别，分为 `info`、`warn`、`error` 3 种

* `messages`: 数组，数组的第一个元素是大括号包裹的唯一[请求id](#请求id)，之后的所有元素对应调用 `logger[level]` 依次传入的日志内容

* `url`: 字符串，该条日志所在页面的 URL

* `agent`: 字符串，该条日志所在页面的用户代理

## 请求id

发送到服务器的每一条日志，都包含一个请求 id。在同一次请求中，所有日志的请求 id 一定相同；在不同请求中，各自记录的日志的请求 id 一定不同。

例如：用户甲访问 index.html 过程中 lajax 记录并发送了 10 条日志，这 10 条日志的请求 id 是相同的；用户乙也访问了该页面，同样产生了 10 条日志，这些日志的请求 id 也一定是相同的，但和用户甲的请求 id 不同。

请求 id 的主要目的：让你能够在服务端精确定位到某次请求过程中的所有相关日志。

请求 id 的生成和发送：

* 如果你的页面是服务器端动态生成的，你想将服务端的日志和前端的日志串联起来，你可以在服务端生成一个请求 id，并发送到前端。lajax 会依次尝试从页面的 `<meta name="_reqId" content="xxxx-xxx">` 内容中或者 `window._reqId` 中寻找请求 id；

* 如果上述的寻找失败了，则认为你的页面是一个纯前端的页面，lajax 将会在初始化时生成一个基于时间的唯一 id 来作为请求 id，在页面卸载之前，所有的日志都将包含该请求 id；

* 对于监听到的 ajax 请求，上述请求 id 会被添加到 `X-Request-Id` 请求头中，你可以在服务端日志中记录该请求 id 以做关联。

## 服务器示例

在 `./demo` 目录中，包含了一个基于 [node.js](https://nodejs.org/en/) 的简单的日志服务器示例 [server.js](https://github.com/eshengsky/lajax/blob/master/demo/server.js)。

启动日志服务器：

```bash
> node server.js
```

日志接口运行在 [http://127.0.0.1:2017/log](http://127.0.0.1:2017/log)，本地测试时，将 Lajax 的初始化参数设为该地址即可：

```js
const logger = new Lajax('http://127.0.0.1:2017/log');
```

该示例服务器支持 ajax 跨域请求 :)

## 测试

本地访问 `./test/index.html` 页面以运行测试。

## 许可
The MIT License (MIT)

Copyright (c) 2017 孙正华

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

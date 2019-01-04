---
title: Node.js介绍
date: 2018-06-04
author: You
tag: Node.js
banner: /img/7.jpg
meta:
  - name: description
    content: Node.js事实上既是一个运行时环境，同时又是一个库。Node.js让JavaScript流畅的运行在服务器端。
  - name: keywords
    content: Node.js
---

# Node.js

1、什么是Node.js？
Node.js事实上既是一个运行时环境，同时又是一个库。Node.js让JavaScript流畅的运行在服务器端。Node.js采用Google的Chrome浏览器V8引擎，由C++语言编写，本质是一个JavaScript的运行环境。Node.js可以解析JS代码（没有浏览器安全级的限制），可以提供系统级别的API：文件的读写、进程的管理、网络通信等。
2、一个基础的HTTP服务器——Node.js应用
   服务器模块——server.js文件

``` js
var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
res.write('Hello World);
    res.end();
})
server.listen(1337);//实现监听
console.log('Server running at http://localhost:1337/');
```

分析HTTP服务器的构成：
第一行请求（require）Node.js自带的http模块，并把它赋值给http变量，http模块的职责是负责创建web服务器以及处理http相关的任务。接下来调用http模块提供的函数：createServer。这个函数返回一个对象server，这个对象有一个listen的方法，这个方法有一个参数，指定这个HTTP服务器监听的端口号。然后向creatServer函数传递了一个匿名回调函数，在监听到从1337端口过来的请求时就会调用回调函数进行处理。
3、Nodejs的模块
   模块的流程：创建模块——导出模块——加载模块——使用模块
4、npm是node的包管理工具（packaged Modules），本身用node.js编写，是管理基于node.js编写的命令行工具。Webpack是一个前端资源加载/打包工具。




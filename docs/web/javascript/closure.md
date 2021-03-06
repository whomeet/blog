---
title: 闭包和私有变量
date: 2018-06-01
author: 七七
tag: JavaScript
banner: /img/3.jpg
description: 1、闭包：指有权访问另一个函数作用域中的变量的函数。
             2、闭包的作用：
             * 读取函数内部变量
             * 保存变量的值

meta:
  - name: description
    content: 1、闭包：指有权访问另一个函数作用域中的变量的函数。
             2、闭包的作用：
                读取函数内部变量
                保存变量的值
  - name: keywords
    content: 闭包 作用域
---


1、闭包：指有权访问另一个函数作用域中的变量的函数。

2、闭包的作用：
* 读取函数内部变量
* 保存变量的值

3、闭包的使用场景：
* 函数作为返回值
* 函数作为参数值传递

4、使用闭包的注意点：
* 使用闭包，内存消耗极大，不要随便使用
* 闭包会在父函数外部，改变父函数内部变量的值

5、闭包的作用域：闭包的作用域包含它自己的作用域、包含函数的作用域和全局作用域

6、当函数返回一个闭包时，这个函数的作用域将会一直在内存中保存到闭包不存在为止

7、可以使用闭包模仿块级作用域：创建并立即调用一个函数，这样即可以执行其中的代码，又不会在内存中留下对该函数的引用，调用完成后函数中的所有变量都会被立即销毁

8、私有变量——函数中的变量称为私有变量（函数外部不能访问）
* 私有变量包括函数的参数、局部变量和在函数内部定义的其他函数
* 有权访问私有变量和私有函数的公有方法称为特权方法
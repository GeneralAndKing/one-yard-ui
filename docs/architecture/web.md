---
title: 前端
---

## 简述

随着 `Web` 的不断发展，现在前端的时代已经不是当初的前端了，不再是 `Bootstrap`、`JQuery` 一出万人空巷了。前端工程化和组件化已经成为时代趋势，他们提高前端开发效率的同时，也大大他高了前端代码的可读性、安全性，拥有了一套完整的前端生态。目前流行的三大前端框架：

- React
- Angular
- Vue

三者之中，我们选择了 `Vue` 作为前端核心框架，一方面我们都是后端开发人员，现在的前端水平大大谈不上全栈的水平，而 `Vue` 作为三大框架中最容易上手的一个，我们开发起来相对也会轻松很多。

前端是我们的短板，所以我们预留了很多时间给前端，但还是时间紧迫，紧赶慢赶。

我们前端主要依赖如下：

![dep](http://q0zlaui5t.bkt.clouddn.com/docs/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20191120214407.png)



## UI

在前端的设计风格上面，我们选择的是参照 Google 提出的 [Material Design](https://material.io/design/) 进行设计，所以我们选择了 `VUE` + `MATERIAL DESIGN` 的组件库 [vuetify](https://vuetifyjs.com/zh-Hans/) 来进行页面的书写。

我们不选择使用任何 UI 模板，事实上也没有什么模板可以选择。从零到一全部由自己设计完成。具体过程可以参见项目的 [commit](https://github.com/GeneralAndKing/one-yard-ui/commits/master)，其中包括多次代码重构和重写。

我们提供两套主题：

- 明亮——以蓝白为基础
- 暗黑——以红黑为基础

两套主题用户可以自由切换。同时，尽可能多的带来动感、过渡和手机端的友好体验。

### 兼容性

由于浏览器的多样性，我们没有办法去兼容所有的浏览器，且我们不是专业的前端工程师，所以难免有些浏览器不能所及，目前已测的浏览器如下：

| 浏览器                          | 支持情况 |
| ------------------------------- | -------- |
| Chromium (Chrome, Edge Insider) | 支持     |
| Firefox                         | 支持     |
| Edge                            | 支持     |
| Safari 10+                      | 支持     |
| IE11 / Safari 9                 | 不支持   |
| IE9 / IE10                      | 不支持   |

对于移动端，我们没有财力和精力去做完整的测试，但目前流行的机型而言没有发现有不支持的情况。

### 模板引擎与预处理语言

我们团队选择的模板引擎是 `PUG`， 预处理语言 `STYLUS`。这是我们团队认为是绝配的两个东西，他们的书写风格极为相似，且容易理解。更重要的是，省去了很多不必要的行数，比如 HTML 标签的关闭，比如 `CSS` 的大括号等。

```stylus
// PUG
v-app#inspire
  v-fade-transition(hide-on-leave)
    router-view
```

```stylus
// STYLUS
#form-card
  width 450px
  @media (max-width: 450px)
    width 100%
    height 100%
    padding 2rem !important
#form-footer
  position absolute
  text-align center
  width 100%
  background-color rgba(255,255,255,0)
  justify-content center
  left 0
  display flex
  padding 40px 0 0
  font-size 15px
  @media (max-width: 450px)
    bottom 0
```

这里的模板引擎，不是前端端未分离时的，代码侵入性高，耦合度高的 `Jsp`、 `Freemarker` 之类的模板引擎。而是为了提高我们写代码的效率的利器。将我们写的模板转化为对应的 `HTML`，同时，我们引入 `stylus` 预处理语言，将层叠样式表变为了一门 “语言”。

## Js

工程化的到来，必定要消除 `javascript` 这种弱类型语言书写上的一些随意性，因而我们约定如下方式来帮助我们规范化我们的 `js` 代码：

1. 使用了具有强行检查高严格 `eslint` 插件统一代码风格
2. 尽量避免 `JSX` 的使用
3. 以 *ECMAScript 8* 为核心规范进行代码书写
4. 引入  *Lodash* 工具库来提高代码书写效率

这几条约束让我们的 `JS` 代码更加合法易读。

## 封装

现在的前端，封装是极其重要的一项。这里的封装有两个概念，一方面是 JS 常用类库的封装，一方面是组件的封装。

- 对于一些常使用的组件，例如提示框，我们选择将它封装为一个 `vue` 插件，可以直接通过 `JS` 调用。
- 对于一些需要同一处理的类库，例如 `axios` 请求，我们对他进行二次封装。
- 对于一些需要复用的组件，我们也将他们进行封装，方便我们的直接引用。

## 鉴权

和后端一样，前端也需要进行权限鉴定，以生成该用户所拥有的相应角色能够操作的菜单和功能。我们权限分为两个部分：

1. 路由生成
2. 菜单生成

两步都有严格的权限鉴定规则，通过请求保存后端的角色信息，然后将其进行匹配，最后得出他哪些能够访问，哪些能够操作。

## 移动端

我们为移动端做了很好的适配，例如登录页面：

![login](http://q0zlaui5t.bkt.clouddn.com/docs/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20191121020223.png)

在移动端：

![login](http://q0zlaui5t.bkt.clouddn.com/docs/Screenshot_20191121_015608_mark.via.jpg)

对于表格，在电脑端：

![table](http://q0zlaui5t.bkt.clouddn.com/docs/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20191121015534.png)

而在手机端：

![table](http://q0zlaui5t.bkt.clouddn.com/docs/Screenshot_20191121_015914_mark.via.jpg)

这样的布局很好的显示出表格的数据了
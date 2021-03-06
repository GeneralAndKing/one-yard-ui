---
title: 总结 
---

## 回顾

这次比赛还是有不少收获的，虽然十分的累，花了很多时间，前后端项目加起来五六百个 `commit`。在后端花的时间，其实不及前端的五分之一，因为对于我们几个后端同学来说，写后端还是得心应手，但是前端的界面把控和一些细节实在让人头疼。总结下来有几点：

1. 接口文档很重要
2. 抽象很重要
3. 组件化、工程化会带来质的飞跃
4. 前后端分离联调成本变高，但开发速度较快。
5. 团队之间配合决定了这个项目的进度
6. 尽可能的不要想太多，物极必反
7. 安全太重要
8. 网路不稳定带来的影响比想象中的大很多
9. `TDD` 真的太棒了
10. ......

## 一些问题

在项目开发中遇到不少问题，记录一下。（这些问题都是通过队友之间互相问问题的方式阐述）

> Q: 为啥不直接用 `spring-boot` 最新版，而是用 `2.1.9`？

~~最新版不一定是最好的，在使用的时候发现最新版的依赖管理中的 `Spring-security` 存在一些 bug，参见我队队员提的 [ISSUE](https://github.com/spring-projects/spring-security-oauth/issues/1798)。虽然在随后的时间里，`Spring-security`将这个 bug 回滚了，但是在 `spring-boot` 的依赖管理中依旧没有变。所以我们退而求次，选择小版本号较低的 `2.1.9`。~~
 
 第二次版本迭代已经使用 `2.2.2` 最新版本。

> Q: 为啥不用安全性更高的非对称加密啊？

因为没必要，还是上面总结的，物极必反。一个项目的诞生不可能全盘皆用最好，最完美的架构却不一定是最好的架构。适合当前项目的是最好的。目前只是一个小项目，没有必要强上非对称加密。就像没有必要强行拆分为资源服务器和授权服务器一样。如果以后有需要，迭代的时候加上即可。

> Q: 为什么直接暴露 `Repository`？这样真的好吗？感觉不安全诶

好啊！我少写了好多好多接口啊！然后通过 `RBAC` 模型来控制下权限，简直不要太爽啊！而且 `Controller` 少了好多，方法也少写好多，如果是以前不暴露，这些重复的方法还要写在 `BaseController`、`BaseService` 里面。现在单表操作太爽太爽了！谁用谁知道！

> Q: 为啥要用 Docker啊？两个环境有必要吗？

当然有！Docker 大法好！使用 Docker，一条命令就完成环境安装和部署，配合 docker-compose 编排方便太多了，在新的服务器上安装环境，五分钟搞定！简直是 Linux 的大亲儿子啊。而且想要清除环境、更换环境非常容易！这样对于环境的变化有了大大的容错性！

> Q: 前端既然是短板，为啥不用模板呢？

一方面，用模板需要我们去熟悉模板的配置，熟悉模板的组件和写法，而且别人的模板不一定适合我们，也不一定是能够跟上相应的依赖更新的脚步的，我们没有那么多时间去熟悉，自己写的也许会有 bug ，但是毕竟是亲生的，怎么出 bug 自己心里有点数。另一方面，，，，别人写的审美与我们不一样啊，要不就是太花里胡哨，改起来费劲，要不就是太丑不想用。最后只有自食其力了。

> Q: 咱们一直跟进时代，现在有了更好的接口设计——GraphQL，给他们说说咱们为啥放弃使用 GraphQL 而去使用 RestFul 吧。

好嘞～如果细心的朋友会就发现，我们后端项目还有一个分支：[GraphQL](https://github.com/GeneralAndKing/one-yard/tree/graphql)。这是我们小队一开始准备使用的接口规范，但是在实践中不断发现，这个技术难度较大，虽然他确实能够带来一些便利，让人眼前焕然一新，但是开发速度实在太慢，并且我们技术有限，在某些方面直接使用会发现有很多问题需要解决。于是我们在尝试了四天以后，放弃了使用 GraphQL，但是我们舍不得将它删除，所以将它放到另外一个分支之中去了。他能够满足我们的一些基本需求，但是光是后端就让我们折腾够呛，迫不得已，只有回归原始最熟悉的 REST 了。不过也没有遗憾，至少体验过了。



*（还有好多好多记录，想想也没必要全部都写在这儿）*

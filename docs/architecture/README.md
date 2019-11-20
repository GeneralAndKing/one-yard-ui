---
title: 概览
---

## 技术选型

本项目采用前后断完全分离模式，基于 `http` 与 `websocket` 进行通信，采用技术如下：

### 后端技术选型

> 项目地址：[one-yard](https://github.com/GeneralAndKing/one-yard)

- 开源协议： [GNU GENERAL PUBLIC LICENSE Version 3](https://github.com/GeneralAndKing/one-yard/blob/master/LICENSE)
- 开发环境： [jdk 11](http://openjdk.java.net/projects/jdk/11/)
- 构建工具： [gradle5](https://gradle.org/)
- 核心框架： [spring-boot](https://spring.io/projects/spring-boot)
- 安全框架： [spring-security-oauth](https://spring.io/projects/spring-security-oauth)
- 授权协议： [oauth2](https://tools.ietf.org/html/rfc6749)
- 应用缓存： [redis](https://redis.io/)
- 应用容器： [docker](https://www.docker.com/)
- 容器编排： [docker-compose](https://github.com/docker/compose)
- 接口规范： [restful](https://tools.ietf.org/html/rfc6690)
- 接口测试： [postman](https://www.getpostman.com/)
- 模板引擎： [Freemarker](https://freemarker.apache.org/)
- 反向代理： [nginx](https://nginx.org/en/)
- 数据库： [mysql8](https://dev.mysql.com/)
- 邮件： [腾讯企业邮](https://exmail.qq.com/)
- 图床： [七牛云](https://www.qiniu.com/)

### 前端技术选型

> 项目地址：[one-yard-ui](https://github.com/GeneralAndKing/one-yard-ui)

- 开源协议： [GNU GENERAL PUBLIC LICENSE Version 3](https://github.com/GeneralAndKing/one-yard-ui/blob/master/LICENSE)
- 开发环境： [node 12](https://nodejs.org)
- 构建工具： [yarn](https://yarnpkg.com/lang/en/)
- 核心组件： [vuetify](https://vuetifyjs.com/zh-Hans/)
- 核心框架： [Vue](https://vuejs.org/)
- 项目文档： [vue-press](https://vuepress.vuejs.org)
- 设计风格： [Material Design](https://material.io/design/)
- 模板引擎： [pug](https://pugjs.org/)
- 预处理器： [stylus](http://stylus-lang.com/)
- 代码约束： [ESLint](https://eslint.org/)
- HTTP 库: [Axios](https://www.axios.com)

## 接口规范

完全遵循 restful 进行设计，通过 url 定位资源， 用 HTTP 动词（`GET`,`POST`,`DELETE`,`PATCH`,`PUT`）描述操作，所有操作如下：

> 为了系统的安全性，我们不会真正的将一个数据进行删除，而是通过将其 `is_enable` 字段置为 `FALSE`，同时，查询的时候我们将不会显示任何 `is_enable` 为 `FALSE` 的数据。所以我们默认**不开放任何资源的 `DELETE` 操作**。

> 为了使得操作更加明确，我们默认不开放 `PUT` 方法来对整个数据进行修改！

| 路径  | 方法 | 描述 |
|---|---| ----|
| /rest/{resource}  | GET | 查询所有的资源信息，分页 |
| /rest/{resource}/{id}  | GET | 获取指定 id 的某个资源信息 |
| /rest/{resource}/search/all  | GET | 查询所有的资源信息 |
| /rest/{resource}  | POST | 添加资源信息 |
| /rest/{resource}/{id}  | PATCH | 修改指定 id 的某个资源信息 |
| /rest/{resource}/{id}  | DELETE | 删除指定 id 的某个资源信息（**禁用**） |
| /rest/{resource}/{id}  | PUT | 修改指定 id 的整个资源信息（**禁用**） |

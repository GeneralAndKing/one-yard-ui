---
title: 运维
---

## 简述

我们选择使用 `centos` 作为部署系统，主要有以下几个方面：

1. `linux` 系统较之 `windows` 小很多，内存占用也少很多
2. 管理较为方便，环境搭建天生具有优势
3. 能与 `docker`  完美搭配，减少许多运维成本
4. 队员使用 `linux` 作为主力开发系统的较多，上手容易

这部分则是说明我们运维方面的部署和使用

## 端口规划

服务器开放端口为 `10000-10050`，

| 应用名称 | 应用描述                      | 端口号            |
| -------- | ----------------------------- | ----------------- |
| mysql 8  | 关系型数据库                  | 10001             |
| redis 5  | 非关系型数据库                | 10002，未对外开放 |
| nginx    | 反向代理web服务器（暂未使用） | 10003             |
| 后端应用 | `spring-boot` 项目            | 10011             |
| 前端应用 | `vue` 项目，静态 SPA 页面     | 10012             |

## Docker

我们使用 docker 来进行管理我们的应用容器，用 **docker-compose** 来完成整个编排的工作，如下：

```yml
version: "3"
services:
  one-yard-redis:
    container_name: redis-dev
    image: redis:5
    ports: 
      - 10002:6379
    volumes: 
      # docker volumes mapping
      - "${REDIS_DIR}/conf:/usr/local/etc/redis"
      - "${REDIS_DIR}/data:/data"
    command: 
      redis-server
    restart: always
  one-yard-mysql:
    container_name: mysql-dev
    image: mysql:8
    ports:
      - 10001:3306
    volumes:
      - "${MYSQL_DIR}/data:/var/lib/mysql"
      - "${MYSQL_DIR}/conf.d:/etc/mysql/conf.d"
    environment:
      # environment variables
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
```

锁定 `mysql` 版本为 `8`，锁定 `redis` 的版本为 `5`，自动化容器编排。

## Nginx 取舍

项目初期打算，直接使用 `nginx` 来作为反向代理和应用服务器：

1. 使用 `nginx` 作为后台容器的反向代理，可以绕过跨域问题，
2. 使用 `nginx` 作为前台应用的 `web` 服务器
3. 并发量大时，启动多个后台项目，使用 `Nginx` 进行负载均衡

但是后来经过团队商议决定，杀鸡焉用牛刀。`Nginx` 存在配置复杂的，占用内存高的特点，且访问速度有时不尽人意，让人着实难受。

**所以最终我们决定，在应用不大，并发不高的的情况下，选择更加方便快捷，小型简单的 Caddy 来作为前端应用的 `web` 服务器，后端应用自行处理跨域问题**。事实证明 caddy 带来的速度上提升是非常让人满意的！


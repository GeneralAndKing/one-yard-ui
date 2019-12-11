---
title: 后端
---

## 设计

![GitHub](https://img.shields.io/github/license/GeneralAndKing/one-yard-ui)
![Spring-boot](https://img.shields.io/badge/spring--boot-2.1.9-success)
![gradle 5](https://img.shields.io/badge/gradle-5.6.2-blue)

由于时间紧迫且功能较多，我们本着快速开发、多次迭代的原则，选择以 `JAVA` 语言为主，以 `JDK11` 为基础，使用 `spring-boot` 来完成此次后台的构建，同时放弃使用 `MAVEN` ，选择使用更加灵活且易用的 `GRADLE` 作为依赖管理与自动化构建工具。

我们小队大多都是后端开发人员，可能会出现花很多时间在前端上的情况。所以我们将我们后端定位成快速与敏捷共存，在尽量的少写接口的同时，完成项目开发。

所以，我们后端在保证功能能够正常完成的前提下，讲究 **安全、快速、全面**。不直接使用 `spring-cloud` 这种多模块的微服务框架，事实上也没有必要使用，`spring-boot` 到 `spring-cloud` 的过度是极其快捷简单方便的；也不直接使用像 `vertx` 这种轻量级但需要自己动手过多的框架。

数据库设计如下：

![database](http://image.japoul.cn/docs/approval.png)

表和字段均有详细注释，篇幅有限不再赘述，具体可以参见需求分析页。

### 应用分层

如下图

![应用分层](http://image.japoul.cn/docs/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20191120200120.png)

1. 开放接口层：直接封装 repository 方法暴露 http 接口；进行网关安全控制、流量控制、访问控制等
2. 第三方引用或新应用接入：接受新应用注册客户端接入已有授权认证系统，包括其它部门 http 开放接口，基础平台，其它公司的HTTP接口。
3. 安全：oauth2 协议颗粒化控制每一个接口的访问权限
4. 请求处理层：主要是对访问参数校验和控制，各类基本数据处理，或者不复用的业务简单处理等
5. 业务逻辑层：相对具体的业务逻辑服务层，处理复杂逻辑、可复用逻辑、数据库事务等。
6. 资源仓库处理层：前身 dao 层，数据访问层，与底层MySQL、Oracle、Hbase等进行数据交互。但不再局限于 mysql 等关系型数据库，且可以直接对外暴露为 http 端口。


### 规范

我们团队后端代码规范核心以 [*Google Java Style Guide*](https://google.github.io/styleguide/javaguide.html) 为核心，参照部分 阿里巴巴JAVA开发手册，使用 [Check Style](https://checkstyle.sourceforge.io/) 对代码进行约束检查，开源协议使用 [GPL3](https://www.gnu.org/licenses/gpl-3.0.html) 协议，接口设计遵循 RESTFul 规范。

## 安全

我们最为注重的是后台安全，作为一个系统，安全无疑是首位。我们团队参照 [RBAC ](https://en.wikipedia.org/wiki/Role-based_access_control) 模型以及项目需求，设计了基于 **方法** 与 **路径** 权限控制，颗粒化的控制**每一个请求**，建立了一个完整的授权系统，我们设计的 RBAC 模型如下：

![rbca](http://image.japoul.cn/docs/sys_user_role.png)

从上到下各表如下：

| 表名                | 名称           | 描述                                                         |
| :------------------ | -------------- | ------------------------------------------------------------ |
| sys_department      | 部门表         | 部门信息，与角色表**一对多**关联                             |
| sys_role            | 角色表         | 各角色信息，与部门表**多对一关联**，用用户表、权限表**多对多**关联 |
| sys_permission      | 权限表         | 各资源权限信息，与角色表**多对多**关联                       |
| sys_user            | 用户表         | 用户信息，与角色表**多对多**关联                             |
| sys_role_permission | 角色权限关联表 | 角色表与权限表的关联信息                                     |
| sys_user_role       | 用户角色关联表 | 用户表与角色表的关联信息                                     |

前后端分离的情况下，我们通过 `token` 来进行认证、授权与鉴权。我们设计好了这个数据库模型以后，就开始选择一个合适的安全协议来完成我们的整个流程。

### 选择

我们选择使用 `oauth2` 授权来完成整个认证、授权、鉴权的过程。为了快速与简便的开发，我们将 `oauth2` 授权中的四个角色修改为了三个，如下是

- 资源服务器与授权服务器合并
- 客户端角色
- 用户角色

将资源服务器与授权服务器能够大大减少的我们的维护和开发成本。目前系统尚小，所以就目前而言，将他们合并以后是最好的选择。而后在系统迭代以及扩大的时候，`oauth2` 依旧能够很好的胜任。

>  我们并没有完全摒弃 `oauth2` 的核心，现在只有一个系统，之所以选择 `oauth2` 的授权，就是为了以后更加方便的第三方应用接入。

在现在的互联网环境中，多应用、多服务、前后端分离等已经渐渐成为一种趋势，`oauth2` 是目前最为完整且安全的第三方授权协议。**所以如果有新的应用接入或者新的系统开发，完全可以直接使用现有的用户角色系统来进行认证与授权，而不需要再次构建一个新的用户系统**！而在后续的迭代中，完全可以将已经合并的授权服务器与资源服务器进行分离，独立出一个服务来做*授权中心*，并通过 `SSO` 单点登录完成多个系统之间无感知的认证授权。

并且，我们团队目前选择 `JWT` 对称密钥加密方式来完成 `token` 的加密，在安全性要求较高环境下，完全可以毫无压力的将它替换为 **非对称密钥** 加密的方式来加密我们的 `token`。

这种 **高安全、高扩展** 就是我们团队为什么选择 `oauth2` 的原因。

本应用中，由于只有一个客户端，所以我们将客户端信息存储内存之中即可。而在 `oauth2` 中主要有 **授权**、**鉴权** 两个流程，将详细解释如下两个流程。

### 授权流程

由于我们应用简单，在 `oauth2` 中的四种授权模式之中选择使用 `密码模式` 完成授权，它的安全性不及 **授权码模式** 但确是最为方便快捷且易用安全的授权模式，此时的服务器是作为 **授权服务器** 角色。具体流程如下：

1. 客户端发起授权（即登录）请求
2. 服务器校验客户端信息是否匹配
3. 服务器寻找用户，获取用户信息以及加密后的密码
4. 校验密码
5. 校验成功后，获取用户角色信息后生成授权信息
6. 生成 `token`，并使用 `JWT` 加密，下发 `access_token` 和 `refresh_token`
7. 触发 授权成功/失败 钩子，可做其他信息的详细记录

授权的端点为 `/oauth/token`。同时除了 [Oauth2 RFC](https://tools.ietf.org/html/rfc6749#section-4) 中提到的四种授权模式，额外提供了一种刷新 `token` 的授权模式，用来刷新 `token`，参见 [Oauth2 Refresh token](https://tools.ietf.org/html/rfc6749#section-6) ，他们共用同一个端点，流程如下：

1. 授权成功后，得到 `refresh_token`
2. 置请求参数为 `refresh_token` ，携带 `refresh_token`
3. 服务器校验客户端信息是否匹配
4. 校验 `refresh_token` 是否在有效期之内
5. 生成新的 `access_token` 与 `refresh_token` 并下发

`token` 最大的特点莫过于无状态，可以说这是它的优点也是缺点，我们无法感知客户端的 `token` 是否在有效期内，所以在请求的时候，我们都会检验还有多久过期，一旦这个时间过短，我们就会发起刷新的请求，获取新的 `token`（包括 `access_token` 和 `refresh_token`），因而会有一个 `/oauth/check_token` 端口来作为我们检查 `token` 信息和有效期的接口，它的流程如下：

1. 服务器校验客户端信息是否匹配
2. 服务器校验 `access_token` 是否在有效期之内
3. 获取 `access_token` 中的用户信息和授权信息
4. 返回客户端

通过这三个接口我们可以完成如下流程

1. 授权得到 `access_token` 和 `refresh_token` 
2. 获取相应的 `token` 授权信息
3. 每次检验两者过期时间，临近过期请求刷新

通过这三个流程可以让用户无感知完成整个授权、刷新授权的流程。

### 鉴权流程

我们的授权流程如下：

1. 接收请求，解析 `token`，获取用户角色信息
2. 从资源表中查找**路径匹配**且**方法匹配**的资源
3. 获取与改资源的关联的角色信息
4. 对比用户是否拥有该资源的所需的角色信息

每一个资源（即请求）均在 `sys_permission` 中有所记录，分别有 `march_url` 与 `method` 字段来对一个请求进行过滤，然后通过关联表来获取授权角色信息。我们准备了几个用户不可知的系统角色来帮助这个授权流程，用户不会与这几个角色有任何关联：

| 角色英文    | 角色名称 | 角色描述                                 |
| ----------- | -------- | ---------------------------------------- |
| ROLE_PUBLIC | 公共     | 所有不需要登录就可以访问资源与此角色绑定 |
| ROLE_LOGIN  | 登录资源 | 只要登录即可访问的资源与此关联           |

通过这几个角色，我们可以更好的完成资源权限的管理和分配。

### JWT 令牌

上文多次提到，`token` 我们选择使用 `JWT 令牌`，参见 [JWT RFC7519](https://tools.ietf.org/html/rfc7519)，完全按照此规范实现，同时提供两种加密方式进行切换：

1. 对称密钥加密，参见 [RFC 6031](https://tools.ietf.org/html/rfc6031)
2. 非对称密钥加密，参见 [RFC 5959](https://tools.ietf.org/html/rfc5959)

项目中默认使用 `对称密钥加密`，信息的发送方和接收方用一个密钥去加密和解密数据，加/解密速度快，提高系统的安全性。当资源服务器与授权服务器分离之时，可以方便快捷的更换为非对称密钥加密。

## 快速

快，是我们使用 `spring-boot` 的核心原因，基于 `spring-boot` 可以让我们快速生成一个完整的 `web` 项目，虽然他也有不少缺点，但是它的快速开发理念依旧是非常实用的！省去了我们非常大的时间，*快* 的方面如下：

### 代码生成器

为了满足我们开发需要以及快速开发，我们自己书写了 **代码生成模块** 来完成快速生成模板化代码，包括生成 `entity` 实体类和 `repository` ，参见模块 [one-yard-generate](https://github.com/GeneralAndKing/one-yard/tree/master/one-yard-generate)，基于 Freemarker 的代码生成，流程如下：

1. `spring boot` 启动自动条件装配和运行我们的组件
2. 使用最快捷最底层的 `jdbc` 驱动来读取数据库的表信息和元数据
3. 通过 `freemarker` 启动依赖自定义配置读取和设置模板及变量
4. 渲染模板并在指定路径生成相应文件

代码生成器帮我们完成后端一些重复性的工作，书写代码生成器的时间换回的是大大减少了重复性工作所浪费的时间！

### 接口书写

使用 `spring-boot`的另一个方面，则是源于一个东西 `spring-data-rest`，通过这个依赖，我们可以快速的生成出来相应 `RestFul` 单表的 `CRUD`  操作接口。直接接口完全参照 `restful` 规范。

但是**对于这些生成的所有的接口我们都不对他们进行多表强关联**，都是单表操作即可，但是在一个复杂的系统中，不可能全部都是对单表的操作，不论是为了方便亦或是数据库事务处理，我们都需要对多表进行操作，所以我们还需要自定义接口。但是为了区分这些生成性和我们自己书写的的接口，我们约定如下规范：

| 接口前缀                     | 接口描述                                 | 类型 |
| ---------------------------- | ---------------------------------------- | ---- |
| /api/rest/profile            | 获取当前系统的所有 `REST` 资源与接口信息 | 生成 |
| /api/rest/{resource}/profile | 获取指定资源的接口信息                   | 生成 |
| /api/rest/{resource}/search  | 获取指定资源的扩展接口                   | 生成 |
| /api/{resouces}/{aciton}     | 自定义的接口的操作                       | 书写 |

通过前缀是否为 `rest` 来进行判断是否是生成的接口，但是不论是生成亦或是我们自己书写的接口，均离不开 `REST` 的核心：**通过 url 定位资源， 用 HTTP 动词（`GET`,`POST`,`DELETE`,`PATCH`,`PUT`）描述操作**。因而均遵循如下动词操作：

| HTTP 操作 | 含义                           |
| --------- | ------------------------------ |
| GET       | 获取资源信息，不论多个或是单个 |
| POST      | 新增资源信息，或是复杂操作     |
| PATCH     | 修改资源信息                   |

在整个系统中，我们只会允许使用这三种 HTTP 动词！

同时，我们以功能模块书写接口，与前端功能模块对应，将后端项目纵向切割，不再以实体类来创建相应的 `controller`，选择以功能模块命名来创建相应的 `controller`，在保证接口完整的情况下尽可能的少的去书写后端接口，将省下的时间去写前端。

### 缓存

当然，我们说到的快不能只是开发块，还有**运行快**。

授权与鉴权过程会涉及到很多表操作，所以我们引入了 `redis` 缓存来存放我们的 `token` 以及它的信息。但是现在的系统远远达不到需要所有数据都使用 `redis` 做缓存的地步，所以我们并不选择所有的数据都过一边 `redis` 缓存，我们选择性的将使用非常频繁 `token` 信息存放进去即可。就授权而言具有如下 keys ：

| key                 | 描述                                      |
| ------------------- | ----------------------------------------- |
| access              | access_token 与对应的信息，二进制存储     |
| access_to_refresh   | access_token转化 加密后的 刷新 token      |
| access_to_auth      | access_token 转化 授权的信息，二进制存储  |
| auth                | 授权信息，二进制存储                      |
| client_id_to_access | 客户端 id 对应的 访问信息                 |
| refresh             | refresh_token                             |
| refresh_to_auth     | refresh_token 转化 授权的信息，二进制存储 |
| refresh_auth        | 刷新的授权信息                            |
| uname_to_access     | 用户名的授权信息                          |

同时，我们利用 nosql 数据库的优点，我们将一些结构易变的系统运行和统计信息存放其中，现有的如下：

| key             | 描述                      |
| --------------- | ------------------------- |
| api-num={date}  | 指定 date 的 api 请求数量 |
| auth-num={date} | 指定 date 的 授权 数量    |

当然，拥有了 nosql 以后，我们可以做更多的扩展性的事，当然，这些都是在有需求的情况下可以进行扩展的。

### SQL 优化

对于大多数情况，都是单表操作，我们在尝试的时候发现，只有少数几个接口需要多表操作，但是查询的时候确实有不少地方需要许多表进行查询操作，对于多张表的情况，我们选择使用了 `视图` 来完善我们的查询。

我们现在有个需求需要通过五表联查来完成查询来方便前端的显示，以减少请求以及并发数量并提高性能，我们创建的视图如下：

```sql
create or replace view pm_info
as
select pm.*,
       m.`code`                as material_code,
       m.`name`                as material_name,
       m.specifications        as material_specifications,
       m.`number`              as material_number,
       m.`size`                as material_size,
       m.`unit`                as material_unit,
       m.procurement_lead_time as material_procurement_lead_time,
       mt.`name`               as material_type_name,
       mt.`code`               as material_type_code,
       sd.`name`               as `department_name`,
       mdp.`approval_status`   as `approval_status`,
       mdp.`plan_status`       as `plan_status`,
       mdp.`plan_type`         as `plan_type`
from (((
    (plan_material pm inner join material m on pm.material_id = m.id)
        inner join material_type mt on mt.id = pm.material_type_id)
    inner join material_demand_plan mdp on pm.plan_id = mdp.id)
         inner join sys_department sd on sd.id = mdp.department_id)
where pm.status = 0
  and pm.is_enable = 1
  and m.is_enable = 1
  and mt.is_enable = 1
  and sd.is_enable = 1
  and mdp.is_enable = 1;
```

通过这个视图，他会自动选择 `MERGE` 和 `TEMPTABLE` 算法来进行优化，同时配合索引来完成我们整个的查询，另外使用**内连接**，通过选择执行`NESTED LOOP` 和 `HASH`两种执行计划；当数据较少，使用第一种来最大限度的减少内存开销并尽快返回结果，当数据较多，使用第二种会有一些内存开销，但是大数据量下的处理速度是 `NESTED LOOP` 不可比拟的。

通过视图和内连接的使用，使得我们多表的查询时间下降了不少。

## 全面

我们开发过程中，尽可能的减少一个 `class` 的代码量，做到面向对象的五大原则，约定以下方式：

- controller：只做请求校验和参数校验
- service：只做逻辑处理以及事务处理
- repository：尽可能的只对单表进行操作

同时参照 阿里巴巴 java 开发手册 ，单个方法的总行数不超过80行，代码尽可能精简，接受并使用 `JDK` 的新特性，尽可能的通过配置将引入的依赖的功能发挥到最大化。

我们选择一些服务提供商来帮助我们更好的完成项目，减少自己重复造轮子的时间。这些服务提供商很大程度的提高了我们系统的完整性、全面性！

### 七牛云

直接使用七牛云免费图床，加快网页的访问速度，同时自己定制七牛云数据参数化，使其参数可以直接配置于应用之中

```yml
application:
  qiniu: # 七牛云配置
    area: 华南 # 可选值 华东 华南 华北 北美 东南亚 不填会自动判断
    access-key: 
    secret-key: 
    bucket: resource-pic
    domain: 
    dir-name: oneYard
    host: 
```

通过配置即可快速的完成图片的上传！

### 腾讯企业邮

为了提高系统完整性，我们希望引入邮件来完成我们的注册与找回密码功能，但我不们不再手动搭建相应的 smtp 邮件服务器，直接使用已有的域名申请腾讯企业邮来完成我们邮箱的发送，配合 `redis` 来完成验证码的校验。配置如下：

```yml
spring:
  mail:
    host: smtp.exmail.qq.com
    port: 465
    username: lessonCloud@japoul.cn
    password: 
    properties:
      mail:
        debug: true
        smtp:
          auth: true
          starttls:
            required: true
          socketFactory:
            class: javax.net.ssl.SSLSocketFactory
# 验证码配置
application:
  code:
    email-code-validity-minute: 30
    email-enable: true
```

### Druid 数据监控

除了上面两个意外，我们直接引用了 [Alibaba Druid](https://github.com/alibaba/druid) 来作为我们的数据源，相应的，其数据监控功能完美呈现于我们的应用之中，可以实时的对数据库的操作和运行进行监控和管理，

![Druid](http://image.japoul.cn/docs/%E6%B7%B1%E5%BA%A6%E6%88%AA%E5%9B%BE_%E9%80%89%E6%8B%A9%E5%8C%BA%E5%9F%9F_20191120204731.png)

- 管理员帐号： `admin`
- 管理员密码： `gak.123456789`

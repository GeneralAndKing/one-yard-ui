---
title: 附录：接口设计文档
---

## 附录：接口设计文档

接口文档是至关重要的一环，有了他，前后端才能更好的交互。下面是我们开发的时候的接口文档：

| name                                   | description                        | match_url                                                 | method |
| -------------------------------------- | ---------------------------------- | --------------------------------------------------------- | ------ |
| 接口说明                               | 获取当前系统的接口说明             | /**/profile                                               | GET    |
| 审批-获取单个数据                      |                                    | /rest/approval/*                                          | GET    |
| 审批-获取分页数据                      |                                    | /rest/approval                                            | GET    |
| 审批-获取全部数据                      |                                    | /rest/approval/search/all                                 | GET    |
| 审批-新增单个数据                      |                                    | /rest/approval                                            | POST   |
| 审批-修改单个数据                      |                                    | /rest/approval/*                                          | PATCH  |
| 仓库组织-获取单个数据                  |                                    | /rest/inventory/*                                         | GET    |
| 仓库组织-获取分页数据                  |                                    | /rest/inventory                                           | GET    |
| 仓库组织-获取全部数据                  |                                    | /rest/inventory/search/all                                | GET    |
| 仓库组织-新增单个数据                  |                                    | /rest/inventory                                           | POST   |
| 仓库组织-修改单个数据                  |                                    | /rest/inventory/*                                         | PATCH  |
| 物料-获取单个数据                      |                                    | /rest/material/*                                          | GET    |
| 物料-获取分页数据                      |                                    | /rest/material                                            | GET    |
| 物料-获取全部数据                      |                                    | /rest/material/search/all                                 | GET    |
| 物料-新增单个数据                      |                                    | /rest/material                                            | POST   |
| 物料-修改单个数据                      |                                    | /rest/material/*                                          | PATCH  |
| 物资需求计划-获取单个数据              |                                    | /rest/materialDemandPlan/*                                | GET    |
| 物资需求计划-获取分页数据              |                                    | /rest/materialDemandPlan                                  | GET    |
| 物资需求计划-获取全部数据              |                                    | /rest/materialDemandPlan/search/all                       | GET    |
| 物资需求计划-新增单个数据              |                                    | /rest/materialDemandPlan                                  | POST   |
| 物资需求计划-修改单个数据              |                                    | /rest/materialDemandPlan/*                                | PATCH  |
| 物料需求计划汇总-获取单个数据          |                                    | /rest/materialPlanSummary/*                               | GET    |
| 物料需求计划汇总-获取分页数据          |                                    | /rest/materialPlanSummary                                 | GET    |
| 物料需求计划汇总-获取全部数据          |                                    | /rest/materialPlanSummary/search/all                      | GET    |
| 物料需求计划汇总-新增单个数据          |                                    | /rest/materialPlanSummary                                 | POST   |
| 物料需求计划汇总-修改单个数据          |                                    | /rest/materialPlanSummary/*                               | PATCH  |
| 物料类别-获取单个数据                  |                                    | /rest/materialType/*                                      | GET    |
| 物料类别-获取分页数据                  |                                    | /rest/materialType                                        | GET    |
| 物料类别-获取全部数据                  |                                    | /rest/materialType/search/all                             | GET    |
| 物料类别-新增单个数据                  |                                    | /rest/materialType                                        | POST   |
| 物料类别-修改单个数据                  |                                    | /rest/materialType/*                                      | PATCH  |
| 通知-获取单个数据                      |                                    | /rest/notification/*                                      | GET    |
| 通知-获取分页数据                      |                                    | /rest/notification                                        | GET    |
| 通知-获取全部数据                      |                                    | /rest/notification/search/all                             | GET    |
| 通知-新增单个数据                      |                                    | /rest/notification                                        | POST   |
| 通知-修改单个数据                      |                                    | /rest/notification/*                                      | PATCH  |
| 计划所需物资-获取单个数据              |                                    | /rest/planMaterial/*                                      | GET    |
| 计划所需物资-获取分页数据              |                                    | /rest/planMaterial                                        | GET    |
| 计划所需物资-获取全部数据              |                                    | /rest/planMaterial/search/all                             | GET    |
| 计划所需物资-新增单个数据              |                                    | /rest/planMaterial                                        | POST   |
| 计划所需物资-修改单个数据              |                                    | /rest/planMaterial/*                                      | PATCH  |
| 采购计划-获取单个数据                  |                                    | /rest/procurementPlan/*                                   | GET    |
| 采购计划-获取分页数据                  |                                    | /rest/procurementPlan                                     | GET    |
| 采购计划-获取全部数据                  |                                    | /rest/procurementPlan/search/all                          | GET    |
| 采购计划-新增单个数据                  |                                    | /rest/procurementPlan                                     | POST   |
| 采购计划-修改单个数据                  |                                    | /rest/procurementPlan/*                                   | PATCH  |
| 供应商-获取单个数据                    |                                    | /rest/supplier/*                                          | GET    |
| 供应商-获取分页数据                    |                                    | /rest/supplier                                            | GET    |
| 供应商-获取全部数据                    |                                    | /rest/supplier/search/all                                 | GET    |
| 供应商-新增单个数据                    |                                    | /rest/supplier                                            | POST   |
| 供应商-修改单个数据                    |                                    | /rest/supplier/*                                          | PATCH  |
| 部门-获取单个数据                      |                                    | /rest/sysDepartment/*                                     | GET    |
| 部门-获取分页数据                      |                                    | /rest/sysDepartment                                       | GET    |
| 部门-获取全部数据                      |                                    | /rest/sysDepartment/search/all                            | GET    |
| 部门-新增单个数据                      |                                    | /rest/sysDepartment                                       | POST   |
| 部门-修改单个数据                      |                                    | /rest/sysDepartment/*                                     | PATCH  |
| 权限-获取单个数据                      |                                    | /rest/sysPermission/*                                     | GET    |
| 权限-获取分页数据                      |                                    | /rest/sysPermission                                       | GET    |
| 权限-获取全部数据                      |                                    | /rest/sysPermission/search/all                            | GET    |
| 权限-新增单个数据                      |                                    | /rest/sysPermission                                       | POST   |
| 权限-修改单个数据                      |                                    | /rest/sysPermission/*                                     | PATCH  |
| 角色-获取单个数据                      |                                    | /rest/sysRole/*                                           | GET    |
| 角色-获取分页数据                      |                                    | /rest/sysRole                                             | GET    |
| 角色-获取全部数据                      |                                    | /rest/sysRole/search/all                                  | GET    |
| 角色-新增单个数据                      |                                    | /rest/sysRole                                             | POST   |
| 角色-修改单个数据                      |                                    | /rest/sysRole/*                                           | PATCH  |
| 用户-获取单个数据                      |                                    | /rest/sysUser/*                                           | GET    |
| 用户-获取分页数据                      |                                    | /rest/sysUser                                             | GET    |
| 用户-获取全部数据                      |                                    | /rest/sysUser/search/all                                  | GET    |
| 用户-新增单个数据                      |                                    | /rest/sysUser                                             | POST   |
| 用户-修改单个数据                      |                                    | /rest/sysUser/*                                           | PATCH  |
| 用户—获取用户详细                      | 获取所有                           | /sysUser/all                                              | GET    |
| 用户—通过部门di列表获取                | 通过部门ids查询.                   | /sysUser/byDepartments/*                                  | GET    |
| 授权—获取当前授权用户的详细信息        | 获取当前用户的信息.                | /sysUser/me                                               | GET    |
| 授权—修改当前登录用户的密码            | 修改密码.                          | /sysUser/password/modify                                  | POST   |
| 采购—根据id查询完整的采购计划表.       | 根据id查询完整的采购计划表.        | /procurementPlan/all/*                                    | GET    |
| 采购—审批采购计划.                     | 审批采购计划.                      | /procurementPlan/approvalProcurementPlan                  | POST   |
| 采购—撤回审批                          | 撤回审批.                          | /procurementPlan/withdrawApproval                         | POST   |
| 采购—保存/修改                         | 保存/修改采购计划表.               | /procurementPlan/procurementPlan                          | POST   |
| 物料—退回需求                          | 退回需求.                          | /planMaterial/backPlanOrMaterial                          | POST   |
| 物料—合并数据                          | 合并数据.                          | /planMaterial/mergeMaterialPlan                           | POST   |
| 物料—拆分数据                          | 拆分数据.                          | /planMaterial/splitMaterialPlan                           | POST   |
| 汇总—根据id查询完整的汇总表.           | 根据id查询完整的汇总表.            | /materialPlanSummary/getMaterialPlanSummary/*             | GET    |
| 物料计划—保存/修改物料计划表.          | 保存/修改物料计划表.               | /materialDemandPlan/materialPlan                          | POST   |
| 物料计划—更具id查询完整的              | 根据id查询完整的计划表.            | /materialDemandPlan/materialPlan                          | GET    |
| 物料计划—主管审批需求                  | 主管审批需求物料计划.              | /materialDemandPlan/approvalMaterialPlan                  | POST   |
| 物料计划—撤回审批请求                  | 撤回审批.                          | /materialDemandPlan/withdrawApproval/*                    | PATCH  |
| 用户—上传头像                          | 头像上传,用户.                     | /files/avatar                                             | POST   |
| 用户—上传修改登录的用户头像            | 头像上传，自己.                    | /files/avatar/self                                        | POST   |
| 审批—根据计划id和审批类型查询审批流程. | 根据计划id和审批类型查询审批流程.  | /rest/approval/search/byPlanIdAndApprovalType             | GET    |
| 物料计划—根据两个状态查询计划表.       | 根据两个状态查询计划表.            | /rest/materialDemandPlan/search/byStatusOfPlanAndApproval | GET    |
| 物料计划—根据创建者查询计划表.         | 根据创建者查询计划表.              | /rest/materialDemandPlan/search/byCreateUser              | GET    |
| 物料计划—根据部门id列表查询需求计划表. | 根据部门id列表查询需求计划表.      | /rest/materialDemandPlan/search/byDepartmentIds           | GET    |
| 汇总—根据name查询汇总表.               | 根据name查询汇总表.                | /rest/materialPlanSummary/search/byName                   | GET    |
| 物料主数据—通过类型id查.               | 通过类型id查.                      | /rest/material/search/byTypeId                            | GET    |
| 通知—通过回复查询.                     | 通过回复查询.                      | /rest/notification/search/byReceiverId                    | GET    |
| 物料—根据需求计划id查询所需物资.       | 根据需求计划id查询所需物资.        | /rest/planMaterial/search/byPlanId                        | GET    |
| 采购—根据需求计划id查询所需物资.       | 根据状态查询采购计划.              | /rest/procurementPlan/search/byStatus                     | GET    |
| 采购—根据需求计划id查询所需物资.       | 根据创建者查询采购计划.            | /rest/procurementPlan/search/byCreateUser                 | GET    |
| 部门—通过角色id查询.                   | 通过角色id查询.                    | /rest/sysDepartment/search/byRoles                        | GET    |
| 权限—通过角色查询.                     | 通过角色查询.                      | /rest/sysPermission/search/byRole                         | GET    |
| 角色—根据部门号查询角色.               | 根据部门号查询角色.                | /rest/sysRole/search/byDepartment                         | GET    |
| 角色—根据部门号查询角色.               | 根据部门号查询角色.                | /rest/sysRole/search/byDepartments                        | GET    |
| 角色—根据用户查询角色.                 | 根据用户查询角色.                  | /rest/sysRole/search/byUser                               | GET    |
| 角色—根据权限查询角色.                 | 根据权限查询角色.                  | /rest/sysRole/search/byPermission                         | GET    |
| 用户—根据角色id查询用户.               | 根据角色id查询用户.                | /rest/sysUser/search/byRole                               | GET    |
| 用户—通过部门的ids查询用户.            | 通过部门的ids查询用户.             | /rest/sysUser/search/byDepartments                        | GET    |
| 用户—根据邮箱查询用户.                 | 根据邮箱查询用户.                  | /rest/sysUser/search/byEmail                              | GET    |
| 用户—根据邮箱和名称查询用户.           | 根据邮箱和名称查询用户.            | /rest/sysUser/search/byUsernameOrEmail                    | GET    |
| 用户—根据名称查询用户.                 | 根据名称查询用户.                  | /rest/sysUser/search/byUsername                           | GET    |
| 用户—根据邮箱和名称和手机号查询用户.   | 根据邮箱和名称和手机号查询用户.    | /rest/sysUser/search/byUsernameOrEmailOrPhone             | GET    |
| 授权—邮箱验证                          | 验证邮箱帐号是否已经存在           | /rest/sysUser/search/existsByEmail                        | GET    |
| 授权—用户名验证                        | 验证用户帐号是否已经存在           | /rest/sysUser/search/existsByUsername*                    | GET    |
| 授权—手机验证                          | 验证手机号码是否已经存在           | /rest/sysUser/search/existsByPhone                        | GET    |
| 授权—注册—获取验证码                   | 获取邮箱验证码验证邮箱             | /auth/register/**                                         | GET    |
| 授权—注册—完成注册                     | 验证验证码并注册用户               | /auth/register                                            | POST   |
| 授权—找回—验证邮箱                     | 验证邮箱是否存在并下发、验证验证码 | /auth/forget/**                                           | GET    |
| 授权—找回—修改密码                     | 验证后对用户密码进行修改           | /auth/forget                                              | POST   |
| 通知—消息链接                          | 建立用户消息通知                   | /notify/*                                                 | GET    |
| 用户管理—获取所有用户                  | 管理员获取所有用户                 | /sysUser/all                                              | GET    |
| 物料—检验编码是否存在                  | 添加/编辑物料时检验                | /rest/materialType/search/existsByCode                    | GET    |
| 物料分类—检验编码分类是否存在          | 添加/编辑物料分类时检验            | /rest/material/search/existsByCode                        | GET    |
| 仪表盘—查询用户数量                    | 查询用户数量                       | /rest/sysUser/search/count                                | GET    |
| 仪表盘—查询物料数量                    | 查询物料数量                       | /rest/material/search/count                               | GET    |
| 仪表盘—查询 api 请求数量               | 查询 api 请求数量                  | /dashboard/api                                            | GET    |
| 仪表盘—查询 api 授权次数               | 查询 api 授权次数                  | /dashboard/auth                                           | GET    |
| 仪表盘—查询计划总量                    | 查询计划总量                       | /rest/materialDemandPlan/search/count                     | GET    |
| 仪表盘—查询采购最终数量                | 查询采购最终数量                   | /rest/procurementPlan/search/count                        | GET    |
| 修改用户自己的信息                     | 当前登录用户修改信息               | /sysUser/setting                                          | POST   |
| druid 监控                             | druid 监控                         | /druid/**                                                 | ALL    |

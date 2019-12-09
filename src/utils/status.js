/**
 * 用作需求计划搜索的时候选择
 * @type {*[]}
 */
export const planStatus = [
  { name: '', value: '' },
  { name: '自由', value: 'FREE' },
  { name: '提交审批', value: 'APPROVAL' },
  { name: '提交至汇总', value: 'SUMMARY' },
  { name: '已删除', value: 'DELETED' },
  { name: '已终止', value: 'FINALLY' }
]

/**
 * 用作填写的时候选择
 * @type {*[]}
 */
export const planStatusSelect = [
  { name: '自由', value: 'FREE' },
  { name: '提交审批', value: 'APPROVAL' },
  { name: '提交至汇总', value: 'SUMMARY' },
  { name: '已删除', value: 'DELETED' },
  { name: '已终止', value: 'FINALLY' }
]

/**
 * 用作采购计划搜索的时候选择
 * @type {*[]}
 */
export const procurementPlanStatus = [
  { name: '', value: '' },
  { name: '自由', value: 'FREE' },
  { name: '待采购主管审批', value: 'APPROVAL' },
  { name: '待财务进行审批', value: 'PROCUREMENT_OK' },
  { name: '进入采购订单阶段', value: 'FINALLY' }
]

// ----------------------------------------------------------------------------------

/**
 * 用作搜索的时候选择
 * @type {*[]}
 */
export const approvalStatus = [
  { name: '', value: '' },
  { name: '未提交', value: 'NO_SUBMIT' },
  { name: '审批中', value: 'APPROVAL_ING' },
  { name: '审批通过', value: 'APPROVAL_OK' },
  { name: '审批退回', value: 'APPROVAL_NO' }
]

/**
 * 用作填写的时候选择
 * @type {*[]}
 */
export const approvalStatusSelect = [
  { name: '未提交', value: 'NO_SUBMIT' },
  { name: '审批中', value: 'APPROVAL_ING' },
  { name: '审批通过', value: 'APPROVAL_OK' },
  { name: '审批退回', value: 'APPROVAL_NO' }
]

// ----------------------------------------------------------------------------------

/**
 * 用作搜索的时候选择
 * @type {*[]}
 */
export const planTypes = [ '', '订单型需求计划', '年度计划', '月度计划', '紧急计划' ]

/**
 * 用作填写的时候选择
 * @type {*[]}
 */
export const planTypesSelect = [ '订单型需求计划', '年度计划', '月度计划', '紧急计划' ]

// ----------------------------------------------------------------------------------

/**
 * 采购订单类型
 * @type {string[]}
 */
export const orderType = [ '', '标准采购订单', '框架协议订单', '紧急订单' ]

/**
 * 采购订单类型选择
 * @type {string[]}
 */
export const orderTypeSelect = [ '标准采购订单', '框架协议订单', '紧急订单' ]

/**
 * 格式化采购订单类型
 * @param type
 * @returns {string|null}
 */
export const formatOrderTypeSelect = (type) => {
  if (type === orderTypeSelect[0]) return 'A'
  else if (type === orderTypeSelect[1]) return 'B'
  else if (type === orderTypeSelect[2]) return 'C'
  else return null
}

// ----------------------------------------------------------------------------------

/**
 * 采购订单状态
 * @type {({name: string, value: string}|{name: string, value: string}|{name: string, value: string}|{name: string, value: string}|{name: string, value: string})[]}
 */
export const procurementOrderPlanStatus = [
  { name: '', value: '' },
  { name: '待提交', value: 'NO_SUBMIT' },
  { name: '提交审批', value: 'APPROVAL' },
  { name: '取消审批', value: 'APPROVAL_CANCEL' },
  { name: '未完成', value: 'UNFINISHED' },
  { name: '已完成', value: 'FINISHED' },
  { name: '变更审批中', value: 'CHANGED' },
  { name: '已生效', value: 'EFFECTIVE' },
  { name: '已作废', value: 'CANCEL' }
]
/**
 * 采购订单状态
 * @type {({name: string, value: string}|{name: string, value: string}|{name: string, value: string}|{name: string, value: string}|{name: string, value: string})[]}
 */
export const procurementOrderPlanStatusSelect = [
  { name: '待提交', value: 'NO_SUBMIT' },
  { name: '提交审批', value: 'APPROVAL' },
  { name: '取消审批', value: 'APPROVAL_CANCEL' },
  { name: '未完成', value: 'UNFINISHED' },
  { name: '已完成', value: 'FINISHED' },
  { name: '变更审批中', value: 'CHANGED' },
  { name: '已生效', value: 'EFFECTIVE' },
  { name: '已作废', value: 'CANCEL' }
]

/**
 * 用作搜索的时候选择
 * @type {*[]}
 */
export const planStatus = [
  { name: '', value: '' },
  { name: '自由', value: 'FREE' },
  { name: '提交审批', value: 'APPROVAL' },
  { name: '提交至汇总', value: 'SUMMARY' },
  { name: '已删除', value: 'DELETED' },
  { name: '采购主管审批通过', value: 'PROCUREMENT_OK' },
  { name: '已终止', value: 'FINALLY' }
]
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
 * 用作搜索的时候选择
 * @type {*[]}
 */
export const planTypes = [ '', '订单型需求计划', '年度计划', '月度计划', '紧急计划' ]
/**
 * 用作填写的时候选择
 * @type {*[]}
 */
export const planTypesSelect = [ '订单型需求计划', '年度计划', '月度计划', '紧急计划' ]
/**
 * 用作填写的时候选择
 * @type {*[]}
 */
export const planStatusSelect = [
  { name: '自由', value: 'FREE' },
  { name: '提交审批', value: 'APPROVAL' },
  { name: '提交至汇总', value: 'SUMMARY' },
  { name: '已删除', value: 'DELETED' },
  { name: '采购主管审批通过', value: 'PROCUREMENT_OK' },
  { name: '已终止', value: 'FINALLY' }
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
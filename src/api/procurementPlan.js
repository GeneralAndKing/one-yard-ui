import axios from './index'

const PROCUREMENT_PLAN = 'procurementPlan'

/**
 * 保存或者更新
 *
 * @param procurementPlan
 * @param desserts
 * @returns {Promise<unknown>}
 */
export const saveOrUpdate = (procurementPlan, desserts) => {
  return axios.request({
    url: `/${PROCUREMENT_PLAN}/procurementPlan`,
    method: 'post',
    data: { procurementPlan, desserts }
  })
}

/**
 * 根据id获取完整的采购计划
 * @param id
 * @returns {*}
 */
export const getProcurementPlan = (id) => {
  return axios.request({
    url: `/procurementPlan/all/${id}`,
    method: 'get'
  })
}

/**
 * 审批采购计划
 * @param procurementPlan
 * @param approval
 * @returns {*}
 */
export const approvalProcurementPlan = (procurementPlan, approval) => {
  return axios.request({
    url: `/procurementPlan/approvalProcurementPlan`,
    method: 'post',
    data: { procurementPlan, approval }
  })
}

/**
 * 撤回
 * @param procurementPlan
 * @param role
 * @returns {*}
 */
export const withdrawApproval = (procurementPlan, role) => {
  return axios.request({
    url: `/procurementPlan/withdrawApproval`,
    method: 'post',
    data: { procurementPlan, role }
  })
}

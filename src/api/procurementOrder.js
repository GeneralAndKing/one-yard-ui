import axios from './index'

const PROCUREMENT_ORDER = 'procurementOrder'

/**
 * 保存或修改订单
 *
 * @returns {Promise<unknown>}
 * @param procurementOrder
 * @param procurementMaterials
 * @param orderTerms
 */
export const submit = (procurementOrder, procurementMaterials, orderTerms) => {
  return axios.request({
    url: `/${PROCUREMENT_ORDER}/procurementOrder`,
    method: 'post',
    data: { procurementOrder, procurementMaterials, orderTerms }
  })
}

/**
 * 撤回审批
 * @param procurementOrderId
 * @returns {*}
 */
export const withdrawApproval = (procurementOrderId) => {
  return axios.request({
    url: `/${PROCUREMENT_ORDER}/withdrawApproval`,
    method: 'post',
    data: {
      procurementOrderId: procurementOrderId
    }
  })
}

/**
 * 审批订单
 * @param procurementOrder
 * @param approval
 * @returns {*}
 */
export const approvalProcurementOrder = (procurementOrder, approval) => {
  return axios.request({
    url: `/${PROCUREMENT_ORDER}/approvalProcurementOrder`,
    method: 'post',
    data: { procurementOrder, approval }
  })
}

// 删除订单
export const deleteProcurementOrder = (id) => {
  return axios.request({
    url: `/${PROCUREMENT_ORDER}/delete`,
    method: 'post',
    data: { id }
  })
}

// 更改订单
export const changeProcurementOrder = (id, procurementMaterials) => {
  return axios.request({
    url: `/${PROCUREMENT_ORDER}/change`,
    method: 'post',
    data: { id, procurementMaterials }
  })
}

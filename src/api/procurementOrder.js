import axios from './index'

const PLAN_MATERIAL = 'procurementOrder'

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
    url: `/${PLAN_MATERIAL}/procurementOrder`,
    method: 'post',
    data: { procurementOrder, procurementMaterials, orderTerms }
  })
}

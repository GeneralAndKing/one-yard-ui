import axios from './index'

const MATERIAL_DEMAND_PLAN = 'materialDemandPlan'

/**
 * 保存或者更新
 *
 * @param materialPlan
 * @param desserts
 * @returns {Promise<unknown>}
 */
export const saveOrUpdate = (materialPlan, desserts) => {
  return axios.request({
    url: `/${MATERIAL_DEMAND_PLAN}/materialPlan`,
    method: 'post',
    data: { materialPlan, desserts }
  })
}

export const planMaterialByPlanId = (id) => {
  return axios.request({
    url: `/rest/planMaterial/search/byPlanId`,
    method: 'get',
    params: { id }
  })
}

export const materialPlanById = (id) => {
  return axios.request({
    url: `/materialDemandPlan/materialPlan`,
    method: 'get',
    params: { id }
  })
}

export const approvalMaterialPlan = (materialPlan, approval) => {
  return axios.request({
    url: `/materialDemandPlan/approvalMaterialPlan`,
    method: 'post',
    data: { materialPlan, approval }
  })
}

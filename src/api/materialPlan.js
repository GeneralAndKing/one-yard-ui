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
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/${MATERIAL_DEMAND_PLAN}/materialPlan`,
      method: 'post',
      data: { materialPlan, desserts }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export const planMaterialByPlanId = (id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/planMaterial/search/byPlanId`,
      method: 'get',
      params: { id }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export const materialPlanById = (id) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/materialDemandPlan/materialPlan`,
      method: 'get',
      params: { id }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export const approvalMaterialPlan = (materialPlan, approval) => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/materialDemandPlan/approvalMaterialPlan`,
      method: 'post',
      data: { materialPlan, approval }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

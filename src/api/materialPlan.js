import axios from './index'

const MATERIAL_DEMAND_PLAN = '/materialDemandPlan'

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
      url: `${MATERIAL_DEMAND_PLAN}/materialPlan`,
      method: 'post',
      data: { materialPlan, desserts }
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

export const getAll = () => {
  return new Promise((resolve, reject) => {
    axios.request({
      url: `/rest/${MATERIAL_DEMAND_PLAN}`,
      method: 'get'
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

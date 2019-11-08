import axios from './index'

const MATERIAL_DEMAND_PLAN = '/materialDemandPlan'
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

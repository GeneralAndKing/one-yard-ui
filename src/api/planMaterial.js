import axios from './index'

const PLAN_MATERIAL = 'planMaterial'

/**
 * 退回需求
 *
 * @param planMaterial
 * @param approve
 * @param flag <boolean>
 * @returns {Promise<unknown>}
 */
export const backPlanOrMaterial = (planMaterial, approve, flag) => {
  return axios.request({
    url: `/${PLAN_MATERIAL}/backPlanOrMaterial`,
    method: 'post',
    data: { planMaterial, approve, flag }
  })
}

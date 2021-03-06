import request from '@/utils/request'

export function getPlanList() {
  return request({
    url: 'https://api.daqiongzi.com/family/family/plans',
    method: 'get'
  })
}

export function createPlan(data) {
  return request({
    url: 'https://api.daqiongzi.com/family/family/plan',
    method: 'post',
    data
  })
}
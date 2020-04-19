import request from '@/utils/request'

export function getData(params) {
  return request({
    url: 'https://api.daqiongzi.com/family/xxgg/growth',
    method: 'get',
    params
  })
}

export function updateData(data) {
  return request({
    url: 'https://api.daqiongzi.com/family/xxgg/growth',
    method: 'post',
    data
  })
}

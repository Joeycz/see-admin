import request from '@/utils/request'

export function getOnenews(query) {
  return request({
    url: 'https://api.daqiongzi.com/media/onenews',
    params: query,
    method: 'get'
  })
}
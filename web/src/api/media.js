import request from '@/utils/request'

export function getOnenews(query) {
  return request({
    url: 'http://ali.daqiongzi.com/media/onenews',
    params: query,
    method: 'get'
  })
}
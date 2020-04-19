import request from '@/utils/request'

export function getOnenews(query) {
  return request({
    url: 'https://ali.daqiongzi.com/media/onenews',
    params: query,
    method: 'get'
  })
}
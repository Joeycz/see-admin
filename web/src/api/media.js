import request from '@/utils/request'

export function getOnenews() {
  return request({
    url: 'https://api.daqiongzi.com/media/onenews',
    method: 'get'
  })
}
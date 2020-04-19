import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'https://api.daqiongzi.com/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'https://api.daqiongzi.com/users/userInfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/opLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/opInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

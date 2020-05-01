import request from '@/utils/request'
import config from '../config/common.json'

export function getUploadToken() {
  return request({
    url: `${config.apiHost}qiniu/upload/token`,
    method: 'get'
  })
}

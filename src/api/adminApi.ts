import { request } from '../utils/request'
export const getCode = () => {
  request.post('/get')
}

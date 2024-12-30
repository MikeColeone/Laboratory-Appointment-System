import request from '../utils/request'


export const getLab = () => {
  request.get('/lab')
}

export const getUser = () => {
  request.get('/user')
}

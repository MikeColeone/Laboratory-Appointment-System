//实验室
export interface Lab {
  typeName: any
  id: number
  number: number
  name: string
  information: LabInformation | null
  news: string
  insert_time: string
  update_time: string
}
export interface LabInformation {
  count: number
  status: string
  system: string
  version: string
  kind: string
}
export interface LabType {
  id: number
  name: string
}

export interface course {
  id: number
  uid: number //登陆教师的id
  lid: number //实验室id
  count: number //课程人数
  name: string //课程名称
  information: courseInformation | null
}

export interface courseInformation {
  hours: string //学时
  experimentalHourse: string //实验学时
  semester: string //学年
  grade: string //年级
  class: string //班级
}

//预约表
// 枚举类型：预约状态
export enum AppointmentStatus {
  PENDING = 'pending', // 待处理
  APPROVED = 'approved', // 已批准
  REJECTED = 'rejected', // 已拒绝
  CANCELED = 'canceled', // 已取消
}

// 预约详细信息
export interface AppointmentDetails {
  reason?: string // 预约原因
  duration?: {
    // 持续时间
    start: string // 起始周
    end: string // 结束周
  }
  participants?: string // 参与者（预约人）
}

// 预约接口
export interface Appointment {
  id: number // 预约ID
  uid: number // 用户ID
  lid: number // 实验室ID
  cid: number // 课程ID
  week: number // 周次
  section: number // 节次
  dayOfWeek: number // 星期几
  status: AppointmentStatus // 预约状态
  details?: AppointmentDetails // 详细信息
  insertTime: string // 创建时间（ISO 时间字符串）
  updateTime: string // 更新时间（ISO 时间字符串）
}

// 分页数据结构
export interface PaginatedAppointments {
  data: Appointment[] // 预约列表
  total: number // 总记录数
  page: number // 当前页码
  pageSize: number // 每页记录数
}

export enum roles {
  ADMIN = '管理员',
  TEACHER = '教师',
  SUPERADMIN = '超级管理员',
}
export interface users {
  id: number
  username: string
  phone: string
  account: string
  password: string
}

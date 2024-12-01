export interface ResultVO<T> {
  code: number // 状态码
  message: string // 返回消息
  data: T // 泛型数据类型
  timestamp: number // 时间戳
}

// private int code;//状态码
// private String message;//返回信息
// private Object data;//返回数据
// private long timestamp;// 时间戳

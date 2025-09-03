export type ApiResponse<T = unknown> = {
  status: boolean
  message: string
  data: T | null
}

export class response {
  static success<T>(message: string, data: T): ApiResponse<T> {
    return { status: true, message, data }
  }

  static error(message: string): ApiResponse<null> {
    return { status: false, message, data: null }
  }
}

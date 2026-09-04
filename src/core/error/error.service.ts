export class Exception extends Error {
  detailedException: any
  httpResponseCode: number
  message: string

  constructor(errObject: any, detailedException?: any) {
    super(typeof errObject === 'string' ? errObject : errObject?.message || 'Bad Request')
    this.httpResponseCode =
      errObject?.httpResponseCode ||
      errObject?.statusCode ||
      errObject?.status ||
      400
    this.message =
      (typeof errObject === 'string' ? errObject : errObject?.message) || 'Bad Request'
    this.detailedException = errObject?.detailedException || detailedException
    if (!Array.isArray(this.detailedException) && this.detailedException) {
      this.detailedException = [this.detailedException]
    }
  }
}

import { Response } from 'express'

export const send = (res: Response, data: any = {}, errors?: any, httpStatusCode?: number) => {
  let apiResponse: string
  let specialStatusCode: number | undefined
  let statusCode = 200

  let { message } = data
  delete data.message
  message = message || errors?.message

  if (errors?.message) {
    delete errors.message
  }
  const errorList = errors?.detailedException
  if (errors) {
    apiResponse = 'FAILED'
    statusCode = errors.httpResponseCode || statusCode
  } else {
    if (res.req.method === 'GET') statusCode = 200
    else if (res.req.method === 'POST') statusCode = 201
    else if (res.req.method === 'PUT' || res.req.method === 'DELETE') statusCode = 202
    apiResponse = 'SUCCESS'

    if (Object.keys(data).length === 0 || data?.items?.length === 0) {
      message = message || 'No Record Found'
      specialStatusCode = 204
    }

    if (data['0']) {
      data = Object.values(data)
    }
  }

  if (httpStatusCode) {
    statusCode = httpStatusCode
  }

  res.status(statusCode).json({
    response: {
      status: apiResponse,
      message: message || '',
      code: specialStatusCode || statusCode,
      errors: errorList || [],
    },
    data,
  })
}

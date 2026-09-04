/* eslint-disable prefer-rest-params */
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Exception } from '../error/error.service'

const validatorMethod = async (classRef: any, input: any) => {
  const classInstance = plainToClass(classRef, input)
  const result = await validate(classInstance as object, { validationError: { target: false } })
  const constraintsWrapper = (obj: any) => {
    const errors: any[] = []
    for (const key in obj.constraints) {
      const errDetail: any = {}
      errDetail[obj.property] = obj.constraints[key]
      errors.push(errDetail)
    }
    return errors
  }

  if (result.length) {
    const allErrors: any[] = []
    result.forEach((obj: any) => {
      if (obj.constraints) {
        allErrors.push({
          property: obj.property,
          errors: constraintsWrapper(obj),
          children: [],
        })
      } else {
        const err: any = { property: obj.property, errors: [], childeren: [] }
        ;(obj.children || []).forEach((child: any) => {
          err.childeren.push(...constraintsWrapper(child))
        })
        allErrors.push(err)
      }
    })
    throw new Exception('Validation exception!', allErrors)
  }
}

function isClassType(type: any): boolean {
  return type && typeof type === 'function' && /^class\s/.test(Function.prototype.toString.call(type))
}

export function Validator() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const method = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const refs = Reflect.getMetadata('design:paramtypes', target, propertyKey)
      const all = (refs || []).map((obj: any, index: number) => {
        if (isClassType(obj)) {
          return validatorMethod(obj, args[index])
        }
      })
      await Promise.all(all.filter((item: any) => item !== undefined))
      return method.apply(this, args)
    }
  }
}

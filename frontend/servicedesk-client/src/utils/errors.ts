import { ApiError } from '../services/api'

export function getErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) {
    if (error.errors) {
      return Object.values(error.errors).flat()
    }
    return [error.message]
  }
  return ['Something went wrong. Please try again.']
}
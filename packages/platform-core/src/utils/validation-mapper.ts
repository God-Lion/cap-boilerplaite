import { UseFormSetError, FieldValues, Path } from 'react-hook-form'
import { ApiErrorResponse } from '@cap/shared-types' // Assuming this is exported

/**
 * Maps AdonisJS validation errors to React Hook Form errors.
 *
 * @param error - The error object returned from the API catch block.
 * @param setError - The setError function from useForm.
 */
export const mapValidationErrors = <T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>,
) => {
  if (!error || !error.response) return

  const data = error.response.data as ApiErrorResponse

  if (data && data.errors) {
    Object.entries(data.errors).forEach(([field, messages]) => {
      // Adonis returns array of messages, we take the first one
      if (messages && messages.length > 0) {
        setError(field as Path<T>, {
          type: 'server',
          message: messages[0],
        })
      }
    })
  }
}

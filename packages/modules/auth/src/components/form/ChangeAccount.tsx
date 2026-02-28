import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Grid, TextField, Button, Stack, Backdrop, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import FormLayout from './FormLayout'
import { useMutation } from '@tanstack/react-query'
import { IUserResponse, IUpdateNames } from '@cap/platform-core'

export default function ChangeAccount({ user }: { user: IUserResponse }) {
  const { t } = useTranslation()
  const [loading, setLoading] = React.useState<boolean>(false)

  const schema = z.object({
    firstname: z.string().min(1, t('auth.common.field_required')),
    lastname: z.string().min(1, t('auth.common.field_required')),
  })

  const controlForm = useForm<IUpdateNames>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      lastname: user.lastName,
      firstname: user.firstName,
    },
  })
  const mutation = useMutation({
    mutationFn: async (data: IUpdateNames) => {
      let body = {} as {
        lastname?: string
        firstname?: string
      }
      const hasChangedFirstname = user.firstName?.toLowerCase() !== data.firstname?.toLowerCase()
      const hasChangedFirstnameCase = !hasChangedFirstname && user.firstName !== data.firstname

      if (hasChangedFirstname) body = { ...body, firstname: data.firstname }
      if (hasChangedFirstnameCase)
        controlForm.setError(
          'firstname',
          {
            type: 'exist',
            message: t('auth.account.firstname_matches_current'),
          },
          { shouldFocus: true },
        )
      else controlForm.clearErrors('firstname')

      const hasChangedLastname = user.lastName?.toLowerCase() !== data.lastname?.toLowerCase()
      const hasChangedLastnameCase = !hasChangedLastname && user.lastName !== data.lastname

      if (hasChangedLastname) body = { ...body, lastname: data.lastname }
      if (hasChangedLastnameCase)
        controlForm.setError(
          'lastname',
          {
            type: 'exist',
            message: t('auth.account.lastname_matches_current'),
          },
          { shouldFocus: true },
        )
      else controlForm.clearErrors('lastname')
      console.log(body)

      // return await userService.updateNames(body)
    },
    onMutate: (variables) => {
      console.log('onMutate variables ', variables)
      setLoading(true)
    },
    onError: (error, variables, context) => {
      console.log('onError ', { error, variables, context })

      // An error happened!
      // console.log(`rolling back optimistic update with id ${context.id}`)
    },
    onSuccess: async (data, variables, context) => {
      // await set()
      console.log('onSuccess ', { data, variables, context })
    },
    onSettled: () => {
      console.log('onSettled ')
      setLoading(false)
    },
  })
  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: '#FFFFFF', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={loading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <FormLayout
        title={t('auth.account.change_info')}
        description={t('auth.account.change_info_description')}
        warning={''}
      >
        <Box
          component='form'
          // onSubmit={controlForm.handleSubmit(onSubmit)}
          onSubmit={controlForm.handleSubmit((data: IUpdateNames) => {
            return mutation.mutate(data)
          })}
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='firstname'
                control={controlForm.control}
                rules={{
                  onBlur: (e) => {
                    const firstname = e.target.value
                    const hasChangedFirstname =
                      user.firstName?.toLowerCase() !== firstname?.toLowerCase()
                    const hasChangedFirstnameCase =
                      !hasChangedFirstname && user.firstName !== firstname

                    if (!firstname)
                      controlForm.setError(
                        'firstname',
                        {
                          type: 'exist',
                          message: 'Please provide a new firstname',
                        },
                        { shouldFocus: true },
                      )
                    else controlForm.clearErrors('firstname')
                    if (!hasChangedFirstname && !hasChangedFirstnameCase)
                      controlForm.setError(
                        'firstname',
                        {
                          type: 'exist',
                          message: t('auth.account.firstname_matches_current'),
                        },
                        { shouldFocus: true },
                      )
                    else controlForm.clearErrors('firstname')
                  },
                }}
                render={({ field, formState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    type='text'
                    label={t('auth.account.first_name')}
                    // disabled={disabled}
                    error={formState?.errors?.firstname !== undefined}
                    helperText={formState?.errors?.firstname?.message}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <Controller
                name='lastname'
                control={controlForm.control}
                rules={{
                  onBlur: (e) => {
                    const lastname = e.target.value
                    const hasChangedLastname =
                      user.lastName?.toLowerCase() !== lastname?.toLowerCase()
                    const hasChangedLastnameCase = !hasChangedLastname && user.lastName !== lastname
                    if (!lastname)
                      controlForm.setError(
                        'firstname',
                        {
                          type: 'exist',
                          message: 'Please provide a new firstname',
                        },
                        { shouldFocus: true },
                      )
                    else controlForm.clearErrors('lastname')
                    if (!hasChangedLastname && !hasChangedLastnameCase)
                      controlForm.setError(
                        'lastname',
                        {
                          type: 'exist',
                          message: t('auth.account.lastname_matches_current'),
                        },
                        { shouldFocus: true },
                      )
                    else controlForm.clearErrors('lastname')
                  },
                }}
                render={({ field, formState }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    // disabled={disabled}
                    type='text'
                    label={t('auth.account.last_name')}
                    error={formState?.errors?.lastname !== undefined}
                    helperText={formState?.errors?.lastname?.message}
                  />
                )}
              />
            </Grid>
            <Grid sx={{ mt: '30px' }} size={{ xs: 12 }}>
              <Stack direction='row' spacing={2} justifyContent='start'>
                <Button type='submit' variant='contained' color='primary'>
                  {t('auth.common.save_changes')}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </FormLayout>
    </React.Fragment>
  )
}

import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface AlertReactProps {
  title: string
  message: string
}

const AlertReact = ({ title, message }: AlertReactProps) => {
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText component={Box}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'>
          Annuler
        </Button>
        <Button onClick={handleClose} color='primary' autoFocus>
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertReact

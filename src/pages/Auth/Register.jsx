import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { toast } from 'react-toastify'

import { registerAPI, uploadAvatarAPI } from '~/apis'
import validateEmail from '~/utils/validateEmail'

export default function Register({ setValue }) {
  const [isLoading, setIsLoading] = useState(false)
  const [registerData, setRegisterData] = useState({
    fullname: '',
    username: '',
    password: '',
    email: '',
    avatar: '',
  })

  const [image, setImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const handleSetImage = (e) => {
    setImage(e)
    const urlImage = URL.createObjectURL(e)
    setPreviewImage(urlImage)
  }

  const handleUploadAvatar = async () => {
    try {
      const resCloud = await uploadAvatarAPI(image)
      const avatarUrl = resCloud.secure_url

      return avatarUrl
    } catch (error) {
      toast.error('Failed to upload avatar', { position: 'top-right' })
      setIsLoading(false)
      throw error // Stop registration if avatar upload fails
    }
  }

  const handleSubmitRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form inputs
    if (!registerData.fullname || !registerData.username || !registerData.password || !registerData.email || !image) {
      toast.error('Please fill all fields', { position: 'top-right' })
      setIsLoading(false)
      return
    }

    // Validate email
    if (!validateEmail(registerData.email)) {
      toast.error('Invalid email address', { position: 'top-right' })
      setIsLoading(false)
      return
    }

    try {
      // Upload avatar before registration
      const avatarUrl = await handleUploadAvatar()

      // Prepare registerData with the updated avatar URL
      const dataToRegister = {
        ...registerData,
        avatar: avatarUrl,
      }

      // After avatar upload, register user
      const res = await registerAPI(dataToRegister)

      if (res.statusCode === 422) {
        toast.error(res.message, { position: 'top-right' })
        setIsLoading(false)
        return
      }

      if (res.status === 201) {
        toast.success(res.message, { position: 'top-right' })
        setValue('1') // Redirect after success
      }
    } catch (error) {
      toast.error('Registration failed', { position: 'top-right' })
    } finally {
      setIsLoading(false)
    }
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })

  const Img = styled('img')({
    maxWidth: 150,
  })

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" sx={{ width: '100%', marginTop: 3 }} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                autoComplete="fname"
                variant="standard"
                required
                fullWidth
                id="firstName"
                label="Full Name"
                autoFocus
                value={registerData.fullname}
                onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                variant="standard"
                required
                fullWidth
                id="lastName"
                label="User Name"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </Grid>
            <Grid item>
              <LoadingButton
                component="label"
                type={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                Upload Your Image
                <VisuallyHiddenInput type="file" onChange={(e) => handleSetImage(e.target.files[0])} />
              </LoadingButton>
            </Grid>
            {previewImage ? (
              <Grid item>
                <Img src={previewImage} />
              </Grid>
            ) : (
              ''
            )}
          </Grid>
          <LoadingButton
            onClick={(e) => handleSubmitRegister(e)}
            fullWidth
            variant="contained"
            color="primary"
            loading={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </LoadingButton>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link sx={{ cursor: 'pointer' }} onClick={() => setValue('1')} variant="caption">
                Already have an account? Register
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

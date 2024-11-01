/* eslint-disable quotes */
import { useState } from 'react'

import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import { loginAPI } from '~/apis'
import validateEmail from '~/utils/validateEmail'

export default function Login({ setValue }) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const handleSubmitLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (loginData.email === '' || loginData.password === '') {
      toast.error('Please fill all fields', {
        position: 'top-right',
      })
      setIsLoading(false)
      return
    }

    if (!validateEmail(loginData.email)) {
      toast.error('Invalid email address', {
        position: 'top-right',
      })
      setIsLoading(false)
      return
    }

    const res = await loginAPI(loginData)

    if (res.status === 200) {
      toast.success(res.message, {
        position: 'top-right',
      })
      navigate('/root/workspaces/list-workspaces')
      setIsLoading(false)
    }

    if (res.statusCode === 422) {
      toast.error('Invalid email or password', {
        position: 'top-right',
      })
      setIsLoading(false)
      return
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          sx={{
            width: '100%',
            marginTop: 1,
          }}
        >
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={loginData.email}
            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          />
          <TextField
            variant="standard"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          <LoadingButton
            onClick={(e) => handleSubmitLogin(e)}
            fullWidth
            variant="contained"
            color="primary"
            loading={isLoading}
            sx={{ mb: 2 }}
          >
            Login
          </LoadingButton>
          <Grid
            container
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            {/* <Grid
							
							xs>
							<Link
								href='#'
								variant='caption'>
								Forgot password?
							</Link>
						</Grid> */}
            <Grid>
              <Link sx={{ cursor: 'pointer' }} onClick={() => setValue('2')} variant="caption">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

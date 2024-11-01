// src/hooks/useAuth.js
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAuthAPI } from '~/apis'
import { setIsAuthenticated, setUser } from './userSlice'
import { useDispatch, useSelector } from 'react-redux'

const useAuth = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated)
  const user = useSelector((state) => state.user.user)

  const dispatch = useDispatch()
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await checkAuthAPI()

        if (response?.status === 200) {
          dispatch(setIsAuthenticated(true))
          dispatch(setUser(response.user)) // Lưu thông tin người dùng
        } else {
          dispatch(setIsAuthenticated(false))
          navigate('/user/login') // Redirect nếu không đăng nhập
        }
      } catch (error) {
        dispatch(setIsAuthenticated(false))
        navigate('/user/login')
      }
    }

    checkAuthStatus()
  }, [dispatch, navigate])

  return { isAuthenticated, user }
}

export default useAuth

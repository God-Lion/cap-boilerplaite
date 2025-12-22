import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {
  Backdrop,
  CircularProgress,
  ThemeProvider,
  CssBaseline,
} from '@mui/material'
import theme from 'app/theme'
import GuestRoute from 'app/middlewares/GuestRoute'
import AuthRoute from 'app/middlewares/AuthRoute'
// import AdminRoute from 'src/middlewares/AdminRoute'

// Admin Module (only loaded for admin users)
// const AdminRoutes = React.lazy(() => import('src/Modules/Admin/routes/routes'))

const HomeRoutes = React.lazy(() => import('app/Modules/public/Home/routes/routes'))


const AuthenticationRoutes = React.lazy(
  () => import('app/Modules/public/Auth/routes/routes'),
)

const CommonRoutes = React.lazy(
  () => import('app/Modules/public/Common/routes/routes'),
)


// Error & Utility Modules
const Home = React.lazy(() => import('app/Modules/public/Home/screens/Home'))
const NotFound = React.lazy(() => import('app/Modules/public/ERR0R/screens/NotFound'))
const ERR0RRoutes = React.lazy(() => import('app/Modules/public/ERR0R/routes/routes'))

const LoadingBackdrop: React.FC = () => (
  <Backdrop open style={{ background: '#FFF', zIndex: 1301 }}>
    <CircularProgress color='inherit' />
  </Backdrop>
)

/**
 * SuspenseWrapper Component
 * Wraps lazy-loaded components with Suspense fallback
 * @param children - Child components to be rendered
 */
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <React.Suspense fallback={<LoadingBackdrop />}>{children}</React.Suspense>

const App: React.FC = (): React.ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Routes>
        <Route
          path='/'
          element={
            <SuspenseWrapper>
              <Home />
            </SuspenseWrapper>
          }
        />
        <Route
          path='public/*'
          element={
            <GuestRoute
              element={
                <SuspenseWrapper>
                  <HomeRoutes />
                </SuspenseWrapper>
              }
            />
          }
        />

        {/* Common routes - feature comparison, etc. */}
        <Route
          path='/*'
          element={
            <SuspenseWrapper>
              <CommonRoutes />
            </SuspenseWrapper>
          }
        />

        <Route
          path='auth/*'
          element={
            <GuestRoute
              element={
                <SuspenseWrapper>
                  <AuthenticationRoutes />
                </SuspenseWrapper>
              }
            />
          }
        />





        {/* <Route
            path='notification/*'
            element={
              <AuthRoute
                element={
                  <SuspenseWrapper>
                    <NotificationsRoutes />
                  </SuspenseWrapper>
                }
              />
            }
          /> */}




        <Route
          path='error/*'
          element={
            <SuspenseWrapper>
              <ERR0RRoutes />
            </SuspenseWrapper>
          }
        />

        <Route
          path='*'
          element={
            <SuspenseWrapper>
              <NotFound />
            </SuspenseWrapper>
          }
        />
      </Routes>

    </ThemeProvider>
  )
}

export default App

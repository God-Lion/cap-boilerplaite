import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Box,
  Container,
  Toolbar,
  IconButton,
  Link as HLink,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Stack,
  Theme,
  useTheme,
  InputBase,
} from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import { alpha, styled } from '@mui/material/styles'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AuthButtons from '../auth/AuthButtons'
import { isObjectEmpty, useAuth } from '@cap/platform-core'
import AuthProfile from '../auth/AuthProfile'
import { Logo } from '@cap/layout'
import ModeDropdown from '../shared/ModeDropdown'

const AppBar = styled(MuiAppBar)(({ theme }: { theme: Theme }) => ({
  backgroundColor: 'var(--mui-palette-background-paper)',
  maxWidth: '100%',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const Search = styled('div')(({ theme }: { theme: Theme }) => ({
  marginRight: '20px',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.primary.main, 0.15),

  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }: { theme: Theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }: { theme: Theme }) => ({
  color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.dark,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingBottom: 0,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

function SearchBar() {
  const theme: Theme = useTheme()
  return (
    <React.Fragment>
      <Search>
        <SearchIconWrapper>
          <SearchIcon
            sx={{
              color:
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.light
                  : theme.palette.primary.dark,
            }}
          />
        </SearchIconWrapper>
        <StyledInputBase placeholder='Search…' inputProps={{ 'aria-label': 'search' }} />
      </Search>
      <IconButton
        sx={{
          display: { lg: 'none', md: 'none', sm: 'none', xs: 'flex' },
        }}
      >
        <Search />
      </IconButton>
    </React.Fragment>
  )
}

export default function NavBar() {
  const theme: Theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  const guestPages = [
    { name: 'Home', link: '' },
    { name: 'Jobs', link: 'jobs' },
    { name: 'Profile Analyzer', link: 'profile-analyzer' },
  ]

  const authenticatedPages = [
    { name: 'Dashboard', link: 'dashboard' },
    { name: 'My CVs', link: 'profile-management' },
    { name: 'Profile Analyzer', link: 'profile-analyzer' },
    { name: 'Scraper', link: 'scraper' },
    { name: 'Jobs', link: 'jobs' },
    { name: 'Job Analysis', link: 'job-analysis' },
    { name: 'Automation', link: 'automation' },
    { name: 'Applications', link: 'application-tracker' },
    { name: 'Companies', link: 'companies' },
    { name: 'Statistics', link: 'statistics' },
  ]

  const adminPages = [
    { name: 'Admin Panel', link: 'admin' },
    { name: 'Provider Management', link: 'admin-provider' },
  ]

  const providerPages = [{ name: 'Provider Portal', link: 'provider' }]

  const getPages = () => {
    if (!user || user === null || isObjectEmpty(user)) {
      return guestPages
    }

    const userRole = user?.role
    switch (userRole) {
      case 1: // admin
        return [...authenticatedPages, ...adminPages]
      case 2: // provider
        return [...authenticatedPages, ...providerPages]
      default:
        return authenticatedPages
    }
  }

  const pages = getPages()
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  console.log('isAuthenticated', isAuthenticated)

  return (
    <AppBar position='static'>
      <Container
        maxWidth='xl'
        sx={{
          width: '100%',
          mx: 0,
          pt: 2,
        }}
      >
        <Toolbar disableGutters>
          <Link
            to='/'
            style={{
              margin: '0px',
              padding: '0px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: { lg: 'flex', md: 'flex', sm: 'flex', xs: 'none' },
              }}
            >
              <Logo />
            </Box>
          </Link>
          <Box
            sx={{
              marginLeft: '20px',
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {pages?.map((page) => (
              <List key={page.name} onClick={handleCloseNavMenu}>
                <ListItemButton
                  key={page.name}
                  selected={
                    location.pathname === `/${page?.link}` ||
                    (page?.link === '' && location.pathname === '/')
                  }
                  sx={{
                    '&.MuiListItemButton-root.Mui-selected': {
                      borderRight: '8px solid #fff',
                      zIndex: 1,
                    },
                  }}
                  onClick={() => {
                    navigate(`/${page.link}`, { state: { from: location } })
                  }}
                >
                  <ListItemText
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                    }}
                    primary={page?.name}
                  />
                </ListItemButton>
              </List>
            ))}
          </Box>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon
                sx={{
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.primary.light
                      : theme.palette.primary.dark,
                }}
              />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages?.map((page) => (
                <List key={page.name} onClick={handleCloseNavMenu}>
                  <ListItemButton
                    key={page.name}
                    selected={
                      location.pathname === `/${page?.link}` ||
                      (page?.link === '' && location.pathname === '/')
                    }
                    sx={{
                      '&.MuiListItemButton-root.Mui-selected': {
                        borderRight: '8px solid #fff',
                        zIndex: 1,
                      },
                    }}
                    onClick={() => {
                      navigate(`/${page?.link}`)
                    }}
                  >
                    <ListItemText
                      style={{
                        textDecoration: 'none',
                      }}
                      primary={page.name}
                    />
                  </ListItemButton>
                </List>
              ))}
            </Menu>
          </Box>

          <HLink
            component={Link}
            to='/'
            sx={{
              display: { lg: 'none', md: 'none', sm: 'none', xs: 'flex' },
              margin: '0px',
              padding: '0px',
            }}
          >
            <Logo />
          </HLink>
          <Box
            sx={{
              marginRight: 0,
              marginLeft: 'auto',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Stack direction='row'>
              <SearchBar />
              <ModeDropdown />
              {user === undefined || user === null || isObjectEmpty(user) ? (
                <AuthButtons />
              ) : (
                <AuthProfile />
              )}
            </Stack>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

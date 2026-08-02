import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Toolbar, IconButton, List, ListItemButton, ListItemText, Menu, Stack, Theme, useTheme, InputBase } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { alpha, styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { AuthButtons, AuthProfile } from '../../../components/auth';
import { useAuth, isObjectEmpty, useNavigationMenu } from '@cap/platform-core';
import { Logo, ModeDropdown } from '../../shared';


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

  // Fetch dynamic navigation links
  const pages = useNavigationMenu('public')
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
          <Box
            sx={{
              display: { lg: 'flex', md: 'flex', sm: 'flex', xs: 'none' },
              margin: '0px',
              padding: '0px',
              alignItems: 'center',
            }}
          >
            <Logo />
          </Box>
          <Box
            sx={{
              marginLeft: '20px',
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
            }}
          >
            {pages?.map((page) => {
              const targetPath = page?.path ? (page.path.startsWith('/') ? page.path : `/${page.path}`) : '/'
              const isSelected = location.pathname === targetPath
              return (
                <List key={page.id} onClick={handleCloseNavMenu}>
                  <ListItemButton
                    key={page.id}
                    selected={isSelected}
                    sx={{
                      '&.MuiListItemButton-root.Mui-selected': {
                        borderRight: `8px solid ${theme.palette.background.paper}`,
                        zIndex: 1,
                      },
                    }}
                    onClick={() => {
                      navigate(targetPath, { state: { from: location } })
                    }}
                  >
                    <ListItemText
                      style={{
                        textDecoration: 'none',
                        color: theme.palette.primary.main,
                      }}
                      primary={page?.label}
                    />
                  </ListItemButton>
                </List>
              )
            })}
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
              {pages?.map((page) => {
                const targetPath = page?.path ? (page.path.startsWith('/') ? page.path : `/${page.path}`) : '/'
                const isSelected = location.pathname === targetPath
                return (
                  <List key={page.id} onClick={handleCloseNavMenu}>
                    <ListItemButton
                      key={page.id}
                      selected={isSelected}
                      sx={{
                        '&.MuiListItemButton-root.Mui-selected': {
                          borderRight: `8px solid ${theme.palette.background.paper}`,
                          zIndex: 1,
                        },
                      }}
                      onClick={() => {
                        navigate(targetPath)
                      }}
                    >
                      <ListItemText
                        style={{
                          textDecoration: 'none',
                        }}
                        primary={page.label}
                      />
                    </ListItemButton>
                  </List>
                )
              })}
            </Menu>
          </Box>

          <Box
            sx={{
              display: { lg: 'none', md: 'none', sm: 'none', xs: 'flex' },
              margin: '0px',
              padding: '0px',
            }}
          >
            <Logo />
          </Box>
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

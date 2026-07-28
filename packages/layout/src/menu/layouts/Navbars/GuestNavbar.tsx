import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, IconButton, Typography, useTheme, Drawer, List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Logo } from '../../shared';
import { themeConfig } from '@cap/platform-core';
import { Path } from '@cap/module-auth';

const GuestNavbar = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks = [
    { name: 'Profile Analyzer', path: 'profile-analyzer' },
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const handleNavigate = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <AppBar
        position='static'
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          py: 3,
        }}
      >
        <Container maxWidth='xl'>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo and Brand Name */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
              }}
            >
              <Logo />
              <Typography
                variant='h6'
                sx={{
                  fontWeight: 700,
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.common.white
                      : theme.palette.text.primary,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {themeConfig.templateName}
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {navLinks.map((link, index) => (
                <Button
                  key={`${link.name}-${index}`}
                  onClick={() => handleNavigate(link.path)}
                  sx={{
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[400]
                        : theme.palette.text.secondary,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    transition: 'color 0.2s',
                    '&:hover': {
                      color:
                        theme.palette.mode === 'dark'
                          ? theme.palette.common.white
                          : theme.palette.text.primary,
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {link.name}
                </Button>
              ))}
            </Box>

            {/* Action Buttons */}
            <Stack direction='row' spacing={2} alignItems='center'>
              <Button
                variant='outlined'
                onClick={() => handleNavigate(Path.auth.signup)}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  minWidth: 84,
                  height: 40,
                  px: 2,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.primary.main
                        : theme.palette.primary.contrastText,
                  },
                }}
              >
                Sign Up
              </Button>
              <Button
                variant='contained'
                onClick={() => handleNavigate(Path.auth.signin)}
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  minWidth: 84,
                  height: 40,
                  px: 2,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? `${theme.palette.primary.main}33`
                      : theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  letterSpacing: '0.02em',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? `${theme.palette.primary.main}4D`
                        : theme.palette.primary.main,
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.primary.main
                        : theme.palette.primary.contrastText,
                  },
                }}
              >
                Sign In
              </Button>

              {/* Mobile Menu Button */}
              <IconButton
                onClick={toggleMobileMenu}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  width: 40,
                  height: 40,
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  color:
                    theme.palette.mode === 'dark'
                      ? theme.palette.common.white
                      : theme.palette.text.primary,
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.15)'
                        : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor='right'
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Box sx={{ pt: 2, pb: 2 }}>
          <List>
            {navLinks.map((link, index) => (
              <ListItem key={`${link.name}-${index}`} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(link.path)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    '&:hover': {
                      backgroundColor:
                        theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <ListItemText
                    primary={link.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding sx={{ mt: 2, px: 2 }}>
              <Button
                fullWidth
                variant='contained'
                onClick={() => handleNavigate('/auth/sign-in')}
                sx={{
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? `${theme.palette.primary.main}33`
                      : theme.palette.primary.light,
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? `${theme.palette.primary.main}4D`
                        : theme.palette.primary.main,
                    color:
                      theme.palette.mode === 'dark'
                        ? theme.palette.primary.main
                        : theme.palette.primary.contrastText,
                  },
                }}
              >
                Sign In
              </Button>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  )
}

export default GuestNavbar

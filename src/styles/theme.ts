import { grey } from '@material-ui/core/colors'
import { createMuiTheme,Breakpoint } from '@material-ui/core/styles'

export const defaultTheme = createMuiTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#9BC9F5',
      main: '#0E47A1',
      dark: '#041C5D',
    },
    secondary: {
      light: '#FADBA2',
      main: '#D2761A',
      dark: '#793008',
    },
    success: {
      light: '#C8FACD',
      main: '#00AB55',
      dark: '#007B55',
    },
    info: {
      light: '#D0F2FF',
      main: '#32D6E5',
      dark: '#04297A',
    },
    warning: {
      light: '#FFF7CD',
      main: '#FFC107',
      dark: '#B56F1F',
    },
    error: {
      light: '#FFE7D9',
      main: '#DB2023',
      dark: '#B72136',
    },
    background: {
      default: grey[100],
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
  shape: {
    borderRadius:16,
  },
  typography: {
    fontFamily: 'Be Vietnam, sans-serif, -apple-system,  Oxygen, Ubuntu',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          '&::-webkit-scrollbar, *::-webkit-scrollbar': {
            width: '.3em',
            height: '.3em',
          },
          '&::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
            border: 'none',
            borderRadius: '1em',
            backgroundColor: 'rgba(0,0,0,.54)',
          },
        },
        ul: {
          listStyleType: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '.5em',
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: '8px' } },
    },

    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 2px 1px -1px, rgb(145 158 171 / 14%) 0px 1px 1px 0px, rgb(145 158 171 / 12%) 0px 1px 3px 0px',
        },
        elevation2: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 3px 1px -2px, rgb(145 158 171 / 14%) 0px 2px 2px 0px, rgb(145 158 171 / 12%) 0px 1px 5px 0px',
        },
        elevation3: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 3px 3px -2px, rgb(145 158 171 / 14%) 0px 3px 4px 0px, rgb(145 158 171 / 12%) 0px 1px 8px 0px',
        },
        elevation4: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 2px 4px -1px, rgb(145 158 171 / 14%) 0px 4px 5px 0px, rgb(145 158 171 / 12%) 0px 1px 10px 0px',
        },

        elevation17: {
          boxShadow: 'rgb(145 158 171 / 24%) 0px 8px 16px 0px',
        },
        elevation18: {
          boxShadow:
            'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 12px 24px 0px',
        },
        elevation19: {
          boxShadow:
            'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px',
        },
        elevation20: {
          boxShadow:
            'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 20px 40px -4px',
        },
        elevation21: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 10px 13px -6px, rgb(145 158 171 / 14%) 0px 21px 33px 3px, rgb(145 158 171 / 12%) 0px 8px 40px 7px',
        },
        elevation22: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 10px 14px -6px, rgb(145 158 171 / 14%) 0px 22px 35px 3px, rgb(145 158 171 / 12%) 0px 8px 42px 7px',
        },
        elevation23: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 11px 14px -7px, rgb(145 158 171 / 14%) 0px 23px 36px 3px, rgb(145 158 171 / 12%) 0px 9px 44px 8px',
        },
        elevation24: {
          boxShadow:
            'rgb(145 158 171 / 20%) 0px 11px 15px -7px, rgb(145 158 171 / 14%) 0px 24px 38px 3px, rgb(145 158 171 / 12%) 0px 9px 46px 8px',
        },
      },
    },
  },
})

export const darkTheme = createMuiTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#36AAD5',
      dark: '#1B6599',
      light: '#85E4F2',
    },
    secondary: {
      main: '#D2761A',
      dark: '#793008',
      light: '#FADBA2',
    },
    success: {
      light: '#C8FACD',
      main: '#00AB55',
      dark: '#007B55',
    },
    info: {
      light: '#D0F2FF',
      main: '#32D6E5',
      dark: '#04297A',
    },
    warning: {
      light: '#FFF7CD',
      main: '#FFC107',
      dark: '#B56F1F',
    },
    error: {
      light: '#FFE7D9',
      main: '#DB2023',
      dark: '#B72136',
    },
    background: {
      default: '#1b222f',
    },
  },
  shape: {
    borderRadius:16,
  },
  typography: {
    fontFamily: 'Be Vietnam, sans-serif, -apple-system, Oxygen, Ubuntu',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
          padding: 0,
          margin: 0,
        },
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          '&::-webkit-scrollbar, *::-webkit-scrollbar': {
            width: '.3em',
            height: '.3em',
          },
          '&::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
            border: 'none',
            borderRadius: '1em',
            backgroundColor: 'rgba(255, 255, 255, .30)',
          },
        },
        ul: {
          listStyleType: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '.5em',
        },
      },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: '8px' } },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px',
        },
        elevation2: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 3px 1px -2px, rgb(0 0 0 / 14%) 0px 2px 2px 0px, rgb(0 0 0 / 12%) 0px 1px 5px 0px',
        },
        elevation3: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px',
        },
        elevation4: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 2px 4px -1px, rgb(0 0 0 / 14%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 1px 10px 0px',
        },

        elevation17: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px',
        },
        elevation18: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 7px 8px -4px, rgb(0 0 0 / 14%) 0px 12px 17px 2px, rgb(0 0 0 / 12%) 0px 5px 22px 4px',
        },
        elevation19: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 8px 10px -5px, rgb(0 0 0 / 14%) 0px 16px 24px 2px, rgb(0 0 0 / 12%) 0px 6px 30px 5px',
        },
        elevation20: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 10px 13px -6px, rgb(0 0 0 / 14%) 0px 20px 31px 3px, rgb(0 0 0 / 12%) 0px 8px 38px 7px',
        },
        elevation21: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 10px 13px -6px, rgb(0 0 0 / 14%) 0px 20px 31px 3px, rgb(0 0 0 / 12%) 0px 8px 38px 7px',
        },
        elevation22: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 10px 14px -6px, rgb(0 0 0 / 14%) 0px 22px 35px 3px, rgb(0 0 0 / 12%) 0px 8px 42px 7px',
        },
        elevation23: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 11px 14px -7px, rgb(0 0 0 / 14%) 0px 23px 36px 3px, rgb(0 0 0 / 12%) 0px 9px 44px 8px',
        },
        elevation24: {
          boxShadow:
            'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
        },
      },
    },
  },
})

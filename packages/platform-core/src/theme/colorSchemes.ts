import type { Skin } from '../types'

declare module '@mui/material/styles' {
  interface Theme {
    colorSchemes: {
      light: {
        palette: any
      }
      dark: {
        palette: any
      }
    }
  }
}

/**
 * Platform - Theme Color Schemes
 *
 * Primary Palette (Inspired by the logo):
 * - Gold Accent: #D4AF37 (Metallic Gold)
 * - Lion Brown: #8B4513 (Saddle Brown)
 * - Deep Blue/Grey: #2F4F4F (Dark Slate Gray)
 * - Off-White/Cream: #F5F5DC (Beige)
 * - Dark Contrast: #1A1A1A (Very Dark Gray/Near Black)
 *
 * Light Theme: Clean, airy, readable
 * Dark Theme: Sophisticated, comfortable, low-light friendly
 */

const colorSchemes = (skin: Skin): any => {
  // Static rgba values — no CSS variables here since we are NOT in cssVariables mode.
  // light text channel: 47 43 61, dark text channel: 225 222 245
  return {
    light: {
      palette: {
        primary: {
          main: '#7367F0',
          light: '#8F85F3',
          dark: '#675DD8',
          lighterOpacity: 'rgba(115, 103, 240, 0.08)',
          lightOpacity: 'rgba(115, 103, 240, 0.16)',
          mainOpacity: 'rgba(115, 103, 240, 0.24)',
          darkOpacity: 'rgba(115, 103, 240, 0.32)',
          darkerOpacity: 'rgba(115, 103, 240, 0.38)',
        },
        secondary: {
          main: '#808390',
          light: '#999CA6',
          dark: '#737682',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(128, 131, 144, 0.08)',
          lightOpacity: 'rgba(128, 131, 144, 0.16)',
          mainOpacity: 'rgba(128, 131, 144, 0.24)',
          darkOpacity: 'rgba(128, 131, 144, 0.32)',
          darkerOpacity: 'rgba(128, 131, 144, 0.38)',
        },
        error: {
          main: '#FF4C51',
          light: '#FF7074',
          dark: '#E64449',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(255, 76, 81, 0.08)',
          lightOpacity: 'rgba(255, 76, 81, 0.16)',
          mainOpacity: 'rgba(255, 76, 81, 0.24)',
          darkOpacity: 'rgba(255, 76, 81, 0.32)',
          darkerOpacity: 'rgba(255, 76, 81, 0.38)',
        },
        warning: {
          main: '#FF9F43',
          light: '#FFB269',
          dark: '#E68F3C',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(255, 159, 67, 0.08)',
          lightOpacity: 'rgba(255, 159, 67, 0.16)',
          mainOpacity: 'rgba(255, 159, 67, 0.24)',
          darkOpacity: 'rgba(255, 159, 67, 0.32)',
          darkerOpacity: 'rgba(255, 159, 67, 0.38)',
        },
        info: {
          main: '#00BAD1',
          light: '#33C8DA',
          dark: '#00A7BC',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(0, 186, 209, 0.08)',
          lightOpacity: 'rgba(0, 186, 209, 0.16)',
          mainOpacity: 'rgba(0, 186, 209, 0.24)',
          darkOpacity: 'rgba(0, 186, 209, 0.32)',
          darkerOpacity: 'rgba(0, 186, 209, 0.38)',
        },
        success: {
          main: '#28C76F',
          light: '#53D28C',
          dark: '#24B364',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(40, 199, 111, 0.08)',
          lightOpacity: 'rgba(40, 199, 111, 0.16)',
          mainOpacity: 'rgba(40, 199, 111, 0.24)',
          darkOpacity: 'rgba(40, 199, 111, 0.32)',
          darkerOpacity: 'rgba(40, 199, 111, 0.38)',
        },
        text: {
          primary: 'rgba(47, 43, 61, 0.9)',
          secondary: 'rgba(47, 43, 61, 0.7)',
          disabled: 'rgba(47, 43, 61, 0.4)',
          primaryChannel: '47 43 61',
          secondaryChannel: '47 43 61',
        },
        divider: 'rgba(47, 43, 61, 0.12)',
        dividerChannel: '47 43 61',
        background: {
          default: skin === 'bordered' ? '#FFFFFF' : '#F8F7FA',
          paper: '#FFFFFF',
          paperChannel: '255 255 255',
        },
        action: {
          active: 'rgba(47, 43, 61, 0.6)',
          hover: 'rgba(47, 43, 61, 0.06)',
          selected: 'rgba(47, 43, 61, 0.08)',
          disabled: 'rgba(47, 43, 61, 0.3)',
          disabledBackground: 'rgba(47, 43, 61, 0.16)',
          focus: 'rgba(47, 43, 61, 0.1)',
          focusOpacity: 0.1,
          activeChannel: '47 43 61',
          selectedChannel: '47 43 61',
        },
        Alert: {
          errorColor: 'var(--mui-palette-error-main)',
          warningColor: 'var(--mui-palette-warning-main)',
          infoColor: 'var(--mui-palette-info-main)',
          successColor: 'var(--mui-palette-success-main)',
          errorStandardBg: 'var(--mui-palette-error-lightOpacity)',
          warningStandardBg: 'var(--mui-palette-warning-lightOpacity)',
          infoStandardBg: 'var(--mui-palette-info-lightOpacity)',
          successStandardBg: 'var(--mui-palette-success-lightOpacity)',
          errorFilledColor: 'var(--mui-palette-error-contrastText)',
          warningFilledColor: 'var(--mui-palette-warning-contrastText)',
          infoFilledColor: 'var(--mui-palette-info-contrastText)',
          successFilledColor: 'var(--mui-palette-success-contrastText)',
          errorFilledBg: 'var(--mui-palette-error-main)',
          warningFilledBg: 'var(--mui-palette-warning-main)',
          infoFilledBg: 'var(--mui-palette-info-main)',
          successFilledBg: 'var(--mui-palette-success-main)',
        },
        Avatar: {
          defaultBg: '#EEEDF0',
        },
        Chip: {
          defaultBorder: 'var(--mui-palette-divider)',
        },
        FilledInput: {
          bg: 'var(--mui-palette-action-hover)',
          hoverBg: 'var(--mui-palette-action-selected)',
          disabledBg: 'var(--mui-palette-action-hover)',
        },
        SnackbarContent: {
          bg: '#2F2B3D',
          color: 'var(--mui-palette-background-paper)',
        },
        Switch: {
          defaultColor: 'var(--mui-palette-common-white)',
          defaultDisabledColor: 'var(--mui-palette-common-white)',
          primaryDisabledColor: 'var(--mui-palette-common-white)',
          secondaryDisabledColor: 'var(--mui-palette-common-white)',
          errorDisabledColor: 'var(--mui-palette-common-white)',
          warningDisabledColor: 'var(--mui-palette-common-white)',
          infoDisabledColor: 'var(--mui-palette-common-white)',
          successDisabledColor: 'var(--mui-palette-common-white)',
        },
        Tooltip: {
          bg: '#2F2B3D',
        },
        TableCell: {
          border: 'var(--mui-palette-divider)',
        },
        customColors: {
          bodyBg: '#F8F7FA',
          chatBg: '#F3F2F5',
          greyLightBg: '#FAFAFA',
          inputBorder: `rgb(var(--mui-mainColorChannels-light) / 0.22)`,
          tableHeaderBg: '#FFFFFF',
          tooltipText: '#FFFFFF',
          trackBg: '#F1F0F2',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#7367F0',
          light: '#8F85F3',
          dark: '#675DD8',
          lighterOpacity: 'rgba(115, 103, 240, 0.08)',
          lightOpacity: 'rgba(115, 103, 240, 0.16)',
          mainOpacity: 'rgba(115, 103, 240, 0.24)',
          darkOpacity: 'rgba(115, 103, 240, 0.32)',
          darkerOpacity: 'rgba(115, 103, 240, 0.38)',
        },
        secondary: {
          main: '#808390',
          light: '#999CA6',
          dark: '#737682',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(128, 131, 144, 0.08)',
          lightOpacity: 'rgba(128, 131, 144, 0.16)',
          mainOpacity: 'rgba(128, 131, 144, 0.24)',
          darkOpacity: 'rgba(128, 131, 144, 0.32)',
          darkerOpacity: 'rgba(128, 131, 144, 0.38)',
        },
        error: {
          main: '#FF4C51',
          light: '#FF7074',
          dark: '#E64449',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(255, 76, 81, 0.08)',
          lightOpacity: 'rgba(255, 76, 81, 0.16)',
          mainOpacity: 'rgba(255, 76, 81, 0.24)',
          darkOpacity: 'rgba(255, 76, 81, 0.32)',
          darkerOpacity: 'rgba(255, 76, 81, 0.38)',
        },
        warning: {
          main: '#FF9F43',
          light: '#FFB269',
          dark: '#E68F3C',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(255, 159, 67, 0.08)',
          lightOpacity: 'rgba(255, 159, 67, 0.16)',
          mainOpacity: 'rgba(255, 159, 67, 0.24)',
          darkOpacity: 'rgba(255, 159, 67, 0.32)',
          darkerOpacity: 'rgba(255, 159, 67, 0.38)',
        },
        info: {
          main: '#00BAD1',
          light: '#33C8DA',
          dark: '#00A7BC',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(0, 186, 209, 0.08)',
          lightOpacity: 'rgba(0, 186, 209, 0.16)',
          mainOpacity: 'rgba(0, 186, 209, 0.24)',
          darkOpacity: 'rgba(0, 186, 209, 0.32)',
          darkerOpacity: 'rgba(0, 186, 209, 0.38)',
        },
        success: {
          main: '#28C76F',
          light: '#53D28C',
          dark: '#24B364',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(40, 199, 111, 0.08)',
          lightOpacity: 'rgba(40, 199, 111, 0.16)',
          mainOpacity: 'rgba(40, 199, 111, 0.24)',
          darkOpacity: 'rgba(40, 199, 111, 0.32)',
          darkerOpacity: 'rgba(40, 199, 111, 0.38)',
        },
        text: {
          primary: 'rgba(225, 222, 245, 0.9)',
          secondary: 'rgba(225, 222, 245, 0.7)',
          disabled: 'rgba(225, 222, 245, 0.4)',
          primaryChannel: '225 222 245',
          secondaryChannel: '225 222 245',
        },
        divider: 'rgba(225, 222, 245, 0.12)',
        dividerChannel: '225 222 245',
        background: {
          default: skin === 'bordered' ? '#2F3349' : '#25293C',
          paper: '#2F3349',
          paperChannel: '47 51 73',
        },
        action: {
          active: 'rgba(225, 222, 245, 0.6)',
          hover: 'rgba(225, 222, 245, 0.06)',
          selected: 'rgba(225, 222, 245, 0.08)',
          disabled: 'rgba(225, 222, 245, 0.3)',
          disabledBackground: 'rgba(225, 222, 245, 0.16)',
          focus: 'rgba(225, 222, 245, 0.1)',
          focusOpacity: 0.1,
          activeChannel: '225 222 245',
          selectedChannel: '225 222 245',
        },
        Alert: {
          errorColor: 'var(--mui-palette-error-main)',
          warningColor: 'var(--mui-palette-warning-main)',
          infoColor: 'var(--mui-palette-info-main)',
          successColor: 'var(--mui-palette-success-main)',
          errorStandardBg: 'var(--mui-palette-error-lightOpacity)',
          warningStandardBg: 'var(--mui-palette-warning-lightOpacity)',
          infoStandardBg: 'var(--mui-palette-info-lightOpacity)',
          successStandardBg: 'var(--mui-palette-success-lightOpacity)',
          errorFilledColor: 'var(--mui-palette-error-contrastText)',
          warningFilledColor: 'var(--mui-palette-warning-contrastText)',
          infoFilledColor: 'var(--mui-palette-info-contrastText)',
          successFilledColor: 'var(--mui-palette-success-contrastText)',
          errorFilledBg: 'var(--mui-palette-error-main)',
          warningFilledBg: 'var(--mui-palette-warning-main)',
          infoFilledBg: 'var(--mui-palette-info-main)',
          successFilledBg: 'var(--mui-palette-success-main)',
        },
        Avatar: {
          defaultBg: '#373B50',
        },
        Chip: {
          defaultBorder: 'var(--mui-palette-divider)',
        },
        FilledInput: {
          bg: 'var(--mui-palette-action-hover)',
          hoverBg: 'var(--mui-palette-action-selected)',
          disabledBg: `var(--mui-palette-action-hover)`,
        },
        SnackbarContent: {
          bg: '#F7F4FF',
          color: 'var(--mui-palette-background-paper)',
        },
        Switch: {
          defaultColor: 'var(--mui-palette-common-white)',
          defaultDisabledColor: 'var(--mui-palette-common-white)',
          primaryDisabledColor: 'var(--mui-palette-common-white)',
          secondaryDisabledColor: 'var(--mui-palette-common-white)',
          errorDisabledColor: 'var(--mui-palette-common-white)',
          warningDisabledColor: 'var(--mui-palette-common-white)',
          infoDisabledColor: 'var(--mui-palette-common-white)',
          successDisabledColor: 'var(--mui-palette-common-white)',
        },
        Tooltip: {
          bg: '#F7F4FF',
        },
        TableCell: {
          border: 'var(--mui-palette-divider)',
        },
        customColors: {
          bodyBg: '#25293C',
          chatBg: '#202534',
          greyLightBg: '#353A52',
          inputBorder: `rgb(var(--mui-mainColorChannels-dark) / 0.22)`,
          tableHeaderBg: '#2F3349',
          tooltipText: '#2F3349',
          trackBg: '#3A3F57',
        },
      },
    },
  }
}

export default colorSchemes

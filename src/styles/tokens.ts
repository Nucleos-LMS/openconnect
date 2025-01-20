// Design tokens from our design system
export const colors = {
  // Primary colors - Calm, trustworthy blue
  primary: {
    50: '#E5F0FF',
    100: '#B8D5FF',
    200: '#8BBAFF',
    300: '#5E9FFF',
    400: '#3184FF',
    500: '#0469FF',
    600: '#0354CC',
    700: '#023F99',
    800: '#022A66',
    900: '#011533'
  },
  
  // Secondary colors - Warm, approachable purple
  secondary: {
    50: '#F5E9FF',
    100: '#E1C2FF',
    200: '#CD9BFF',
    300: '#B974FF',
    400: '#A54DFF',
    500: '#9126FF',
    600: '#741ECC',
    700: '#571799',
    800: '#3A0F66',
    900: '#1D0833'
  },

  // Semantic colors
  success: {
    500: '#2D9D78',
    600: '#238A67'
  },
  error: {
    500: '#E53939',
    600: '#D12F2F'
  },
  warning: {
    500: '#F5B638',
    600: '#E6A421'
  },
  info: {
    500: '#3182CE',
    600: '#2B6CB0'
  },
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },
}

export const typography = {
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
    mono: 'Menlo, monospace'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem'
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: 2
  }
}

export const space = {
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
}

export const breakpoints = {
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
} 
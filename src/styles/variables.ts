/* eslint-disable max-len */

export const colors = {
  brand: '#663399',
  lilac: '#9d7cbf',
  accent: '#ffb238',
  success: '#37b635',
  warning: '#e46457',
  ui: {
    bright: '#e0d6eb',
    light: '#f5f3f7',
    whisper: '#fbfafc'
  },
  gray: {
    dark: 'hsla(270, 17.119554496%, 0%, 0.92)',
    copy: 'hsla(270, 15.797828016000002%, 0%, 0.88)',
    calm: 'rgba(0, 0, 0, 0.54)',
    light: 'rgba(0, 0, 0, 0.26)'
  },
  blue: {
    light: '#D6F0F3',
    medium: '#a4dde2',
    dark: '#49aeb6',
    darkest: '#09778b'
  },
  white: '#fff',
  black: 'rgb(7, 23, 40)',
  blackLighter: 'rgba(7, 23, 40, 0.75)'
}

export const fonts = {
  headline: '"Rubik-Mono", "Helvetica Neue", Arial, sans-serif',
  sansSerif: '"Rubik", "Helvetica Neue", Arial, sans-serif'
}

export const breakpoints: { [key: string]: number } = {
  xs: 0,
  sm: 36,
  md: 48,
  lg: 62,
  xl: 75
}

export const mediaqueries = {
  xs: `@media (min-width: ${breakpoints.xs}em)`,
  sm: `@media (min-width: ${breakpoints.sm}em)`,
  md: `@media (min-width: ${breakpoints.md}em)`,
  lg: `@media (min-width: ${breakpoints.lg}em)`,
  xl: `@media (min-width: ${breakpoints.xl}em)`
}

export const widths: { [key: string]: number } = {
  xs: 25,
  sm: 32,
  md: 45,
  lg: 60,
  xl: 72
}

export const dimensions = {
  fontSize: {
    small: 14,
    regular: 16,
    large: 18
  },
  headingSizesMobile: {
    h1: 3, // 48px
    h2: 2.25, // 36px
    h3: 1.5, // 24px
    h4: 1.25, // 20px
    h5: 1 // 20px
  },
  headingSizesTablet: {
    h1: 4, // 64px
    h2: 3, // 56px
    h3: 2, // 40px
    h4: 1.5, // 24px
    h5: 1.25 // 20px
  },
  lineHeight: {
    regular: 1.66,
    heading: 1
  },
  containerPadding: {
    xs: 0,
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  }
}

export const heights = {
  header: 72
}

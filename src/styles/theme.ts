import { extendTheme } from '@chakra-ui/react'
import { colors, typography, space, breakpoints } from './tokens'
import { Button, Card, Form } from './components'

export const theme = extendTheme({
  colors: {
    primary: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
  },
  ...typography,
  space,
  breakpoints,
  components: {
    Button,
    Card,
    Form
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.900',
      }
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  }
}) 
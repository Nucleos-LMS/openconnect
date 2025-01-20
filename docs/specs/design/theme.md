# OpenConnect Design System

## Design Tokens

### Colors

```typescript
const colors = {
  // Primary colors - Calm, trustworthy blue
  primary: {
    50: '#E5F0FF',
    100: '#B8D5FF',
    200: '#8BBAFF',
    300: '#5E9FFF',
    400: '#3184FF',
    500: '#0469FF', // Primary brand color
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
    500: '#2D9D78', // More muted green
    600: '#238A67'
  },
  error: {
    500: '#E53939', // Less harsh red
    600: '#D12F2F'
  },
  warning: {
    500: '#F5B638',
    600: '#E6A421'
  },
  info: {
    500: '#3182CE',
    600: '#2B6CB0'
  }
}
```

### Typography

```typescript
const typography = {
  fonts: {
    body: 'Inter, system-ui, sans-serif',
    heading: 'Inter, system-ui, sans-serif',
    mono: 'Menlo, monospace'
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem'     // 48px
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
```

### Spacing

```typescript
const space = {
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
  40: '10rem',      // 160px
  48: '12rem',      // 192px
  56: '14rem',      // 224px
  64: '16rem',      // 256px
}
```

### Breakpoints

```typescript
const breakpoints = {
  sm: '30em',    // 480px
  md: '48em',    // 768px
  lg: '62em',    // 992px
  xl: '80em',    // 1280px
  '2xl': '96em', // 1536px
}
```

## Component Variants

### Buttons

```typescript
const Button = {
  // Base styles
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'md',
    _focus: {
      boxShadow: 'outline',
    }
  },
  
  // Variants
  variants: {
    primary: {
      bg: 'primary.500',
      color: 'white',
      _hover: {
        bg: 'primary.600',
      }
    },
    secondary: {
      bg: 'secondary.500',
      color: 'white',
      _hover: {
        bg: 'secondary.600',
      }
    },
    outline: {
      border: '2px solid',
      borderColor: 'primary.500',
      color: 'primary.500',
      _hover: {
        bg: 'primary.50',
      }
    }
  },
  
  // Sizes
  sizes: {
    sm: {
      px: 4,
      py: 2,
      fontSize: 'sm',
    },
    md: {
      px: 6,
      py: 3,
      fontSize: 'md',
    },
    lg: {
      px: 8,
      py: 4,
      fontSize: 'lg',
    }
  }
}
```

### Cards

```typescript
const Card = {
  baseStyle: {
    p: 6,
    borderRadius: 'lg',
    bg: 'white',
    boxShadow: 'sm',
    transition: 'all 0.2s',
    _hover: {
      boxShadow: 'md',
    }
  },
  variants: {
    elevated: {
      boxShadow: 'md',
      _hover: {
        boxShadow: 'lg',
      }
    },
    outline: {
      border: '1px solid',
      borderColor: 'gray.200',
    }
  }
}
```

## Usage Example

```typescript
import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  space,
  breakpoints,
  components: {
    Button,
    Card
  }
})

export default theme
```

## Accessibility Notes

1. Color Contrast
- All color combinations meet WCAG 2.1 AA standards
- Text colors maintain 4.5:1 contrast ratio
- Interactive elements maintain 3:1 contrast ratio

2. Focus States
- Visible focus indicators on all interactive elements
- Custom focus styles maintain sufficient contrast
- Focus order follows logical document flow

3. Typography
- Base font size of 16px
- Line heights optimized for readability
- Font weights support varying contrast needs

## Next Steps
1. Create component library in Storybook
2. Implement theme provider
3. Build reusable components
4. Create documentation
5. Test across devices 
# OpenConnect Frontend Project Setup

## Project Structure
```
openconnect/
├── src/
│   ├── components/
│   │   ├── common/           # Shared components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   └── Form/
│   │   ├── features/         # Feature-specific components
│   │   │   ├── registration/
│   │   │   ├── scheduling/
│   │   │   ├── video-call/
│   │   │   └── support/
│   │   └── layouts/          # Layout components
│   ├── hooks/                # Custom hooks
│   ├── styles/               # Theme and global styles
│   ├── utils/                # Utility functions
│   ├── pages/                # Next.js pages
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── tests/                   # Test files
```

## Initial Setup Steps

1. Create Next.js Project
```bash
npx create-next-app@latest openconnect --typescript --tailwind --eslint
cd openconnect
```

2. Install Dependencies
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
npm install @chakra-ui/icons @chakra-ui/next-js
npm install react-hook-form @hookform/resolvers yup
npm install date-fns react-datepicker
npm install twilio-video @twilio/conversations
```

3. Development Dependencies
```bash
npm install -D @storybook/react @storybook/builder-webpack5
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D prettier eslint-config-prettier
```

## Theme Setup

1. Create Theme Provider (`src/styles/theme.ts`)
```typescript
import { extendTheme } from '@chakra-ui/react'
import { colors, typography, space, breakpoints } from './tokens'
import { Button, Card } from './components'

export const theme = extendTheme({
  colors,
  ...typography,
  space,
  breakpoints,
  components: {
    Button,
    Card,
  },
})
```

2. Configure App (`src/pages/_app.tsx`)
```typescript
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '../styles/theme'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
```

## Component Development Process

1. Create Component Structure
```
src/components/features/registration/
├── RegistrationForm/
│   ├── index.ts
│   ├── RegistrationForm.tsx
│   ├── RegistrationForm.stories.tsx
│   ├── RegistrationForm.test.tsx
│   └── types.ts
```

2. Component Template
```typescript
import { FC } from 'react'
import { Box, Stack } from '@chakra-ui/react'
import { ComponentProps } from './types'

export const ComponentName: FC<ComponentProps> = (props) => {
  return (
    <Box>
      {/* Component content */}
    </Box>
  )
}
```

3. Story Template
```typescript
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta: Meta<typeof ComponentName> = {
  title: 'Features/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    // Default props
  },
}
```

## Development Workflow

1. Component Development Order
   - Common components first
   - Feature components following user flow
   - Integration with Twilio
   - Testing and refinement

2. Testing Strategy
   - Unit tests for components
   - Integration tests for features
   - E2E tests for critical flows
   - Accessibility testing

3. Documentation
   - Component documentation in Storybook
   - API documentation
   - Usage examples
   - Accessibility guidelines

## Next Steps

1. Initialize Project
   ```bash
   # Create project
   npx create-next-app@latest openconnect --typescript
   
   # Install dependencies
   cd openconnect
   npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
   
   # Set up Storybook
   npx sb init
   ```

2. Create Base Components
   - Theme setup
   - Button component
   - Card component
   - Form components

3. Start Feature Development
   - Registration flow
   - Scheduling interface
   - Video call interface
   - Support features 
# Development Setup Guide

## Current Issues to Fix

1. **Duplicate Project Structure**: There is currently a duplicate `openconnect` directory in the root that contains Next.js configuration. This needs to be merged with the root directory structure.

2. **Configuration Organization**: Move configuration files into the `src/config` directory for better organization:
   - `.storybook` → `src/config/storybook`
   - `next.config.ts` → `src/config/next`
   - `tailwind.config.ts` → `src/config/tailwind`
   - `postcss.config.mjs` → `src/config/postcss`
   - `eslint.config.mjs` → `src/config/eslint`

## Correct Project Structure

```
/
├── docs/               # Project documentation
│   ├── development/    # Development-related documentation
│   ├── specs/         # Feature specifications
│   └── project/       # Project-related documentation
├── public/            # Static files
├── src/               # Source code
│   ├── components/    # React components
│   │   ├── common/   # Reusable components
│   │   └── features/ # Feature-specific components
│   ├── config/       # Configuration files
│   │   ├── storybook/ # Storybook configuration
│   │   ├── next/     # Next.js configuration
│   │   ├── tailwind/ # Tailwind configuration
│   │   ├── postcss/  # PostCSS configuration
│   │   └── eslint/   # ESLint configuration
│   ├── styles/       # Theme and global styles
│   └── types/        # TypeScript type definitions
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies
└── tsconfig.json     # TypeScript configuration
```

## Configuration Files

### TypeScript Configuration (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Storybook Configuration (src/config/storybook/main.ts)
```typescript
import type { StorybookConfig } from '@storybook/react-webpack5'
import { join, dirname } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed to avoid conflicts when using workspace dependencies.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")))
}

const config: StorybookConfig = {
  stories: ['../../components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': join(__dirname, '../../'),
      }
    }
    if (config.module?.rules) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('ts-loader'),
      })
    }
    if (config.resolve?.extensions) {
      config.resolve.extensions.push('.ts', '.tsx')
    }
    return config
  },
}

export default config
```

## Dependencies

### Core Dependencies
- React with TypeScript
- Next.js for the application framework
- Chakra UI for components and theming
- React Icons for iconography
- Tailwind CSS for utility classes

### Development Dependencies
- Storybook 8.5.0 with TypeScript support
- TypeScript and related tools
- ESLint for code linting
- PostCSS for CSS processing
- Webpack 5 for bundling

## Component Development

All components are developed with the following principles:
1. TypeScript for type safety
2. Storybook for documentation and testing
3. Modular organization in `src/components`
4. Common components in `src/components/common`
5. Feature-specific components in `src/components/features`

### Component Structure
Each component follows this structure:
```
ComponentName/
├── ComponentName.tsx     # Main component file
├── ComponentName.stories.tsx  # Storybook stories
└── index.ts             # Public exports
```

## Next Steps
1. Create the `src/config` directory structure
2. Move all configuration files to their respective directories
3. Update import paths in components to use the `@/*` alias
4. Update Storybook configuration to handle the new file structure 
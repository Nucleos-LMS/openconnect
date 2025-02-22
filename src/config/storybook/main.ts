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
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
      include: ['../../components/**/*.tsx'],
    },
    check: true,
  },
  babel: async (options: any) => ({
    ...options,
    presets: [
      '@babel/preset-env',
      '@babel/preset-typescript',
      '@babel/preset-react'
    ],
  }),
  webpackFinal: async (config) => {
    if (!config.resolve) {
      config.resolve = {}
    }

    // Add path aliases, extensions, and polyfills
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, '../../'),
    }
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx']
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      tty: require.resolve('tty-browserify'),
      os: require.resolve('os-browserify/browser')
    }

    // Configure module rules
    if (!config.module) {
      config.module = { rules: [] }
    }
    
    config.module?.rules?.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }],
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
          },
        },
      ],
    })

    return config
  },
}

export default config                  
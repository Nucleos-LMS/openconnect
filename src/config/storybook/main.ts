import type { StorybookConfig } from '@storybook/react-webpack5';
import { join, dirname } from 'path';

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: [
    '../../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../../providers/**/*.stories.@(js|jsx|ts|tsx)'
  ],
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
    if (!config.module) {
      config.module = { rules: [] };
    }
    if (!config.module.rules) {
      config.module.rules = [];
    }

    // Add TypeScript and Babel loaders
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-typescript'),
            ],
          },
        },
      ],
    });

    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': join(__dirname, '../../'),
      '@chakra-ui/react': require.resolve('@chakra-ui/react'),
      '@emotion/react': require.resolve('@emotion/react'),
      '@emotion/styled': require.resolve('@emotion/styled'),
      'framer-motion': require.resolve('framer-motion'),
    };

    if (!config.resolve.extensions) {
      config.resolve.extensions = [];
    }
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
};

export default config;

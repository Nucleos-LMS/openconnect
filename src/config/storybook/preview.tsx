import type { Preview } from "@storybook/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from 'react';

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    chakra: {
      theme,
    },
  },
  decorators: [
    (Story) => (
      <ChakraProvider theme={theme} resetCSS>
        <Story />
      </ChakraProvider>
    ),
  ],
};

export default preview;

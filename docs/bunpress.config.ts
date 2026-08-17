import type { BunpressConfig } from 'bunpress'

const config: BunpressConfig = {
  name: 'ts-countries',
  description: 'A modern TypeScript library for comprehensive country data with a simple API',
  url: 'https://ts-countries.stacksjs.org',
  theme: 'docs',

  nav: [
    { text: 'Guide', link: '/guide' },
    { text: 'Examples', link: '/examples' },
    { text: 'Usage', link: '/usage' },
    { text: 'GitHub', link: 'https://github.com/stacksjs/ts-countries' },
  ],

  sidebar: {
    '/guide/': [
      { text: 'Introduction', link: '/guide' },
      { text: 'Getting Started', link: '/guide/getting-started' },
      { text: 'API Reference', link: '/guide/api' },
    ],
    '/features/': [
      { text: 'Overview', link: '/features' },
      { text: 'Country Lookup', link: '/features/lookup' },
      { text: 'Currency Data', link: '/features/currency' },
      { text: 'Timezone Info', link: '/features/timezone' },
      { text: 'Language Data', link: '/features/languages' },
    ],
    '/advanced/': [
      { text: 'Overview', link: '/advanced' },
      { text: 'Custom Data Sets', link: '/advanced/custom-data' },
      { text: 'Filtering & Sorting', link: '/advanced/filtering' },
      { text: 'Locale Support', link: '/advanced/locales' },
      { text: 'Performance Tips', link: '/advanced/performance' },
    ],
  },

  search: true,
  editLink: {
    pattern: 'https://github.com/stacksjs/ts-countries/edit/main/docs/:path',
    text: 'Edit this page on GitHub',
  },

  socialLinks: [
    { icon: 'github', link: 'https://github.com/stacksjs/ts-countries' },
    { icon: 'discord', link: 'https://discord.gg/stacksjs' },
  ],
}

export default config

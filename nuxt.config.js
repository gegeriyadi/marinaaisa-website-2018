const builtAt = new Date().toISOString();
const path = require('path');

const buildLocale = process.env.BUILD_LOCALE || 'en';
const productionUrl = {
  en: "/en",
  ja: "/ja"
};
const baseUrl = 'marinaaisa.com';

const works = [
  "vr-player"
];

module.exports = {
  env: {
    baseUrl,
    buildLocale,
    productionUrl,
    works
  },
  head: {
    title: 'Marina Aisa',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' },
      { name: 'msapplication-TileColor', content: '#ffffff' },
      { name: 'msapplication-TileImage', content: '/favicons/mstile-144x144.png' },
      { name: 'theme-color', content: '#c1c1c1' },
      { name: 'robots', content: 'noindex nofollow' }, // switch after launch
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@marinaaisa' },
      { property: 'og:type', content: 'profile' },
      { property: 'og:updated_time', content: builtAt }
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-16x16.png', sizes: '16x16' },
      { rel: 'icon', type: 'image/png', href: '/favicons/favicon-32x32.png', sizes: '32x32' },
      { rel: 'icon', type: 'image/png', href: '/favicons/android-chrome-96x96.png', sizes: '96x96' },
      { rel: 'icon', type: 'image/png', href: '/favicons/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-57x57.png', sizes: '57x57' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-60x60.png', sizes: '60x60' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-72x72.png', sizes: '72x72' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-76x76.png', sizes: '76x76' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-114x114.png', sizes: '114x114' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-120x120.png', sizes: '120x120' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-144x144.png', sizes: '144x144' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-152x152.png', sizes: '152x152' },
      { rel: 'apple-touch-icon', href: '/favicons/apple-touch-icon-180x180.png', sizes: '180x180' },
      { rel: 'mask-icon', type: 'image/png', href: '/favicons/safari-pinned-tab.svg', color: '#c1c1c1' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#5a46ff' },
  /*
  ** Build configuration
  */
  css: [
    '@/assets/css/main.scss'
  ],

  build: {
    vendor: [
      'medium-zoom',
      'vue-carousel',
      'vue-i18n'
    ],
    extend (config, { isDev, isClient }) {
      // remove existing url-loader settings once, for giving svg specific loader
      const rule = config.module.rules.find(r => r.test.toString() === '/\\.(png|jpe?g|gif|svg)$/');
      config.module.rules.splice(config.module.rules.indexOf(rule), 1);

      config.module.rules.find(
        rule => rule.loader === "url-loader"
      ).exclude = /\.(jpe?g|png)$/;

      config.module.rules.push({
        test: /\.md$/,
        loader: 'frontmatter-markdown-loader',
        include: path.resolve(__dirname, 'contents'),
        options: {
          vue: {
            root: "dynamicMarkdown"
          }
        }
      }, {
        test: /\.yaml$/,
        loaders: [
          'json-loader',
          'yaml-loader'
        ],
        include: path.resolve(__dirname, 'locales')
      }, {
        test: /\.(gif)$/,
        loader: 'url-loader',
        query: {
          name: 'img/[name].[hash:7].[ext]'
        }
      }, {
        test: /\.(jpe?g|png)$/i,
        loader: 'responsive-loader',
        options: {
          placeholder: true,
          quality: 60,
          adapter: require('responsive-loader/sharp')
        }
      }, {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: path.resolve(__dirname, 'assets/icons')
      });
    }
  },
  plugins: ['~/plugins/i18n', '~/plugins/lazyload'],
  modules: [
    ['nuxt-sass-resources-loader', [
        '@/assets/css/utilities/_variables.scss',
        '@/assets/css/utilities/_helpers.scss',
        '@/assets/css/base/_grid.scss',
        '@/assets/css/base/_buttons.scss'
    ]],
    ['@nuxtjs/google-analytics', {
      id: 'UA-XXXXXXXX-X'
    }]
  ],
  generate: {
    fallback: true,
    subFolders: false,
    routes: [
      '/about',
      '/contact',
    ].concat(works.map(w => `/work/${w}`))
  }
}
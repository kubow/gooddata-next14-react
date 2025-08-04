module.exports = {
  plugins: {
    'postcss-url': {
      url: (asset) => {
        // Fix broken relative paths from GoodData CSS
        const file = asset.url.split('/').pop();

        if (asset.url.includes('sdk-ui-kit/styles/icons')) {
          return `/assets/icons/${file}`;
        }
        if (asset.url.includes('sdk-ui-kit/styles/fonts')) {
          return `/assets/fonts/${file}`;
        }
        if (asset.url.includes('sdk-ui-kit/styles/images/visualization-types')) {
          return `/assets/images/${file}`;
        }
        if (asset.url.includes('sdk-ui-ext/esm/internal/assets/icons')) {
          return `/assets/icons/${file}`;
        }
        if (asset.url.includes('sdk-ui-kit/esm/assets')) {
          return `/assets/icons/${file}`;
        }

        return asset.url;
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}

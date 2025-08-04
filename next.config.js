/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    for (const rule of config.module.rules) {
      if (Array.isArray(rule.oneOf)) {
        for (const one of rule.oneOf) {
          if (Array.isArray(one.use)) {
            for (const use of one.use) {
              if (
                typeof use === 'object' &&
                use.loader?.includes('css-loader') &&
                use.options?.importLoaders !== undefined &&
                use.options?.modules === false
              ) {
                use.options.url = false;
              }
            }
          }
        }
      }
    }

    return config; 
  },
};

module.exports = nextConfig;

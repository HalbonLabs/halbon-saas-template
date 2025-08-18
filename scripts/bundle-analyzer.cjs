const bundleAnalyzer = () => {
  return {
    env: {
      ANALYZE: process.env.ANALYZE,
    },
    webpack: (config) => {
      if (process.env.ANALYZE) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze/client.html',
            openAnalyzer: false,
          })
        )
      }
      return config
    },
  }
}

module.exports = { bundleAnalyzer }
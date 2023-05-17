import webpack from 'webpack';

const ASSET_PATH = process.env.ASSET_PATH || '172.17.0.1';

module.exports = {
    devServer: {
      host: '172.17.0.1',
      port: 3002,
    },
    output: {
      publicPath: ASSET_PATH,
    }
  };
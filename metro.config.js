module.exports = {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer')
    },
    resolver: {
      sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'], // Add other extensions if necessary
    },
  };
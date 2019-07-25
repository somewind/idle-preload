module.exports = (api) => {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: api.env('cjs') ? 'cjs' : false
        }
      ]
    ]
  }
}

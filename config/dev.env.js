var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://www.emlice.top/api"',
  STATIC_API: '"http://localhost:8989"',
  SOCKET_URL: '"http://localhost:3000"'
})

// 微前端基座应用
const express = require('express')

const app = express()
app.get('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})
app.use(express.static('./app1'))

app.listen(9001, () => {
  console.log('app1 server start at 9001')
})
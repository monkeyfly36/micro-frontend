// 微前端基座应用
const express = require('express')

const app = express()
app.use(express.static('.'))

app.listen(9000, () => {
  console.log('app server start at 9000')
})
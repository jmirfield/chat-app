const express = require('express')
const path = require('path')
const io = require('./index.js')

const app = express()

const publicPath = path.join(__dirname, '../public')
app.use(express.static(publicPath))

module.exports = app
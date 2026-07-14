const express = require('express')
const routes = express.Router()

const { login } = require('../controller/login.controller')

routes.post('/', login)

module.exports = routes
const {Router} = require('express')
const router = Router()

const {register, login} = require('../controllers/enterprise.controller')

router.post('/register', register)
router.post('/login', login)

module.exports = router

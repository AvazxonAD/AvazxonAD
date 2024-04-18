const {Router} = require('express')
const router = Router()

const {createProxy, getAllProxy, deleteProxy, openSearchInnPartner, openSearchInnMy} = require('../controllers/proxy.controller')

const {protect} =  require('../middlewares/auth')

router.post('/add',protect, createProxy)
router.get('/get',protect, getAllProxy)
router.delete('/delete/:id',protect, deleteProxy)
router.get('/search/inn/partner', openSearchInnPartner)
router.get('/search/inn/i', openSearchInnMy)

module.exports = router

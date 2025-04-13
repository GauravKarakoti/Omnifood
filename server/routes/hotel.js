const expres = require('express')
const router = expres.Router()

const{getFood}  = require('../controllers/hotelController')

router.get('/food',getFood)
module.exports = router
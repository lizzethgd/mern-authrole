const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/signup').post(authController.signup)
router.route('/login').post(authController.login)
router.route('/logout').get(authController.logout)

router.use(authController.secure)
router.use(authController.clearanceLevel("level 1"))
router.route("/secretcontent").get(authController.secretContent)

module.exports = router
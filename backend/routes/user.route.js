import express from 'express'
const router = express.Router()

import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload } from '../middlewares/multer.js'
import { register , login  , updateProfile , VerifyEmail, resendOTP } from '../controllers/user.controller.js'

router.route('/register').post(singleUpload , register)
router.route('/verifyemail').post(VerifyEmail)
router.route('/resend').post(resendOTP)
router.route('/login').post(login)
router.route('/profile/update').put(isAuthenticated , singleUpload , updateProfile)

export default router
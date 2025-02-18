import express from 'express'
const router = express.Router()

import isAuthenticated from '../middlewares/isAuthenticated.js'
import { singleUpload , multipleUpload } from '../middlewares/multer.js'
import { register , login  , updateProfile , VerifyEmail, resendOTP, uploadDocuments, getUser } from '../controllers/user.controller.js'

router.route('/register').post(singleUpload , register)
router.route('/uploaddocs').post(multipleUpload , uploadDocuments)
router.route('/verifyemail').post(VerifyEmail)
router.route('/resend').post(resendOTP)
router.route('/login').post(login)
router.route('/profile/update').put(isAuthenticated , singleUpload , updateProfile)
router.route('/get/:userId').get(isAuthenticated  , getUser)

export default router
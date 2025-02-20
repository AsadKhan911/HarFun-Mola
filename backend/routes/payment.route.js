import express from 'express'
const router = express.Router()

import isAuthenticated from '../middlewares/isAuthenticated.js'
import {createPaymentIntent , capturePayment} from '../controllers/payments.controller.js'

router.route('/create-payment-intent').post( createPaymentIntent)
router.route('/capture-payment').post(  capturePayment)


export default router